import { createContext, useEffect, useState } from "react";
import React from "react";
import { useColorScheme } from "react-native";
import { AppTheme, DarkTheme, LightTheme, ThemeContext } from "./themeContext";


export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const scheme = useColorScheme();

    const [theme, setTheme] = useState<AppTheme>({
      isDarkMode:false,
      colors:LightTheme
    })

    const toggleTheme = () => {
      setTheme({
        isDarkMode: !theme.isDarkMode,
        colors: theme.isDarkMode ? DarkTheme : LightTheme,
      });
    };

    useEffect(() => {
        if(scheme === 'dark'){
            setTheme({
                isDarkMode:true,
                colors: DarkTheme
            })
        }else{
            setTheme({
                isDarkMode:false,
                colors: LightTheme
            })
        }
    },[scheme])

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}