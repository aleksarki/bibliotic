DROP FUNCTION IF EXISTS get_folder_hierarchy;
DROP FUNCTION IF EXISTS add_folder;
DROP PROCEDURE IF EXISTS delete_folder_hierarchy;
DROP FUNCTION IF EXISTS create_new_account;

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
CREATE FUNCTION get_folder_hierarchy(root_id INT)
RETURNS SETOF Folders AS $$
BEGIN
	RETURN QUERY
	WITH RECURSIVE FolderHierarchy AS
	(
		SELECT fldr_id, fldr_parent, fldr_name FROM Folders
		WHERE fldr_id = root_id
		UNION ALL
		SELECT Sub.fldr_id, Sub.fldr_parent, Sub.fldr_name FROM Folders Sub
		JOIN FolderHierarchy ON (Sub.fldr_parent = FolderHierarchy.fldr_id)
	)
	SELECT * FROM FolderHierarchy;
END;
$$ LANGUAGE plpgsql;

-- Add a folder to another one
CREATE FUNCTION add_folder(
    fldr_parent INT, fldr_name VARCHAR(32),
    OUT fldr_id INT
) AS $$
BEGIN
    IF fldr_parent IS NULL THEN
        RAISE EXCEPTION 'Cannot create a top-level (root) folder';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Folders WHERE Folders.fldr_id = add_folder.fldr_parent) THEN
        RAISE EXCEPTION 'Parent folder with id "%" does not exist', fldr_parent;
    END IF;

    IF EXISTS (
        SELECT 1 FROM Folders 
        WHERE Folders.fldr_parent = add_folder.fldr_parent AND Folders.fldr_name = add_folder.fldr_name
    ) THEN
        RAISE EXCEPTION 'Folder with name "%" already exists in parent folder', fldr_name;
    END IF;

    INSERT INTO Folders (fldr_parent, fldr_name) VALUES (fldr_parent, fldr_name)
    RETURNING Folders.fldr_id INTO fldr_id;

    RAISE NOTICE 'Successfully created folder with id "%"', fldr_id;
END;
$$ LANGUAGE plpgsql;

-- Recursively delete folders in a hierarchy
CREATE PROCEDURE delete_folder_hierarchy(fldr_id INT) AS $$
DECLARE
    fldr_ids INT[];
BEGIN
    IF EXISTS(SELECT 1 FROM Users WHERE usr_root = fldr_id) THEN
        RAISE EXCEPTION 'Cannot delete user root folder';
    END IF;

    SELECT ARRAY_AGG(FolderHierarchy.fldr_id) FROM get_folder_hierarchy(fldr_id) FolderHierarchy INTO fldr_ids;

    IF NOT fldr_ids @> ARRAY[fldr_id] THEN
        RAISE EXCEPTION 'Folder with id "%" does not exist', fldr_id;
    END IF;

    DELETE FROM Documents WHERE doc_folder = ANY(fldr_ids);
    
    DELETE FROM Folders WHERE Folders.fldr_id = ANY(fldr_ids);

    RAISE NOTICE 'Successfully deleted folders recursively';
END;
$$ LANGUAGE plpgsql;

-- Create new user and their associated root folder
CREATE FUNCTION create_new_account(
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
