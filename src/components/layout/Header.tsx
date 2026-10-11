"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BookOpen, Sparkles, History } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Materi", icon: BookOpen },
    { href: "/quiz", label: "Quiz AI", icon: Sparkles },
    { href: "/riwayat", label: "Riwayat", icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          id="link-nav-home"
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-102"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Belajar PAUD
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline-block ml-2 font-medium bg-muted px-2 py-0.5 rounded-full">
              Kelompok 11
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/" || pathname.startsWith("/materi")
                  : pathname.startsWith(item.href);

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`h-10 px-3 sm:px-4 text-sm font-medium transition-all ${
                    isActive
                      ? "font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Link
                    id={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    href={item.href}
                    className="flex items-center gap-1.5"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="md:ml-1 md:pl-2 md:border-l md:border-border/60">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
