"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Brain,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  JUMLAH_PG_OPTIONS,
  JUMLAH_ESSAY_OPTIONS,
  KESULITAN_OPTIONS,
  STORAGE_KEYS,
  TEMA_CONFIG,
} from "@/constants";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/storage";
import { useQuizSession } from "@/hooks/useQuizSession";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { toast } from "sonner";
import { MateriDetail, PengaturanQuiz, TingkatKesulitan, QuizGenerateResponse } from "@/types";

interface FormPengaturanQuizProps {
  materiList: MateriDetail[];
}

export function FormPengaturanQuiz({ materiList }: FormPengaturanQuizProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMateri = searchParams.get("materi");

  const { session, clearSession, saveSession } = useQuizSession();
  const { getSoalLamaStems } = useQuizHistory();

  // State form
  const [selectedMateri, setSelectedMateri] = useState<string[]>([]);
  const [jumlahPg, setJumlahPg] = useState<number>(5);
  const [jumlahEssay, setJumlahEssay] = useState<number>(2);
  const [kesulitan, setKesulitan] = useState<TingkatKesulitan>("campur");

  // State request
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Bersihkan sesi lama yang sudah selesai ketika masuk ke pengaturan kuis
  useEffect(() => {
    if (session?.selesai) {
      clearSession();
    }
  }, [session?.selesai, clearSession]);

  // Inisialisasi dari URL query atau localStorage
  useEffect(() => {
    const saved = getLocalStorageItem<Partial<PengaturanQuiz>>(
      STORAGE_KEYS.PENGATURAN,
      {}
    );

    if (urlMateri && materiList.some((m) => m.slug === urlMateri)) {
      setSelectedMateri([urlMateri]);
    } else if (saved.materiSlugs && saved.materiSlugs.length > 0) {
      // Pastikan slug masih valid
      const valids = saved.materiSlugs.filter((s) =>
        materiList.some((m) => m.slug === s)
      );
      setSelectedMateri(valids.length > 0 ? valids : materiList.map((m) => m.slug));
    } else {
      setSelectedMateri(materiList.map((m) => m.slug)); // Default semua
    }

    if (typeof saved.jumlahPg === "number") setJumlahPg(saved.jumlahPg);
    if (typeof saved.jumlahEssay === "number") setJumlahEssay(saved.jumlahEssay);
    if (saved.kesulitan) setKesulitan(saved.kesulitan);
  }, [urlMateri, materiList]);

  // Simpan pilihan terakhir ke localStorage
  const persistSettings = (
    slugs: string[],
    pg: number,
    es: number,
    diff: TingkatKesulitan
  ) => {
    setLocalStorageItem(STORAGE_KEYS.PENGATURAN, {
      materiSlugs: slugs,
      jumlahPg: pg,
      jumlahEssay: es,
      kesulitan: diff,
    });
  };

  const toggleMateri = (slug: string) => {
    let next: string[];
    if (selectedMateri.includes(slug)) {
      if (selectedMateri.length === 1) return; // minimal 1
      next = selectedMateri.filter((s) => s !== slug);
    } else {
      next = [...selectedMateri, slug];
    }
    setSelectedMateri(next);
    persistSettings(next, jumlahPg, jumlahEssay, kesulitan);
  };

  const selectAllMateri = () => {
    const all = materiList.map((m) => m.slug);
    setSelectedMateri(all);
    persistSettings(all, jumlahPg, jumlahEssay, kesulitan);
  };

  const handleJumlahPgChange = (val: number) => {
    setJumlahPg(val);
    persistSettings(selectedMateri, val, jumlahEssay, kesulitan);
  };

  const handleJumlahEssayChange = (val: number) => {
    setJumlahEssay(val);
    persistSettings(selectedMateri, jumlahPg, val, kesulitan);
  };

  const handleKesulitanChange = (val: TingkatKesulitan) => {
    setKesulitan(val);
    persistSettings(selectedMateri, jumlahPg, jumlahEssay, val);
  };

  const isFormValid =
    selectedMateri.length >= 1 && jumlahPg + jumlahEssay >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    setErrorMessage(null);

    const soalSebelumnya = (getSoalLamaStems() || []).map((s) =>
      typeof s === "string" ? s.slice(0, 250) : ""
    );

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materiSlugs: selectedMateri,
          jumlahPg,
          jumlahEssay,
          kesulitan,
          soalSebelumnya,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const pesan =
          data?.error?.pesan || "Gagal membuat soal quiz. Silakan coba lagi.";
        setErrorMessage(pesan);
        setLoading(false);
        return;
      }

      const quizData = data as QuizGenerateResponse;

      if (quizData.sumber === "cadangan") {
        toast.info("Mode Cadangan Aktif", {
          description:
            "Server AI sedang sibuk. Soal dimuat otomatis dari Bank Soal Terkurasi agar kamu tetap bisa latihan!",
        });
      }

      // Simpan sesi quiz aktif ke sessionStorage
      saveSession({
        quizId: quizData.quizId,
        dibuatPada: quizData.dibuatPada,
        materiSlugs: selectedMateri,
        kesulitan,
        soalPg: quizData.soalPg,
        soalEssay: quizData.soalEssay,
        jawabanPg: {},
        jawabanEssay: {},
        selesai: false,
      });

      // Navigasi ke halaman pengerjaan
      router.push("/quiz/kerjakan");
    } catch {
      setErrorMessage("Koneksi gagal. Pastikan jaringan internet stabil lalu coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="rounded-3xl border-2 shadow-sm">
        <CardHeader className="text-center pb-4 pt-6 sm:pt-8 px-4 sm:px-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Pengaturan Latihan Soal AI
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground pt-1">
            Sesuaikan modul, jumlah soal, dan tingkat kesulitan sebelum AI membuat soal baru untukmu.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 sm:space-y-7 px-4 sm:px-8">
            {/* Error Message */}
            {errorMessage && (
              <Alert variant="destructive" className="rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Gagal Membuat Soal</AlertTitle>
                <AlertDescription className="text-xs sm:text-sm mt-1 leading-relaxed">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading Skeleton Mode */}
            {loading ? (
              <div className="py-10 space-y-6 text-center animate-pulse">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Brain className="h-8 w-8 animate-bounce text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">
                    Sedang Menyiapkan Soal Untukmu...
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    AI sedang menganalisis materi, memilih studi kasus kelas PAUD, dan menyusun pertanyaan yang variatif.
                  </p>
                </div>
                <div className="space-y-2.5 max-w-md mx-auto pt-4">
                  <Skeleton className="h-5 w-full rounded-md" />
                  <Skeleton className="h-5 w-4/5 mx-auto rounded-md" />
                  <Skeleton className="h-5 w-3/5 mx-auto rounded-md" />
                </div>
              </div>
            ) : (
              <>
                {/* 1. Pilihan Materi */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Pilih Materi Ujian</span>
                    </label>
                    <button
                      type="button"
                      onClick={selectAllMateri}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Pilih Semua (4 Modul)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {materiList.map((m) => {
                      const isSelected = selectedMateri.includes(m.slug);
                      const config = TEMA_CONFIG[m.tema];

                      return (
                        <div
                          key={m.slug}
                          onClick={() => toggleMateri(m.slug)}
                          className={`relative flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-2xs font-semibold ring-1 ring-primary/30"
                              : "border-border/70 hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isSelected ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              m.urutan
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-xs sm:text-sm text-foreground">
                              {m.judul}
                            </span>
                            <span className="text-[10px] text-muted-foreground block">
                              {m.kartu.length} kartu &bull; Tema {config.name.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Jumlah Soal PG */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-foreground">
                      Jumlah Soal Pilihan Ganda (PG)
                    </label>
                    <span className="text-xs text-muted-foreground font-medium">
                      {jumlahPg === 0 ? "Tidak ada PG" : `${jumlahPg} Soal`}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {JUMLAH_PG_OPTIONS.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleJumlahPgChange(num)}
                        className={`h-11 sm:h-10 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-95 ${
                          jumlahPg === num
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "border-border bg-card hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        <span className="hidden sm:inline">
                          {num === 0 ? "0 (Lewati)" : `${num} Soal`}
                        </span>
                        <span className="sm:hidden">
                          {num === 0 ? "Lewati" : `${num}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Jumlah Soal Essay */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-foreground">
                      Jumlah Soal Essay (Analisis Kasus)
                    </label>
                    <span className="text-xs text-muted-foreground font-medium">
                      {jumlahEssay === 0 ? "Tidak ada Essay" : `${jumlahEssay} Soal`}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {JUMLAH_ESSAY_OPTIONS.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleJumlahEssayChange(num)}
                        className={`h-11 sm:h-10 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-95 ${
                          jumlahEssay === num
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "border-border bg-card hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        <span className="hidden sm:inline">
                          {num === 0 ? "0 (Lewati)" : `${num} Soal`}
                        </span>
                        <span className="sm:hidden">
                          {num === 0 ? "Lewati" : `${num}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Warning bila total 0 */}
                {jumlahPg === 0 && jumlahEssay === 0 && (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5" />
                    Pilih minimal 1 soal PG atau 1 soal Essay untuk memulai latihan.
                  </p>
                )}

                {/* 4. Tingkat Kesulitan */}
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-foreground block">
                    Tingkat Kesulitan
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {KESULITAN_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => handleKesulitanChange(opt.value)}
                        className={`flex flex-col justify-center rounded-xl border p-3 cursor-pointer transition-all ${
                          kesulitan === opt.value
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border/70 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold text-foreground">
                            {opt.label}
                          </span>
                          {opt.value === "campur" && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/40 text-primary">
                              Paling Ideal
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                          {opt.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="pt-3 pb-6 sm:pb-8 px-4 sm:px-8 border-t bg-muted/15 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              Total {jumlahPg + jumlahEssay} Soal &bull; Soal digenerate unik setiap klik
            </div>

            <Button
              id="btn-buat-soal-ai"
              type="submit"
              size="lg"
              disabled={!isFormValid || loading}
              className="w-full sm:w-auto rounded-xl font-bold gap-2 cursor-pointer shadow-md h-12 px-8 text-base active:scale-98 transition-transform justify-center"
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span>{loading ? "Menyiapkan Soal..." : "Buat Soal Sekarang"}</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
