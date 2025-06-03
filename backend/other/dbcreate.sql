DROP FUNCTION IF EXISTS folder_tree_select;
DROP PROCEDURE IF EXISTS folder_tree_delete;
DROP FUNCTION IF EXISTS folder_chain_select;
DROP FUNCTION IF EXISTS folder_get_owner;
DROP FUNCTION IF EXISTS folder_is_child;
DROP PROCEDURE IF EXISTS folder_add;
DROP PROCEDURE IF EXISTS folder_move;
DROP PROCEDURE IF EXISTS account_create;
DROP PROCEDURE IF EXISTS account_delete;
DROP FUNCTION IF EXISTS document_get_owner;
DROP PROCEDURE IF EXISTS document_add;
DROP PROCEDURE IF EXISTS document_delete;
DROP PROCEDURE IF EXISTS document_move;
DROP FUNCTION IF EXISTS item_tree_select;
DROP PROCEDURE IF EXISTS annotation_add;
DROP PROCEDURE IF EXISTS annotation_delete;
DROP FUNCTION IF EXISTS document_get_annotations;
DROP PROCEDURE IF EXISTS keyword_add;
DROP FUNCTION IF EXISTS document_get_keywords;

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
    doc_text      TEXT,
    doc_preview   TEXT
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

-- Get owner of a document (that is, user owning the root folder)
-- If no owner found, get -1
CREATE FUNCTION document_get_owner(doc_id INT)
RETURNS INT AS $$
DECLARE
    folder_id INT;
	owner_id INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Documents WHERE Documents.doc_id = document_get_owner.doc_id) THEN
        RAISE EXCEPTION 'Document with id "%" does not exist', doc_id;
    END IF;
	
	SELECT Documents.doc_folder INTO folder_id FROM Documents WHERE Documents.doc_id = document_get_owner.doc_id;
	
	SELECT folder_get_owner(folder_id) INTO owner_id;
    RETURN COALESCE(owner_id, -1);
END;
$$ LANGUAGE plpgsql;

-- Add a new document in folder
-- Out: id of created document
CREATE PROCEDURE document_add(
	doc_folder INT, 
	doc_filename TEXT,
    doc_added TIMESTAMP,
    doc_name VARCHAR(32), 
    doc_text TEXT,
    OUT doc_id INT) AS $$
DECLARE
    folder_id INT;
	owner_id INT;
BEGIN
    IF doc_folder IS NULL THEN
        RAISE EXCEPTION 'Document folder cannot be NULL';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Folders WHERE Folders.fldr_id = document_add.doc_folder) THEN
        RAISE EXCEPTION 'Folder with id "%" does not exist', doc_folder;
    END IF;

    IF EXISTS (
        SELECT 1 FROM Documents 
        WHERE Documents.doc_folder = document_add.doc_folder AND Documents.doc_filename = document_add.doc_filename
    ) THEN
        RAISE EXCEPTION 'Document with name "%" already exists in this folder', doc_filename;
    END IF;

    INSERT INTO Documents (doc_folder, doc_filename, doc_added, doc_name, doc_text) VALUES (doc_folder, doc_filename, doc_added, doc_name, doc_text)
    RETURNING Documents.doc_id INTO doc_id;

    RAISE NOTICE 'Successfully created folder with id "%"', doc_id;
END;
$$ LANGUAGE plpgsql;

-- Delete document
CREATE PROCEDURE document_delete(doc_id INT) AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Documents WHERE Documents.doc_id = document_delete.doc_id) THEN
        RAISE EXCEPTION 'Document with id "%" does not exist', document_delete.doc_id;
    END IF;

    DELETE FROM Documents WHERE Documents.doc_id = document_delete.doc_id;

    RAISE NOTICE 'Successfully deleted document';
END;
$$ LANGUAGE plpgsql;

-- Move document to its new destination
-- Prohibited moves:
--  - move without destination
--  - move to destination owned by different user
CREATE PROCEDURE document_move(doc_id INT, dest_id INT) AS $$
BEGIN
    -- destination check
    IF dest_id IS NULL THEN
        RAISE EXCEPTION 'Destination folder not provided';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM Folders WHERE Folders.fldr_id = document_move.dest_id) THEN
        RAISE EXCEPTION 'Destination folder with id "%" does not exist', dest_id;
    END IF;

    -- ownership check
    IF document_get_owner(doc_id) != folder_get_owner(dest_id) THEN
        RAISE EXCEPTION 'Document and destination folder do not belong to the same owner';
    END IF;

    -- TODO: Check if document named the same way already exists in destination

    UPDATE Documents SET doc_folder = dest_id 
    WHERE Documents.doc_id = document_move.doc_id;
    
    RAISE NOTICE 'Successfully moved Document "%" into folder "%"', doc_id, dest_id;
END;
$$ LANGUAGE plpgsql;

