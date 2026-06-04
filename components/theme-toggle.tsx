"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Eliminate client-side server text mismatches on hydrate
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ActionButton variant="secondary" className="w-full" disabled>
        <div className="h-4 w-4 animate-pulse rounded-full bg-slate-400/20" />
        Syncing Environment...
      </ActionButton>
    );
  }

  const isDark = theme === "dark";

  return (
    <ActionButton
      variant="secondary"
      className="w-full justify-start px-3.5"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-400" />
          <span className="text-slate-300">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-indigo-500" />
          <span className="text-slate-700 dark:text-slate-300">Dark Mode</span>
        </>
      )}
    </ActionButton>
  );
}