/*
 * Context providing information of currently used theme.
 */

import { createContext, useContext, useEffect, useState } from "react";

export const themes = {
    LIGHT: "light",
    DARK: "dark",
    SKEUO: "skeuo"
    //skeuo_dark: "skeuo-dark"
};

export const skeuomorphThemes = [themes.SKEUO];

export const ThemeContext = createContext({});

function getTheme() {
    const theme = `${window?.localStorage?.getItem("theme")}`;
    if (Object.values(themes).includes(theme))
        return theme;

    const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
    if (userMedia.matches)
        return themes.DARK;

    return themes.LIGHT;
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={ {theme, setTheme} }>
            { children }
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
