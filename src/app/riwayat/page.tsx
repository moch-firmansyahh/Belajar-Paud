"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  History,
  Trash2,
  RotateCcw,
  Sparkles,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { STORAGE_KEYS } from "@/constants";
import { setLocalStorageItem } from "@/lib/storage";
import { RiwayatQuizItem } from "@/types";

export default function RiwayatPage() {
  const router = useRouter();
  const { history, isLoaded, isCloudSynced, clearHistory } = useQuizHistory();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleUlangiQuiz = (item: RiwayatQuizItem) => {
    // Simpan pengaturan ini ke paud:pengaturan
    setLocalStorageItem(STORAGE_KEYS.PENGATURAN, {
      materiSlugs: item.materiSlugs,
      jumlahPg: item.totalPg,
      jumlahEssay: item.totalEssay,
      kesulitan: item.kesulitan,
    });

    router.push("/quiz");
  };

  const formatTanggal = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12 flex-1 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <History className="h-7 w-7 text-primary" />
              <span>Riwayat Latihan Quiz</span>
            </h1>
            {isCloudSynced && (
              <Badge variant="outline" className="text-[11px] text-emerald-600 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 font-medium">
                Tersinkronisasi Supabase
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Daftar nilai dan progres latihan yang tersimpan di browser ini
          </p>
        </div>

        {history.length > 0 && (
          <Button
            id="btn-hapus-riwayat"
            variant="outline"
            size="sm"
            onClick={() => setDeleteConfirmOpen(true)}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900 rounded-xl gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Hapus Semua Riwayat</span>
          </Button>
        )}
      </div>

      {!isLoaded ? (
        <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
          Memuat riwayat...
        </div>
      ) : history.length === 0 ? (
        /* Keadaan Kosong (PRD Bagian 12.5) */
        <Card className="rounded-3xl border-2 border-dashed p-10 text-center max-w-md mx-auto">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
            <History className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-bold text-foreground mb-2">
            Belum Ada Riwayat
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Kamu belum pernah mengerjakan latihan soal. Kerjakan kuis pertamamu sekarang!
          </CardDescription>
          <Button asChild size="lg" className="rounded-xl font-semibold gap-2 shadow-md">
            <Link href="/quiz">
              <Sparkles className="h-4 w-4" />
              <span>Mulai Latihan Quiz</span>
            </Link>
          </Button>
        </Card>
      ) : (
        /* List Riwayat (Maksimal 20 item) */
        <div className="space-y-4">
          {history.map((item, idx) => {
            const isGoodScore = item.skorAkhir >= 70;

            return (
              <Card
                key={`${item.quizId}-${idx}`}
                className="rounded-2xl border-2 transition-all hover:border-primary/40 hover:shadow-xs"
              >
                <CardHeader className="py-4 px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatTanggal(item.tanggal)}
                        </span>
                        <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                          Tingkat {item.kesulitan}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-sm font-bold text-foreground">
                          {item.materiSlugs.length} Modul Terpilih
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({item.totalPg} PG &bull; {item.totalEssay} Essay)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                      {/* Skor Badge */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                            Skor Akhir
                          </span>
                          <span
                            className={`text-2xl font-black ${
                              isGoodScore
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-foreground"
                            }`}
                          >
                            {item.skorAkhir}
                          </span>
                        </div>

                        <div className="text-xs text-muted-foreground border-l pl-3 hidden sm:block">
                          <div>PG: <strong>{item.skorPg}</strong></div>
                          <div>Essay: <strong>{item.skorEssay}</strong></div>
                        </div>
                      </div>

                      <Button
                        id={`btn-ulangi-quiz-${item.quizId}`}
                        size="sm"
                        onClick={() => handleUlangiQuiz(item)}
                        className="rounded-xl font-semibold gap-1.5 cursor-pointer shadow-xs ml-2 h-9 active:scale-95 transition-transform"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Ulangi</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog Hapus Riwayat */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              Hapus Seluruh Riwayat?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              Tindakan ini akan menghapus riwayat nilai dan latihan di browser ini. Data yang dihapus tidak dapat dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearHistory();
                setDeleteConfirmOpen(false);
              }}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Ya, Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
