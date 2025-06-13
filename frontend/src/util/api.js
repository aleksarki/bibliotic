/*
 * This file provides convinient way to perform various backend requests.
 * Notation: type of request + controller + name of request
 */

import axios from "axios";

// AUTH

export async function postAuthRegister(email, password) {
    return (
        await axios.post("http://localhost:3000/auth/register", {
            "email": email,
            "hash": password
        })
    ).data;
}

export async function postAuthLogin(email, password) {
    return (
        await axios.post("http://localhost:3000/auth/login", {
            "email": email,
            "password": password
        })
    ).data;
}

export async function getAuthUser(config = null) {
    return (await axios.get("http://localhost:3000/auth/user", config)).data;
}

export function getDocumentCatalogue(dataSetter) {
    try {
        axios.get("http://localhost:3000/document/catalogue").then(response => {
            dataSetter(response.data);
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

// DOCUMENT

export function postDocumentUpload(file, folder, name, onFulfil) {
    const data = new FormData();
    data.append("file", file);
    data.append("folder", folder);
    data.append("name", name);

    try {
        axios.post("http://localhost:3000/document/upload", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(response => onFulfil?.(response));
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export function deleteDocumentDelete(doc_id, onFulfil) {
    try {
        axios.delete(`http://localhost:3000/document/delete?doc_id=${doc_id}`)
            .then(request => onFulfil?.());
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getDocumentPreview(document) {
    try {
        const response = await axios.get(`http://localhost:3000/document/preview?doc_id=${document.item_id}`);
        const imagePath = response.data;
        return imagePath;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export function patchDocumentRename(doc_id, doc_newName, onFulfil) {
    try {
        axios.patch(`http://localhost:3000/document/rename?doc_id=${doc_id}&doc_newName=${doc_newName}`)
            .then(request => onFulfil?.());
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export function getDocumentFile(doc_id, onFulfil) {
    try {
        axios.get(`http://localhost:3000/document/file?doc_id=${doc_id}`)
            .then(request => onFulfil?.(request));
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

// FOLDER

export function patchFolderRename(fldr_id, fldr_newName, onFulfil) {
    try {
        axios.patch(`http://localhost:3000/folder/rename?fldr_id=${fldr_id}&fldr_newName=${fldr_newName}`)
            .then(request => onFulfil?.());
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export function postFolderCreate(fldr_id, fldr_name, onFulfil) {
    try {
        axios.post(`http://localhost:3000/folder/create?fldr_id=${fldr_id}&fldr_name=${fldr_name}`)
            .then(request => onFulfil?.());
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export function deleteFolderDelete(fldr_id, onFulfil) {
    try {
        axios.delete(`http://localhost:3000/folder/delete?fldr_id=${fldr_id}`)
            .then(request => onFulfil?.());
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}