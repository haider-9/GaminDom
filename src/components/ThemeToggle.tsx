"use client";
import React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  const themes = [
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "light", icon: Sun, label: "Light" },
    { value: "auto", icon: Monitor, label: "Auto" },
  ] as const;

  const colors = [
    { value: "red", color: "#bb3b3b", label: "Red" },
    { value: "blue", color: "#3b7ebb", label: "Blue" },
    { value: "green", color: "#3bbb7e", label: "Green" },
    { value: "purple", color: "#7e3bbb", label: "Purple" },
    { value: "orange", color: "#bb7e3b", label: "Orange" },
    { value: "pink", color: "#bb3b7e", label: "Pink" },
  ] as const;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {/* Theme Toggle */}
      <div className="flex gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-1">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`p-2 rounded-xl transition-colors ${
                theme === themeOption.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
              title={themeOption.label}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>

      {/* Color Toggle */}
      <div className="flex gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-1">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => setAccentColor(color.value)}
            className={`w-8 h-8 rounded-lg border-2 transition-all ${
              accentColor === color.value
                ? "border-[var(--color-text)] scale-110"
                : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: color.color }}
            title={color.label}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;