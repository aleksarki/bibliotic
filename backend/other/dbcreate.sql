DROP FUNCTION IF EXISTS folder_tree_select;
DROP PROCEDURE IF EXISTS folder_tree_delete;
DROP FUNCTION IF EXISTS folder_chain_select;
DROP FUNCTION IF EXISTS folder_get_owner;
DROP FUNCTION IF EXISTS folder_is_child;
DROP PROCEDURE IF EXISTS folder_add;
DROP PROCEDURE IF EXISTS folder_move;
DROP PROCEDURE IF EXISTS account_create;
DROP PROCEDURE IF EXISTS account_delete;

DROP TABLE IF EXISTS Keywords;
DROP TABLE IF EXISTS Annotations;
DROP TABLE IF EXISTS Documents;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Folders;

CREATE TABLE Folders
(
    fldr_id      INTEGER      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fldr_parent  INTEGER      REFERENCES Folders(fldr_id) ON DELETE RESTRICT,  -- subfolder is ought to be deleted before
    fldr_name    VARCHAR(32)  NOT NULL
);

CREATE TABLE Users
(
    usr_id     INTEGER  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    usr_email  TEXT     UNIQUE NOT NULL,
    usr_hash   TEXT     NOT NULL,
    usr_root   INTEGER  UNIQUE NOT NULL REFERENCES Folders(fldr_id) ON DELETE RESTRICT  -- account is ought to be removed before
);

CREATE TABLE Documents
(
    doc_id        INTEGER      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    doc_folder    INTEGER      NOT NULL REFERENCES Folders(fldr_id) ON DELETE RESTRICT,  -- file is ought to be removed before
    doc_filename  TEXT         UNIQUE NOT NULL,
    doc_added     TIMESTAMP    NOT NULL,
    doc_name      VARCHAR(32)  NOT NULL,
    doc_text      TEXT
);

CREATE TABLE Annotations
(
    annot_id        INTEGER  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    annot_document  INTEGER  NOT NULL REFERENCES Documents(doc_id) ON DELETE CASCADE,
    annot_page      INTEGER  NOT NULL CHECK (annot_page >= 0),
    annot_text      TEXT
);

CREATE TABLE Keywords
(
    kwrd_id        INTEGER  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    kwrd_document  INTEGER  NOT NULL REFERENCES Documents(doc_id) ON DELETE CASCADE,
    kwrd_keyword   TEXT     NOT NULL
);

-- Recursively select folders in a hierarchy
-- Return empty set if no such folder exists
CREATE FUNCTION folder_tree_select(root_id INT)
RETURNS SETOF Folders AS $$
BEGIN
	RETURN QUERY
	WITH RECURSIVE FolderHierarchy AS
	(
		SELECT fldr_id, fldr_parent, fldr_name FROM Folders
		WHERE fldr_id = root_id
		UNION ALL
		SELECT Sub.fldr_id, Sub.fldr_parent, Sub.fldr_name FROM Folders Sub
		JOIN FolderHierarchy ON Sub.fldr_parent = FolderHierarchy.fldr_id
	)
	SELECT * FROM FolderHierarchy;
END;
$$ LANGUAGE plpgsql;

-- Recursively delete folders in a hierarchy
CREATE PROCEDURE folder_tree_delete(fldr_id INT) AS $$
DECLARE
    fldr_ids INT[];
BEGIN
    IF EXISTS(SELECT 1 FROM Users WHERE usr_root = fldr_id) THEN
        RAISE EXCEPTION 'Cannot delete user root folder';
    END IF;

    SELECT ARRAY_AGG(FolderHierarchy.fldr_id) FROM folder_tree_select(fldr_id) FolderHierarchy INTO fldr_ids;

    IF NOT fldr_ids @> ARRAY[fldr_id] THEN
        RAISE EXCEPTION 'Folder with id "%" does not exist', fldr_id;
    END IF;

    DELETE FROM Documents WHERE doc_folder = ANY(fldr_ids);
    
    DELETE FROM Folders WHERE Folders.fldr_id = ANY(fldr_ids);

    RAISE NOTICE 'Successfully deleted folders recursively';
END;
$$ LANGUAGE plpgsql;

-- Select chain of folders starting with provided one and ending its root folder
CREATE FUNCTION folder_chain_select(start_id INT)
RETURNS TABLE
(
    fldr_id INT,
    fldr_parent INT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE FolderChain AS
    (
        SELECT F.fldr_id, F.fldr_parent FROM Folders F
        WHERE F.fldr_id = start_id
        UNION ALL
        SELECT P.fldr_id, P.fldr_parent FROM Folders P
        JOIN FolderChain FCh ON P.fldr_id = FCh.fldr_parent
    )
    SELECT * FROM FolderChain;
END;
$$ LANGUAGE plpgsql;

-- Get owner of a folder (that is, user owning the root folder)
-- If no owner found, get -1
CREATE FUNCTION folder_get_owner(fldr_id INT)
RETURNS INT AS $$
DECLARE
    root_id INT;
    owner_id INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Folders WHERE Folders.fldr_id = folder_get_owner.fldr_id) THEN
        RAISE EXCEPTION 'Folder with id "%" does not exist', fldr_id;
    END IF;

    SELECT FCh.fldr_id INTO root_id FROM folder_chain_select(fldr_id) FCh
    WHERE FCh.fldr_parent IS NULL;

    IF root_id IS NULL THEN
        RETURN -1;
    END IF;

    SELECT usr_id INTO owner_id FROM Users
    WHERE usr_root = root_id;

    RETURN COALESCE(owner_id, -1);
