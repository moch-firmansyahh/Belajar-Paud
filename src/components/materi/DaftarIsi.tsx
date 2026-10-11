"use client";

import React, { useState } from "react";
import { List, CheckCircle2, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { KartuMateri } from "@/types";

interface DaftarIsiProps {
  kartu: KartuMateri[];
  slug: string;
  isPaham: (slug: string, kartuId: string) => boolean;
}

interface NavItemsProps {
  kartu: KartuMateri[];
  slug: string;
  isPaham: (slug: string, kartuId: string) => boolean;
  onSelect?: () => void;
}

function NavItems({ kartu, slug, isPaham, onSelect }: NavItemsProps) {
  return (
    <nav className="space-y-1 py-1" aria-label="Daftar isi materi">
      {kartu.map((item, idx) => {
        const paham = isPaham(slug, item.id);
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => {
              if (onSelect) onSelect();
            }}
            className="group flex items-start gap-2.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          >
            <div className="mt-0.5 shrink-0">
              {paham ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-muted-foreground/70 bg-muted">
                  {idx + 1}
                </span>
              )}
            </div>
            <span className="flex-1 leading-snug line-clamp-2 text-left">
              {item.judul}
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 shrink-0 mt-0.5" />
          </a>
        );
      })}
      <a
        href="#kata-kunci"
        onClick={() => {
          if (onSelect) onSelect();
        }}
        className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-primary hover:bg-accent transition-all mt-2 pt-2 border-t"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] bg-primary/10 text-primary font-bold">
          #
        </span>
        <span className="flex-1">Kata Kunci & Istilah</span>
      </a>
    </nav>
  );
}

export function DaftarIsi({ kartu, slug, isPaham }: DaftarIsiProps) {
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 rounded-2xl border bg-card/60 backdrop-blur-md p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 px-2 font-semibold text-sm text-foreground">
            <List className="h-4 w-4 text-primary" />
            <span>Daftar Isi ({kartu.length} Bagian)</span>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)] pr-2">
            <NavItems kartu={kartu} slug={slug} isPaham={isPaham} />
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile Floating Button & Sheet */}
      <div className="lg:hidden fixed bottom-20 right-4 sm:right-6 z-30">
        <Button
          id="btn-buka-daftar-isi-mobile"
          size="lg"
          onClick={() => setOpenMobile(true)}
          className="rounded-full shadow-xl gap-2 h-11 sm:h-12 px-4 sm:px-5 font-bold cursor-pointer border border-primary/20 backdrop-blur-md active:scale-95 transition-transform"
        >
          <List className="h-4.5 w-4.5" />
          <span>Daftar Isi</span>
        </Button>
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] p-5">
            <SheetHeader className="pb-3 text-left">
              <SheetTitle className="flex items-center gap-2 text-base font-bold">
                <List className="h-4 w-4 text-primary" />
                Daftar Isi Materi
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[60vh] pr-2">
              <NavItems
                kartu={kartu}
                slug={slug}
                isPaham={isPaham}
                onSelect={() => setOpenMobile(false)}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
