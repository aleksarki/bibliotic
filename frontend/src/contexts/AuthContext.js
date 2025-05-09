import React, { createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const usr_id = localStorage.getItem("usr_id");
            const usr_email = localStorage.getItem("usr_email");
            if (usr_id && usr_email) {
                setCurrentUser({ usr_id, usr_email});
            }
        }
        setLoading(false);
    }, []);

    async function login(email, password) {
        try {
            const {access_token} = (
                await axios.post("http://localhost:3000/auth/login", {
                    "email": email,
                    "password": password
                })
            ).data;
            localStorage.setItem("token", access_token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

            const {usr_id, usr_email} = (await axios.get("http://localhost:3000/auth/user")).data;
            localStorage.setItem("usr_id", usr_id);
            localStorage.setItem("usr_email", usr_email);

            setCurrentUser({usr_id, usr_email});
            return {success: true};
        }
        catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    }

    async function register(email, password) {
        return {
            success: false,
            message: "Registration failed"
        };
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usr_id");
        localStorage.removeItem("usr_email");
        delete axios.defaults.headers.common["Authorization"];
        setCurrentUser(null);
    }

    const value = {
        "currentUser": currentUser,
        "login": login,
        "register": register,
        "logout": logout
    };

    return (
        <AuthContext.Provider value={ value }>
            { !loading && children }
        </AuthContext.Provider>
    );
}