END;
$$ LANGUAGE plpgsql;

-- Get whether a folder is subfolder for another one (irregardles of nesting level)
CREATE FUNCTION folder_is_child(fldr_id INT, parent_id INT)
RETURNS BOOLEAN AS $$
DECLARE
    is_child BOOLEAN;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Folders WHERE Folders.fldr_id = folder_is_child.fldr_id) THEN
        RAISE EXCEPTION 'Folder with id "%" does not exist', fldr_id;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM Folders WHERE Folders.fldr_id = folder_is_child.parent_id) THEN
        RAISE EXCEPTION 'Folder with id "%" does not exist', parent_id;
    END IF;

    IF fldr_id = parent_id THEN
        RETURN FALSE;
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM folder_chain_select(fldr_id) FCh
        WHERE FCh.fldr_id = folder_is_child.parent_id
    ) INTO is_child;

    RETURN is_child;
END;
$$ LANGUAGE plpgsql;

-- Add a folder to another one
-- Out: id of created folder
CREATE PROCEDURE folder_add(
    fldr_parent INT, fldr_name VARCHAR(32),
    OUT fldr_id INT
) AS $$
BEGIN
    IF fldr_parent IS NULL THEN
        RAISE EXCEPTION 'Cannot create a top-level (root) folder';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Folders WHERE Folders.fldr_id = folder_add.fldr_parent) THEN
        RAISE EXCEPTION 'Parent folder with id "%" does not exist', fldr_parent;
    END IF;

    IF EXISTS (
        SELECT 1 FROM Folders 
        WHERE Folders.fldr_parent = folder_add.fldr_parent AND Folders.fldr_name = folder_add.fldr_name
    ) THEN
        RAISE EXCEPTION 'Folder with name "%" already exists in parent folder', fldr_name;
    END IF;

    INSERT INTO Folders (fldr_parent, fldr_name) VALUES (fldr_parent, fldr_name)
    RETURNING Folders.fldr_id INTO fldr_id;

    RAISE NOTICE 'Successfully created folder with id "%"', fldr_id;
END;
$$ LANGUAGE plpgsql;

-- Move folder to its new destination
-- Prohibited moves:
--  - move without destination
--  - move of a root folder
--  - move into itself
--  - move to destination owned by different user
--  - move to its subfolder
CREATE PROCEDURE folder_move(fldr_id INT, dest_id INT) AS $$
BEGIN
    -- destination check
    IF dest_id IS NULL THEN
        RAISE EXCEPTION 'Destination folder not provided';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Folders WHERE Folders.fldr_id = folder_move.fldr_id) THEN
        RAISE EXCEPTION 'Source folder with id % does not exist', fldr_id;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM Folders WHERE Folders.fldr_id = folder_move.dest_id) THEN
        RAISE EXCEPTION 'Destination folder with id "%" does not exist', dest_id;
    END IF;
    
    -- root check
    IF EXISTS (SELECT 1 FROM Users WHERE usr_root = fldr_id) THEN
        RAISE EXCEPTION 'Cannot move user root folder';
    END IF;

    -- same check
    IF fldr_id = dest_id THEN
        RAISE EXCEPTION 'Cannot move folder into itself';
    END IF;

    -- ownership check
    IF folder_get_owner(fldr_id) != folder_get_owner(dest_id) THEN
        RAISE EXCEPTION 'Folders do not belong to the same owner';
    END IF;
    
    -- subfolder check
    IF folder_is_child(dest_id, fldr_id) THEN
        RAISE EXCEPTION 'Cannot move folder into its own subfolder';
    END IF;
    
    UPDATE Folders SET fldr_parent = dest_id 
    WHERE Folders.fldr_id = folder_move.fldr_id;
    
    RAISE NOTICE 'Successfully moved folder "%" into folder "%"', fldr_id, dest_id;
END;
$$ LANGUAGE plpgsql;

-- Create new user and their associated root folder
-- Out: id of created user, id of created root folder
CREATE PROCEDURE account_create(
	acc_email TEXT, acc_hash TEXT,
	OUT usr_id INT, OUT fldr_id INT
) AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE usr_email = acc_email) THEN
        RAISE EXCEPTION 'User with email "%" already exists', acc_email;
    END IF;

    INSERT INTO Folders(fldr_parent, fldr_name) VALUES (NULL, '@root')
    RETURNING Folders.fldr_id INTO fldr_id;

    INSERT INTO Users(usr_email, usr_hash, usr_root) VALUES (acc_email, acc_hash, fldr_id)
    RETURNING Users.usr_id INTO usr_id;
END;
$$ LANGUAGE plpgsql;

-- Delete an account (that is, user and their root folder)
CREATE PROCEDURE account_delete(usr_id INT) AS $$
DECLARE
    usr_root INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE Users.usr_id = account_delete.usr_id) THEN
        RAISE EXCEPTION 'User with id "%" does not exist', usr_id;
    END IF;

    SELECT Users.usr_root INTO usr_root FROM Users WHERE Users.usr_id = account_delete.usr_id;

    DELETE FROM Users WHERE Users.usr_id = account_delete.usr_id;

    CALL folder_tree_delete(usr_root);

    RAISE NOTICE 'Successfully deleted account';
END;
$$ LANGUAGE plpgsql;
