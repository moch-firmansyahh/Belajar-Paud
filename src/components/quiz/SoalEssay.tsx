"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MAX_ESSAY_CHARACTERS } from "@/constants";
import { SoalEssay as SoalEssayType } from "@/types";

interface SoalEssayProps {
  soal: SoalEssayType;
  nomorSoal: number;
  jawaban?: string;
  onJawab: (text: string) => void;
}

export function SoalEssay({
  soal,
  nomorSoal,
  jawaban = "",
  onJawab,
}: SoalEssayProps) {
  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case "mudah":
        return <Badge variant="outline" className="text-emerald-600 border-emerald-500/40 text-[11px]">Mudah</Badge>;
      case "sulit":
        return <Badge variant="outline" className="text-purple-600 border-purple-500/40 text-[11px]">Sulit</Badge>;
      case "sedang":
      default:
        return <Badge variant="outline" className="text-amber-600 border-amber-500/40 text-[11px]">Sedang</Badge>;
    }
  };

  const charCount = jawaban.length;
  const isNearLimit = charCount >= MAX_ESSAY_CHARACTERS - 100;

  return (
    <Card id={`soal-${soal.id}`} className="rounded-2xl border-2 shadow-xs transition-all">
      <CardHeader className="pb-3 pt-4 sm:pt-5 px-4 sm:px-6">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-xs">
              {nomorSoal}
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Essay / Studi Kasus
            </span>
          </div>

          <div className="flex items-center gap-2">
            {getDifficultyBadge(soal.kesulitan)}
            <Badge variant="secondary" className="text-[11px] font-normal text-muted-foreground">
              {soal.kartuRujukan}
            </Badge>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-foreground pt-2 leading-relaxed">
          {soal.pertanyaan}
        </h3>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 space-y-2">
        <Textarea
          id={`textarea-${soal.id}`}
          placeholder="Tuliskan analisis atau jawabanmu di sini berdasarkan materi yang telah kamu pelajari..."
          value={jawaban}
          onChange={(e) => {
            const val = e.target.value;
            if (val.length <= MAX_ESSAY_CHARACTERS) {
              onJawab(val);
            }
          }}
          rows={5}
          className="resize-y min-h-[120px] rounded-xl text-base sm:text-sm leading-relaxed p-3.5 focus-visible:ring-primary/40"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-muted-foreground pt-1">
          <span>Jawab dengan argumen atau contoh yang jelas</span>
          <span
            className={`font-medium ${
              isNearLimit ? "text-amber-600 font-bold" : ""
            }`}
          >
            {charCount} / {MAX_ESSAY_CHARACTERS} karakter
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
