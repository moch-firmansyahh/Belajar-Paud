"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  ExternalLink,
  HelpCircle,
  FileText,
  History,
  AlertCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuizSession } from "@/hooks/useQuizSession";
import { slugify } from "@/lib/content/parseKartu";
import { EvaluasiEssayResponse } from "@/types";

export default function HasilQuizPage() {
  const { session, isLoaded, setHasil } = useQuizSession();
  const [reEvaluatingId, setReEvaluatingId] = useState<string | null>(null);

  const hasil = session?.hasil;

  useEffect(() => {
    if (hasil && hasil.skorAkhir >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [hasil]);

  if (!isLoaded) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Memuat hasil kuis...</p>
      </div>
    );
  }

  if (!hasil) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Belum Ada Hasil Quiz
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Kamu belum menyelesaikan sesi kuis apa pun.
        </p>
        <Button asChild size="lg" className="rounded-xl font-semibold gap-2">
          <Link href="/quiz">
            <Sparkles className="h-4 w-4" />
            <span>Atur Quiz Baru</span>
          </Link>
        </Button>
      </div>
    );
  }

  const {
    skorAkhir,
    skorPg,
    skorEssay,
    totalPgBenar,
    totalPg,
    totalEssay,
    soalPg,
    soalEssay,
    jawabanPg,
    jawabanEssay,
    evaluasiEssay,
  } = hasil;

  const getPesanSkor = (skor: number) => {
    if (skor >= 85) return { teks: "Luar Biasa! Pemahamanmu sangat matang.", warna: "text-emerald-600" };
    if (skor >= 70) return { teks: "Bagus Sekali! Tinggal sedikit lagi menuju sempurna.", warna: "text-indigo-600" };
    if (skor >= 50) return { teks: "Cukup Baik! Pelajari kembali kartu yang belum dipahami.", warna: "text-amber-600" };
    return { teks: "Tetap Semangat! Baca kembali materi untuk memperkuat pemahaman.", warna: "text-rose-600" };
  };

  const pesan = getPesanSkor(skorAkhir);

  const handleReEvaluateEssay = async (essayId: string) => {
    const question = soalEssay.find((q) => q.id === essayId);
    if (!question) return;

    const answer = jawabanEssay[essayId] || "";
    setReEvaluatingId(essayId);

    try {
      const res = await fetch("/api/quiz/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materiSlug: question.materiSlug,
          pertanyaan: question.pertanyaan,
          kunciJawaban: question.kunciJawaban,
          rubrik: question.rubrik,
          jawabanPengguna: answer,
        }),
      });

      if (res.ok) {
        const evalResult = (await res.json()) as EvaluasiEssayResponse;
        const updatedEvaluasi = {
          ...evaluasiEssay,
          [essayId]: evalResult,
        };

        const updatedSkorList = soalEssay.map((q) =>
          q.id === essayId ? evalResult.skor : evaluasiEssay[q.id]?.skor || 0
        );
        const newSkorEssay = Math.round(
          updatedSkorList.reduce((a, b) => a + b, 0) / soalEssay.length
        );
        const newSkorAkhir =
          totalPg > 0 && totalEssay > 0
            ? Math.round(0.5 * skorPg + 0.5 * newSkorEssay)
            : totalPg > 0
            ? skorPg
            : newSkorEssay;

        setHasil({
          ...hasil,
          skorEssay: newSkorEssay,
          skorAkhir: newSkorAkhir,
          evaluasiEssay: updatedEvaluasi,
        });
      }
    } catch {
      // Ignored
    } finally {
      setReEvaluatingId(null);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-12 pb-24 space-y-8">
      {/* Kartu Skor Besar */}
      <Card className="rounded-3xl border-2 shadow-md overflow-hidden text-center bg-gradient-to-b from-card via-card to-muted/20">
        <CardHeader className="pt-6 sm:pt-8 pb-4 px-4 sm:px-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
            <Trophy className="h-7 w-7" />
          </div>
          <h1 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Hasil Latihan Quiz AI
          </h1>
          <div className="my-2">
            <span className="text-6xl sm:text-7xl font-black tracking-tight text-foreground">
              {skorAkhir}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-muted-foreground">
              /100
            </span>
          </div>
          <p className={`text-sm sm:text-lg font-semibold px-2 ${pesan.warna}`}>
            {pesan.teks}
          </p>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8 pt-2">
          {/* Ringkasan Skor Dua Kolom (PRD Bagian 12.4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto pt-2">
            {totalPg > 0 && (
              <div className="rounded-2xl border p-4 bg-card/60 shadow-2xs">
                <span className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Pilihan Ganda (PG)
                </span>
                <span className="text-2xl font-black text-foreground">
                  {skorPg}
                </span>
                <span className="text-xs text-muted-foreground block mt-0.5">
                  Benar {totalPgBenar} dari {totalPg} Soal
                </span>
              </div>
            )}

            {totalEssay > 0 && (
              <div className="rounded-2xl border p-4 bg-card/60 shadow-2xs">
                <span className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Analisis Essay
                </span>
                <span className="text-2xl font-black text-foreground">
                  {skorEssay}
                </span>
                <span className="text-xs text-muted-foreground block mt-0.5">
                  Rata-rata {totalEssay} Soal Dinilai AI
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-6">
            <Button
              id="btn-quiz-baru-dari-hasil"
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 rounded-xl font-bold gap-2 cursor-pointer shadow-md justify-center active:scale-98 transition-transform"
            >
              <Link href="/quiz">
                <Sparkles className="h-4 w-4" />
                <span>Atur Quiz Baru</span>
              </Link>
            </Button>

            <Button
              id="btn-ke-riwayat"
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 rounded-xl font-semibold gap-2 cursor-pointer justify-center active:scale-98 transition-transform"
            >
              <Link href="/riwayat">
                <History className="h-4 w-4" />
                <span>Lihat Riwayat</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pembahasan Soal dalam Accordion (PRD Bagian 7.6) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Pembahasan & Masukan AI Tiap Soal</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Buka pembahasan di bawah untuk melihat rujukan materi dan kunci jawaban.
          </p>
        </div>

        <Accordion className="space-y-3">
          {/* Pembahasan PG */}
          {soalPg.map((pg, index) => {
            const jawabanPengguna = jawabanPg[pg.id];
            const isBenar = jawabanPengguna === pg.indeksBenar;
            const kartuId = slugify(pg.kartuRujukan);
            const targetLink = `/materi/${pg.materiSlug || session.materiSlugs[0]}#${kartuId}`;

            return (
              <AccordionItem
                key={pg.id}
                value={pg.id}
                className="rounded-2xl border-2 px-4 sm:px-5 py-1 bg-card shadow-2xs"
              >
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-start gap-3 text-left flex-1 pr-3">
                    <div className="mt-0.5">
                      {isBenar ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground">
                          Soal {index + 1} &bull; PG
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            isBenar
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 text-[10px]"
                              : "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 text-[10px]"
                          }
                        >
                          {isBenar ? "Jawaban Benar" : "Perlu Belajar Ulang"}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {pg.pertanyaan}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-2 pb-4 space-y-4 border-t text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div
                      className={`p-3 rounded-xl border ${
                        isBenar
                          ? "bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/20"
                          : "bg-rose-50/70 border-rose-300 dark:bg-rose-950/20"
                      }`}
                    >
                      <span className="font-semibold block text-muted-foreground mb-0.5">
                        Jawabanmu:
                      </span>
                      <p className="font-bold text-foreground">
                        {typeof jawabanPengguna === "number"
                          ? `${["A", "B", "C", "D"][jawabanPengguna]}. ${pg.opsi[jawabanPengguna]}`
                          : "Tidak dijawab"}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/20">
                      <span className="font-semibold block text-muted-foreground mb-0.5">
                        Kunci Jawaban Benar:
                      </span>
                      <p className="font-bold text-emerald-800 dark:text-emerald-300">
                        {["A", "B", "C", "D"][pg.indeksBenar]}. {pg.opsi[pg.indeksBenar]}
                      </p>
                    </div>
                  </div>

                  {/* Pembahasan */}
                  <div className="p-3.5 rounded-xl bg-muted/60 text-xs sm:text-sm space-y-1">
                    <span className="font-bold text-foreground block">
                      Pembahasan:
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {pg.pembahasan}
                    </p>
                  </div>

                  {/* Tautan Baca Ulang Kartunya (PRD Bagian 7.6) */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">
                      Rujukan: <strong>{pg.kartuRujukan}</strong>
                    </span>

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs font-semibold gap-1.5 text-primary hover:text-primary cursor-pointer"
                    >
                      <Link href={targetLink}>
                        <span>Baca ulang kartunya</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}

          {/* Pembahasan Essay */}
          {soalEssay.map((es, index) => {
            const evalResult = evaluasiEssay[es.id];
            const jawabanPengguna = jawabanEssay[es.id] || "";
            const kartuId = slugify(es.kartuRujukan);
            const targetLink = `/materi/${es.materiSlug || session.materiSlugs[0]}#${kartuId}`;

            return (
              <AccordionItem
                key={es.id}
                value={es.id}
                className="rounded-2xl border-2 px-4 sm:px-5 py-1 bg-card shadow-2xs"
              >
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-start gap-3 text-left flex-1 pr-3">
                    <div className="mt-0.5">
                      <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground">
                          Soal {totalPg + index + 1} &bull; Essay
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 text-[10px] font-bold"
                        >
                          Skor AI: {evalResult ? `${evalResult.skor}/100` : "0/100"}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {es.pertanyaan}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-2 pb-4 space-y-4 border-t text-sm">
                  {/* Jawaban Pengguna */}
                  <div className="p-3.5 rounded-xl border bg-muted/30 space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground block">
                      Jawabanmu:
                    </span>
                    <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {jawabanPengguna.trim() || "(Tidak diisi)"}
                    </p>
                  </div>

                  {/* Evaluasi AI */}
                  {evalResult && (
                    <div className="space-y-3 pt-1">
                      {evalResult.yangSudahBenar.length > 0 && (
                        <div className="p-3 rounded-xl border border-emerald-300/80 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs sm:text-sm space-y-1">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            Poin yang Sudah Tepat:
                          </span>
                          <ul className="list-disc pl-5 space-y-0.5 text-foreground/80">
                            {evalResult.yangSudahBenar.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {evalResult.yangKurang.length > 0 && (
                        <div className="p-3 rounded-xl border border-amber-300/80 bg-amber-50/50 dark:bg-amber-950/20 text-xs sm:text-sm space-y-1">
                          <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                            <AlertCircle className="h-4 w-4" />
                            Poin yang Masih Kurang:
                          </span>
                          <ul className="list-disc pl-5 space-y-0.5 text-foreground/80">
                            {evalResult.yangKurang.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm space-y-1">
                        <span className="font-bold text-indigo-700 dark:text-indigo-300 block">
                          Saran Dosen AI:
                        </span>
                        <p className="text-foreground/90 leading-relaxed italic">
                          &ldquo;{evalResult.saran}&rdquo;
                        </p>
                      </div>

                      {evalResult.jawabanContoh && (
                        <div className="p-3.5 rounded-xl bg-muted/60 text-xs sm:text-sm space-y-1">
                          <span className="font-bold text-foreground block">
                            Contoh Jawaban Ideal:
                          </span>
                          <p className="text-muted-foreground leading-relaxed">
                            {evalResult.jawabanContoh}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tombol Nilai Ulang jika perlu */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReEvaluateEssay(es.id)}
                      disabled={reEvaluatingId === es.id}
                      className="text-xs rounded-lg gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className={`h-3.5 w-3.5 ${reEvaluatingId === es.id ? "animate-spin" : ""}`} />
                      <span>{reEvaluatingId === es.id ? "Menilai..." : "Nilai Ulang Soal Ini"}</span>
                    </Button>

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs font-semibold gap-1.5 text-primary hover:text-primary cursor-pointer"
                    >
                      <Link href={targetLink}>
                        <span>Baca ulang kartunya</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
