"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeSwitch() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const currentTheme = theme === "system" ? systemTheme : theme;
    useEffect(() => setMounted(true), []);
    return (
        <div>
            {mounted &&
                (currentTheme === "dark" ? (
                    <Sun
                        onClick={() => setTheme("light")}
                        className="text-xl cursor-pointer hover:text-amber-500"
                    />
                ) : (
                    <Moon
                        onClick={() => setTheme("dark")}
                        className="text-xl cursor-pointer hover:text-amber-500"
                    />
                ))}
        </div>
    );
}
