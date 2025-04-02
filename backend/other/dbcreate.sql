DROP TABLE IF EXISTS Keyword;
DROP TABLE IF EXISTS Annotation;
DROP TABLE IF EXISTS Document;
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS Folder;

CREATE TABLE Folder
(
    fldr_id      INTEGER      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fldr_parent  INTEGER      REFERENCES Folder(fldr_id) ON DELETE RESTRICT,  -- subfolder is ought to be deleted before
    fldr_name    VARCHAR(32)  NOT NULL
);

CREATE TABLE Account
(
    acc_id     INTEGER  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    acc_email  TEXT     UNIQUE NOT NULL,
    acc_hash   TEXT     NOT NULL,
    acc_root   INTEGER  UNIQUE NOT NULL REFERENCES Folder(fldr_id) ON DELETE RESTRICT  -- account is ought to be removed before
);

CREATE TABLE Document
(
    doc_id        INTEGER      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    doc_folder    INTEGER      NOT NULL REFERENCES Folder(fldr_id) ON DELETE RESTRICT,  -- file is ought to be removed before
    doc_filename  TEXT         UNIQUE NOT NULL,
    doc_added     TIMESTAMP    NOT NULL,
    doc_name      VARCHAR(32)  NOT NULL,
    doc_text      TEXT
);

CREATE TABLE Annotation
(
    annot_id        INTEGER  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    annot_document  INTEGER  NOT NULL REFERENCES Document(doc_id) ON DELETE CASCADE,
    annot_page      INTEGER  NOT NULL CHECK (annot_page >= 0),
    annot_text      TEXT
);

CREATE TABLE Keyword
(
    kwrd_id        INTEGER  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    kwrd_document  INTEGER  NOT NULL REFERENCES Document(doc_id) ON DELETE CASCADE,
    kwrd_keyword   TEXT     NOT NULL
);
