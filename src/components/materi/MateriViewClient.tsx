"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { KartuMateri } from "./KartuMateri";
import { DaftarIsi } from "./DaftarIsi";
import { KataKunci } from "./KataKunci";
import { useProgress } from "@/hooks/useProgress";
import { TEMA_CONFIG } from "@/constants";
import { MateriDetail, MateriFrontmatter } from "@/types";

interface MateriViewClientProps {
  materi: MateriDetail;
  prevMateri: MateriFrontmatter | null;
  nextMateri: MateriFrontmatter | null;
}

export function MateriViewClient({
  materi,
  prevMateri,
  nextMateri,
}: MateriViewClientProps) {
  const { isLoaded, isPaham, togglePaham, getProgress } = useProgress();
  const temaConfig = TEMA_CONFIG[materi.tema];

  const progressData = isLoaded
    ? getProgress(materi.slug, materi.kartu.length)
    : { completed: 0, percent: 0, status: "Belum dibaca" as const };
  const { completed, percent } = progressData;

  return (
    <div data-tema={materi.tema} className="min-h-full pb-20 transition-colors">
      {/* Top Header / Breadcrumb Bar */}
      <div className="border-b bg-card/40 backdrop-blur-sm sticky top-16 z-20 py-3 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl flex items-center justify-between gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs sm:text-sm font-medium gap-1 text-muted-foreground hover:text-foreground cursor-pointer px-2 sm:px-3"
          >
            <Link href="/" id="link-kembali-ke-beranda">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Semua Materi</span>
              <span className="sm:hidden">Kembali</span>
            </Link>
          </Button>

          {/* Quick Progress Bar in Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline text-xs text-muted-foreground">
              Progres:{" "}
              <strong className="text-foreground">
                {completed} dari {materi.kartu.length}
              </strong>{" "}
              dipahami ({percent}%)
            </span>
            <Progress value={percent} className="w-16 sm:w-28 h-2 rounded-full" />
            <Button
              id="btn-header-mulai-quiz"
              asChild
              size="sm"
              className="gap-1.5 font-bold text-xs h-8 px-2.5 sm:px-3 rounded-lg cursor-pointer shrink-0"
              style={{
                backgroundColor: "var(--aksen)",
                color: "var(--aksen-foreground, #ffffff)",
              }}
            >
              <Link href={`/quiz?materi=${materi.slug}`}>
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Quiz Materi Ini</span>
                <span className="sm:hidden">Quiz</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        <div className="flex gap-8 items-start">
          {/* Main Content Area */}
          <main className="flex-1 min-w-0 space-y-8">
            {/* Header Judul Materi */}
            <div className="space-y-4 rounded-3xl border p-5 sm:p-8 bg-card shadow-xs">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${temaConfig.badgeStyle}`}
                >
                  Modul {materi.urutan}
                </Badge>
                <span className="text-xs text-muted-foreground italic">
                  Sumber: {materi.sumber.replace(/\.pdf$/i, "")}
                </span>
              </div>

              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight"
                style={{ color: "var(--aksen)" }}
              >
                {materi.judul}
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {materi.ringkasan}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {materi.kartu.length} Kartu Belajar Mandiri
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Centang kartu setelah Anda paham
                </span>
              </div>
            </div>

            {/* List Kartu Materi */}
            <div className="space-y-6">
              {materi.kartu.map((item) => (
                <KartuMateri
                  key={item.id}
                  kartu={item}
                  slug={materi.slug}
                  isPaham={isPaham(materi.slug, item.id)}
                  onTogglePaham={togglePaham}
                />
              ))}
            </div>

            {/* Kata Kunci Bagian Akhir */}
            <KataKunci kataKunci={materi.kataKunci} />

            {/* Bottom Actions & Navigation */}
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Selesai Membaca Modul Ini?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Uji pemahamanmu sekarang dengan soal pilihan ganda dan essay dari materi ini.
                  </p>
                </div>

                <Button
                  id="btn-footer-mulai-quiz"
                  asChild
                  size="lg"
                  className="w-full sm:w-auto rounded-xl font-bold gap-2 cursor-pointer shadow-md h-12 px-6 justify-center active:scale-98 transition-transform"
                  style={{
                    backgroundColor: "var(--aksen)",
                    color: "var(--aksen-foreground, #ffffff)",
                  }}
                >
                  <Link href={`/quiz?materi=${materi.slug}`}>
                    <Sparkles className="h-4 w-4" />
                    <span>Mulai Quiz Materi Ini</span>
                  </Link>
                </Button>
              </div>

              {/* Prev / Next Materi Navigation */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t">
                {prevMateri ? (
                  <Button
                    id="btn-materi-sebelumnya"
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 cursor-pointer text-xs sm:text-sm rounded-xl max-w-[45%]"
                  >
                    <Link href={`/materi/${prevMateri.slug}`}>
                      <ArrowLeft className="h-4 w-4 shrink-0" />
                      <span className="truncate">Modul {prevMateri.urutan}: {prevMateri.judul}</span>
                    </Link>
                  </Button>
                ) : (
                  <div />
                )}

                {nextMateri && (
                  <Button
                    id="btn-materi-berikutnya"
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 cursor-pointer text-xs sm:text-sm rounded-xl ml-auto max-w-[45%]"
                  >
                    <Link href={`/materi/${nextMateri.slug}`}>
                      <span className="truncate">Modul {nextMateri.urutan}: {nextMateri.judul}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </main>

          {/* Sticky Sidebar Table of Contents */}
          <DaftarIsi
            kartu={materi.kartu}
            slug={materi.slug}
            isPaham={isPaham}
          />
        </div>
      </div>
    </div>
  );
}
