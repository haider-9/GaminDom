"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "auto";
type AccentColor = "red" | "blue" | "green" | "purple" | "orange" | "pink";

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  effectiveTheme: "dark" | "light"; // The actual theme being used (resolves "auto")
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [accentColor, setAccentColor] = useState<AccentColor>("red");
  const [effectiveTheme, setEffectiveTheme] = useState<"dark" | "light">("dark");

  // Load theme and accent color from localStorage on mount
  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage after component mounts (client-side)
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.theme) setTheme(settings.theme);
          if (settings.accentColor) setAccentColor(settings.accentColor);
        } catch (error) {
          console.error("Failed to parse saved settings:", error);
        }
      }
    }
  }, []);

  // Update effective theme when theme changes or system preference changes
  useEffect(() => {
    if (!mounted) return;
    
    const updateEffectiveTheme = () => {
      if (theme === "auto") {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setEffectiveTheme(systemPrefersDark ? "dark" : "light");
      } else {
        setEffectiveTheme(theme);
      }
    };

    updateEffectiveTheme();

    // Listen for system theme changes when using auto theme
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateEffectiveTheme);
      return () => mediaQuery.removeEventListener("change", updateEffectiveTheme);
    }
  }, [theme, mounted]);

  // Apply theme and accent color to document
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    
    // Set theme attribute
    root.setAttribute("data-theme", theme);
    
    // Set accent color attribute
    root.setAttribute("data-accent", accentColor);
    
    // Add theme transition class for smooth transitions
    root.classList.add("theme-transition");
    
    // Save to localStorage (only on client-side)
    if (typeof window !== 'undefined') {
      const currentSettings = localStorage.getItem("userSettings");
      let settings = {};
      
      if (currentSettings) {
        try {
          settings = JSON.parse(currentSettings);
        } catch (error) {
          console.error("Failed to parse current settings:", error);
        }
      }
      
      const updatedSettings = {
        ...settings,
        theme,
        accentColor,
      };
      
      localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    }
  }, [theme, accentColor, mounted]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSetAccentColor = (newColor: AccentColor) => {
    setAccentColor(newColor);
  };

  const value: ThemeContextType = {
    theme,
    accentColor,
    setTheme: handleSetTheme,
    setAccentColor: handleSetAccentColor,
    effectiveTheme,
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};