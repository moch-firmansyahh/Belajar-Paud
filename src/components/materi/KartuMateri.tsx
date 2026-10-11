"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Lightbulb, Info } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TahapErikson } from "./TahapErikson";
import { KartuMateri as KartuMateriType } from "@/types";

interface KartuMateriProps {
  kartu: KartuMateriType;
  slug: string;
  isPaham: boolean;
  onTogglePaham: (slug: string, kartuId: string) => void;
}

export function KartuMateri({
  kartu,
  slug,
  isPaham,
  onTogglePaham,
}: KartuMateriProps) {
  const isErikson =
    kartu.id.includes("psikososial") ||
    kartu.isiMarkdown.includes("Percaya vs Tidak percaya");

  return (
    <Card
      id={kartu.id}
      className={`scroll-mt-24 transition-all duration-200 border-2 shadow-xs ${
        isPaham
          ? "border-emerald-500/50 bg-emerald-50/20 dark:border-emerald-500/40 dark:bg-emerald-950/10"
          : "border-border/80 hover:border-primary/40 hover:shadow-md"
      }`}
    >
      <CardHeader className="pb-3 pt-4 sm:pt-5 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            {kartu.label && (
              <Badge
                variant="outline"
                className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 border-primary/25 bg-primary/5 text-primary"
              >
                {kartu.label}
              </Badge>
            )}
            <h3
              className="text-lg sm:text-xl font-bold tracking-tight"
              style={{ color: "var(--aksen)" }}
            >
              {kartu.judul}
            </h3>
          </div>

          {/* Tombol Checklist Sudah Paham */}
          <div className="flex items-center shrink-0 self-end sm:self-center">
            <label
              htmlFor={`check-${kartu.id}`}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold cursor-pointer transition-all select-none min-h-[40px] active:scale-95 shadow-2xs ${
                isPaham
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs dark:bg-emerald-600"
                  : "border-muted-foreground/30 bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Checkbox
                id={`check-${kartu.id}`}
                checked={isPaham}
                onCheckedChange={() => onTogglePaham(slug, kartu.id)}
                className="sr-only"
              />
              <Check className={`h-4 w-4 ${isPaham ? "stroke-[3]" : "opacity-40"}`} />
              <span>{isPaham ? "Sudah Paham" : "Tandai Paham"}</span>
            </label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:px-6 pb-6">
        {/* Kotak Apa itu */}
        {kartu.apaItu && (
          <div className="kotak-apa-itu rounded-r-xl p-3.5 sm:p-4 text-sm text-foreground/90 transition-colors">
            <div className="flex items-start gap-2.5">
              <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--aksen)" }} />
              <div>
                <span className="font-semibold block text-xs uppercase tracking-wide mb-0.5" style={{ color: "var(--aksen)" }}>
                  Apa itu:
                </span>
                <p className="leading-relaxed">{kartu.apaItu}</p>
              </div>
            </div>
          </div>
        )}

        {/* Isi Kartu: Jika Erikson pakai komponen khusus, jika kartu biasa render Markdown */}
        {isErikson ? (
          <TahapErikson />
        ) : (
          kartu.isiMarkdown && (
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ul: ({ children }) => (
                    <ul className="space-y-2.5 my-2 list-none pl-0">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed pl-1">
                      <span
                        className="h-2 w-2 rounded-full shrink-0 mt-2"
                        style={{ backgroundColor: "var(--aksen)" }}
                      />
                      <span className="flex-1">{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-foreground underline decoration-primary/30 decoration-2 underline-offset-2">
                      {children}
                    </strong>
                  ),
                }}
              >
                {kartu.isiMarkdown}
              </ReactMarkdown>
            </div>
          )
        )}

        {/* Kotak Ingat */}
        {kartu.ingat && (
          <div className="kotak-ingat rounded-r-xl p-3.5 sm:p-4 text-sm transition-colors shadow-2xs">
            <div className="flex items-start gap-2.5">
              <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-700 dark:text-amber-300" />
              <div>
                <span className="font-bold block text-xs uppercase tracking-wider mb-0.5 text-amber-800 dark:text-amber-200">
                  Ingat:
                </span>
                <p className="leading-relaxed text-amber-950 dark:text-amber-100 font-medium">
                  {kartu.ingat}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
