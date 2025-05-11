import axios from "axios";

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

