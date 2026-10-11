"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        id="theme-toggle-skeleton"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full opacity-60"
        aria-label="Memuat tema"
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      id="btn-toggle-theme"
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full transition-transform active:scale-95 hover:bg-accent cursor-pointer"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Ganti ke mode ${isDark ? "terang" : "gelap"}`}
      title={`Mode ${isDark ? "Terang" : "Gelap"}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-all hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-all hover:-rotate-12" />
      )}
    </Button>
  );
}