-- Select folders and documents inside root folder hierarchically
CREATE FUNCTION item_tree_select(root_id INT)
RETURNS TABLE
(
	item_type TEXT,
	item_id INT,
	item_parent INT,
	item_name VARCHAR(32),
	item_added TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
	WITH FolderTree AS (
		SELECT
			'folder' AS item_type, fldr_id AS item_id, fldr_parent AS item_parent,
			fldr_name AS item_name, NULL::TIMESTAMP AS item_added
		FROM folder_tree_select(root_id)
	)
	SELECT * FROM FolderTree
	UNION ALL
	SELECT
		'document' AS item_type, doc_id AS item_id, doc_folder AS item_parent, doc_name AS item_name,
		doc_added AS item_added
	FROM Documents d
	JOIN FolderTree ft ON d.doc_folder = ft.item_id;
END;
$$ LANGUAGE plpgsql;

-- Add a new annotation to a document
-- Out: id of created annotation
CREATE PROCEDURE annotation_add(
	annot_document INT,
    annot_page INT,
    annot_text TEXT,
  	OUT annot_id INT) AS $$
BEGIN
    IF annot_document IS NULL THEN
        RAISE EXCEPTION 'Document cannot be NULL';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Documents WHERE Documents.doc_id = annotation_add.annot_document) THEN
        RAISE EXCEPTION 'Document with id "%" does not exist', annot_document;
    END IF;

    INSERT INTO Annotations (annot_document, annot_page, annot_text) VALUES (annot_document, annot_page, annot_text)
    RETURNING Annotations.annot_id INTO annot_id;

    RAISE NOTICE 'Successfully created annotation with id "%"', annot_id;
END;
$$ LANGUAGE plpgsql;


-- Delete annotation
CREATE PROCEDURE annotation_delete(annot_id INT) AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Annotations WHERE Annotations.annot_id = annotation_delete.annot_id) THEN
        RAISE EXCEPTION 'Annotation with id "%" does not exist', annotation_delete.annot_id;
    END IF;

    DELETE FROM Annotations WHERE Annotations.annot_id = annotation_delete.annot_id;

    RAISE NOTICE 'Successfully deleted annotation';
END;
$$ LANGUAGE plpgsql;


-- Get annotations of document
CREATE FUNCTION document_get_annotations(doc_id INT)
RETURNS SETOF Annotations AS $$
BEGIN
    IF doc_id IS NULL THEN
        RAISE EXCEPTION 'Document cannot be NULL';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Documents WHERE Documents.doc_id = document_get_annotations.doc_id) THEN
        RAISE EXCEPTION 'Document with id "%" does not exist', doc_id;
    END IF;

    RETURN QUERY SELECT * FROM Annotations WHERE annot_document = doc_id;
END;
$$ LANGUAGE plpgsql;


-- Keyword creation
CREATE PROCEDURE keyword_add(
    kwrd_document INT,
    kwrd_keyword TEXT,
    OUT kwrd_id INT
) AS $$
BEGIN
    -- Checking the existence of a document
    IF NOT EXISTS (SELECT 1 FROM Documents WHERE doc_id = keyword_add.kwrd_document) THEN
        RAISE EXCEPTION 'Document with id "%" does not exist', kwrd_document;
    END IF;

    -- Check for empty keyword
    IF kwrd_keyword IS NULL OR kwrd_keyword = '' THEN
        RAISE EXCEPTION 'Keyword cannot be empty';
    END IF;

    -- Checking for the existence of the same keyword for this document
    IF EXISTS (
        SELECT 1 FROM Keywords 
        WHERE Keywords.kwrd_document = keyword_add.kwrd_document 
        AND Keywords.kwrd_keyword = keyword_add.kwrd_keyword
    ) THEN
        RAISE EXCEPTION 'Keyword "%" already exists for document %', kwrd_keyword, kwrd_document;
    END IF;

    -- Adding a keyword
    INSERT INTO Keywords (kwrd_document, kwrd_keyword)
    VALUES (keyword_add.kwrd_document, keyword_add.kwrd_keyword)
    RETURNING Keywords.kwrd_id INTO kwrd_id;

    RAISE NOTICE 'Successfully added keyword with id "%" to document %', keyword_add.kwrd_id, keyword_add.kwrd_document;
END;
$$ LANGUAGE plpgsql;


-- Getting keywords for a document
CREATE FUNCTION document_get_keywords(
    doc_id INT
) RETURNS SETOF Keywords AS $$
BEGIN
    -- Checking the existence of a document
    IF NOT EXISTS (SELECT 1 FROM Documents WHERE Documents.doc_id = document_get_keywords.doc_id) THEN
        RAISE EXCEPTION 'Document with id "%" does not exist', doc_id;
    END IF;

    -- Return all keywords for the document
    RETURN QUERY 
    SELECT * FROM Keywords 
    WHERE Keywords.kwrd_document = document_get_keywords.doc_id
    ORDER BY Keywords.kwrd_keyword;
END;
$$ LANGUAGE plpgsql;
