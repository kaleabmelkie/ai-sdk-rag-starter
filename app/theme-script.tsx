"use client";

import { useEffect } from "react";

export function ThemeScript() {
  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    const theme = localStorage.getItem("theme") ?? "system";
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return null;
}
