import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getAuthUser, postAuthLogin } from "../util/api";

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login(email, password) {
        try {
            const {access_token} = await postAuthLogin(email, password);
            localStorage.setItem("token", access_token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

            const {usr_id, usr_email} = await getAuthUser();
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
        // TODO: implement
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

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // make sure token is not expired
                await getAuthUser({
                    headers: {"Authorization": `Bearer ${token}`}
                });
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                const usr_id = localStorage.getItem("usr_id");
                const usr_email = localStorage.getItem("usr_email");
                if (usr_id && usr_email) {
                    setCurrentUser({ usr_id, usr_email});
                }
            }
            catch (error) {
                logout();
            }            
        }
        else {
            logout();
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        "currentUser": currentUser,
        "login": login,
        "register": register,
        "logout": logout,
        "loading": loading
    };

    return (
        <AuthContext.Provider value={ value }>
            { !loading && children }
        </AuthContext.Provider>
    );
}
