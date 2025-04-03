import { createContext, useContext, useEffect, useState } from "react";

export const themes = {
    light: "light",
    dark: "dark",
    skeuo: "skeuo"
    //skeuo_dark: "skeuo-dark"
};

export const ThemeContext = createContext({});

function getTheme() {
    const theme = `${window?.localStorage?.getItem("theme")}`;
    if (Object.values(themes).includes(theme))
        return theme;

    const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
    if (userMedia.matches)
        return themes.dark;

    return themes.light;
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
