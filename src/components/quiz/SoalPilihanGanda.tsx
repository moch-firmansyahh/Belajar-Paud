"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SoalPg } from "@/types";

interface SoalPilihanGandaProps {
  soal: SoalPg;
  nomorSoal: number;
  jawabanTerpilih?: number;
  onPilihJawaban: (optionIndex: number) => void;
}

export function SoalPilihanGanda({
  soal,
  nomorSoal,
  jawabanTerpilih,
  onPilihJawaban,
}: SoalPilihanGandaProps) {
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

  const optionLetters = ["A", "B", "C", "D"];

  return (
    <Card id={`soal-${soal.id}`} className="rounded-2xl border-2 shadow-xs transition-all">
      <CardHeader className="pb-3 pt-4 sm:pt-5 px-4 sm:px-6">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs">
              {nomorSoal}
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Pilihan Ganda
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

      <CardContent className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2">
        {/* IMPORTANT PRD 9.3: Do NOT render correct answer in DOM during test taking! */}
        <RadioGroup
          value={typeof jawabanTerpilih === "number" ? String(jawabanTerpilih) : undefined}
          onValueChange={(val) => onPilihJawaban(Number(val))}
          className="space-y-2.5"
        >
          {soal.opsi.map((opsiText, idx) => {
            const isSelected = jawabanTerpilih === idx;
            const optionId = `opt-${soal.id}-${idx}`;

            return (
              <label
                key={idx}
                htmlFor={optionId}
                className={`flex items-start gap-3 rounded-xl border p-3.5 sm:p-4 cursor-pointer transition-all select-none min-h-[52px] active:scale-[0.99] ${
                  isSelected
                    ? "border-primary bg-primary/8 ring-2 ring-primary/30 font-semibold shadow-xs"
                    : "border-border/80 hover:bg-muted/40 hover:border-border active:bg-muted/60"
                }`}
              >
                <div className="pt-0.5">
                  <RadioGroupItem id={optionId} value={String(idx)} className="cursor-pointer" />
                </div>
                <div className="flex items-start gap-2 flex-1">
                  <span className="font-bold text-xs px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground shrink-0">
                    {optionLetters[idx]}
                  </span>
                  <span className="text-sm text-foreground/90 leading-relaxed">
                    {opsiText}
                  </span>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
