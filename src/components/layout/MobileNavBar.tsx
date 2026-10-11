"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles, History } from "lucide-react";

export function MobileNavBar() {
  const pathname = usePathname();

  // Sembunyikan bottom nav di halaman pengerjaan kuis agar tidak tumpang tindih dengan action bar kirim
  if (pathname === "/quiz/kerjakan") {
    return null;
  }

  const navItems = [
    {
      href: "/",
      label: "Materi",
      icon: BookOpen,
      isActive: pathname === "/" || pathname.startsWith("/materi"),
      id: "bottom-nav-materi",
    },
    {
      href: "/quiz",
      label: "Quiz AI",
      icon: Sparkles,
      isActive: pathname.startsWith("/quiz"),
      id: "bottom-nav-quiz",
    },
    {
      href: "/riwayat",
      label: "Riwayat",
      icon: History,
      isActive: pathname.startsWith("/riwayat"),
      id: "bottom-nav-riwayat",
    },
  ];

  return (
    <nav
      aria-label="Navigasi Mobile Bawah"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/92 backdrop-blur-xl md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.07)] transition-all"
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0.5rem))",
      }}
    >
      <div className="grid grid-cols-3 h-14 items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              id={item.id}
              href={item.href}
              className={`group flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
                item.isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              <div
                className={`relative flex items-center justify-center h-7 w-12 rounded-full transition-all duration-200 ${
                  item.isActive
                    ? "bg-primary/15 text-primary scale-105"
                    : "group-hover:bg-muted/60"
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 transition-transform duration-200 ${
                    item.isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                  }`}
                />
              </div>
              <span
                className={`text-[11px] tracking-tight transition-colors ${
                  item.isActive ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
