"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  GraduationCap,
  BrainCircuit,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress, StatusMateri } from "@/hooks/useProgress";
import { TEMA_CONFIG } from "@/constants";
import { MateriDetail } from "@/types";

interface HomeClientProps {
  materiList: MateriDetail[];
}

export function HomeClient({ materiList }: HomeClientProps) {
  const { getProgress, isLoaded } = useProgress();

  const getStatusBadge = (status: StatusMateri) => {
    switch (status) {
      case "Selesai":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-2.5 py-0.5 text-xs">
            <CheckCircle2 className="h-3 w-3" />
            Selesai
          </Badge>
        );
      case "Sedang dibaca":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300 gap-1 px-2.5 py-0.5 text-xs">
            <Clock className="h-3 w-3" />
            Sedang dibaca
          </Badge>
        );
      case "Belum dibaca":
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground gap-1 px-2.5 py-0.5 text-xs">
            Belum dibaca
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-primary/5 via-card to-card p-5 sm:p-10 lg:p-12 shadow-xs">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-xs">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Presentasi Kelompok 11 &bull; Guru PAUD</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl text-foreground leading-tight">
            Belajar Teori PAUD Jadi Lebih Mudah & Seru
          </h1>

          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
            Pahami 4 materi inti lewat kartu belajar interaktif dan uji pemahamanmu dengan latihan soal PG & Essay yang dibuat otomatis oleh AI.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Button
              id="btn-hero-quiz-cepat"
              asChild
              size="lg"
              className="h-12 px-6 rounded-xl font-bold shadow-md gap-2 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground justify-center active:scale-98 transition-transform"
            >
              <Link href="/quiz">
                <Sparkles className="h-4 w-4" />
                <span>Quiz Cepat Semua Materi</span>
              </Link>
            </Button>

            <Button
              id="btn-hero-mulai-baca"
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-6 rounded-xl font-semibold gap-2 cursor-pointer justify-center active:scale-98 transition-transform"
            >
              <a href="#daftar-materi">
                <BookOpen className="h-4 w-4" />
                <span>Mulai Baca Materi</span>
              </a>
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-6 border-t text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500 shrink-0" />
              <span>4 Rangkuman Materi Terstruktur</span>
            </div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>Soal AI Selalu Baru & Variatif</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Tanpa Akun & 100% Gratis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid 4 Kartu Materi (F1) */}
      <section id="daftar-materi" className="space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Materi Pembelajaran
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Pilih salah satu materi di bawah untuk mulai membaca kartu belajar
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Total 4 Modul Presentasi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {materiList.map((materi) => {
            const temaConfig = TEMA_CONFIG[materi.tema];
            const progressData = isLoaded
              ? getProgress(materi.slug, materi.kartu.length)
              : { completed: 0, percent: 0, status: "Belum dibaca" as StatusMateri };
            const { percent, status } = progressData;

            return (
              <Card
                key={materi.slug}
                id={`card-materi-${materi.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                style={{
                  borderLeftColor: temaConfig.aksen,
                  borderLeftWidth: "6px",
                }}
              >
                <div>
                  <CardHeader className="pb-3 pt-4 sm:pt-5 px-4 sm:px-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white shadow-xs"
                          style={{ backgroundColor: temaConfig.aksen }}
                        >
                          {materi.urutan}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-semibold uppercase px-2 py-0.5 ${temaConfig.badgeStyle}`}
                        >
                          Modul {materi.urutan}
                        </Badge>
                      </div>

                      {getStatusBadge(status)}
                    </div>

                    <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {materi.judul}
                    </CardTitle>

                    <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 pt-1">
                      {materi.ringkasan}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-4 sm:px-6 py-2 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" />
                        {materi.kartu.length} Kartu Belajar
                      </span>
                      <span className="font-semibold text-foreground">
                        {percent}% Dipahami
                      </span>
                    </div>

                    <Progress value={percent} className="h-2 rounded-full" />
                  </CardContent>
                </div>

                <CardFooter className="pt-3 pb-4 sm:pb-5 px-4 sm:px-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t bg-muted/20">
                  <span className="text-xs text-muted-foreground truncate italic">
                    Sumber: {materi.sumber.replace(/\.pdf$/i, "")}
                  </span>

                  <Button
                    id={`btn-buka-materi-${materi.slug}`}
                    asChild
                    size="sm"
                    className="w-full sm:w-auto rounded-xl font-semibold gap-1.5 cursor-pointer h-10 sm:h-9 justify-center active:scale-98 transition-transform"
                  >
                    <Link href={`/materi/${materi.slug}`}>
                      <span>Buka Materi</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick Quiz Callout Block */}
      <section className="rounded-3xl border bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-5 sm:p-8 lg:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generator AI Cerdas</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Siap Menguji Pemahamanmu Sekarang?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Buat kombinasi soal pilihan ganda dan essay dari seluruh materi atau materi tertentu. Soal selalu berganti baru dan jawaban essay dinilai langsung oleh AI!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              id="btn-cta-quiz-sekarang"
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-xl font-bold shadow-md gap-2 cursor-pointer h-12 px-6 justify-center active:scale-98 transition-transform"
            >
              <Link href="/quiz">
                <Sparkles className="h-4 w-4" />
                <span>Mulai Quiz Cepat</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
