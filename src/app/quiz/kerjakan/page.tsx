"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Send,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Brain,
  Home,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { SoalPilihanGanda } from "@/components/quiz/SoalPilihanGanda";
import { SoalEssay } from "@/components/quiz/SoalEssay";
import { useQuizSession } from "@/hooks/useQuizSession";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { hitungSkorPg, hitungRataRataEssay, hitungSkorAkhir } from "@/lib/quiz/scoring";
import { EvaluasiEssayResponse, HasilQuiz, RiwayatQuizItem } from "@/types";

export default function KerjakanQuizPage() {
  const router = useRouter();
  const { session, isLoaded, updateJawabanPg, updateJawabanEssay, setHasil } =
    useQuizSession();
  const { addQuizResult } = useQuizHistory();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatusText, setSubmitStatusText] = useState("");

  if (!isLoaded) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Brain className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Memuat sesi kuis...</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada sesi aktif
  if (!session || (!session.soalPg.length && !session.soalEssay.length)) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Tidak Ada Sesi Quiz Aktif
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Sesi kuis belum dibuat atau telah selesai. Silakan atur kuis baru untuk mulai berlatih.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild size="lg" className="rounded-xl font-semibold gap-2">
            <Link href="/quiz">
              <Sparkles className="h-4 w-4" />
              <span>Atur Quiz Baru</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Ke Beranda</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { soalPg, soalEssay, jawabanPg, jawabanEssay } = session;
  const totalPg = soalPg.length;
  const totalEssay = soalEssay.length;
  const totalSoal = totalPg + totalEssay;

  const pgDijawabCount = Object.keys(jawabanPg).length;
  const essayDijawabCount = Object.values(jawabanEssay).filter(
    (text) => text.trim().length > 0
  ).length;
  const totalDijawab = pgDijawabCount + essayDijawabCount;
  const percentProgress = Math.round((totalDijawab / totalSoal) * 100);
  const sisaKosong = totalSoal - totalDijawab;

  const handleKlikKumpulkan = () => {
    if (sisaKosong > 0) {
      setConfirmOpen(true);
    } else {
      prosesKumpulkan();
    }
  };

  const prosesKumpulkan = async () => {
    setConfirmOpen(false);
    setSubmitting(true);
    setSubmitStatusText("Menilai soal pilihan ganda...");

    // 1. Penilaian PG di klien (PRD Bagian 7.6)
    let totalPgBenar = 0;
    for (const pg of soalPg) {
      if (jawabanPg[pg.id] === pg.indeksBenar) {
        totalPgBenar += 1;
      }
    }
    const skorPg = hitungSkorPg(totalPgBenar, totalPg);

    // 2. Evaluasi Essay lewat API server
    const evaluasiEssayRecord: Record<string, EvaluasiEssayResponse> = {};
    const skorEssayList: number[] = [];

    if (totalEssay > 0) {
      setSubmitStatusText("AI sedang membaca dan menilai jawaban essay...");

      const evalPromises = soalEssay.map(async (es) => {
        const textJawaban = jawabanEssay[es.id] || "";
        if (!textJawaban.trim()) {
          evaluasiEssayRecord[es.id] = {
            skor: 0,
            yangSudahBenar: [],
            yangKurang: ["Soal ini tidak dijawab."],
            saran: "Cobalah untuk selalu mengisi analisis agar mendapat evaluasi.",
            jawabanContoh: es.kunciJawaban,
          };
          skorEssayList.push(0);
          return;
        }

        try {
          const res = await fetch("/api/quiz/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              materiSlug: es.materiSlug,
              pertanyaan: es.pertanyaan,
              kunciJawaban: es.kunciJawaban,
              rubrik: es.rubrik,
              jawabanPengguna: textJawaban,
            }),
          });

          if (res.ok) {
            const result = (await res.json()) as EvaluasiEssayResponse;
            evaluasiEssayRecord[es.id] = result;
            skorEssayList.push(result.skor);
          } else {
            // Evaluasi parsial gagal
            evaluasiEssayRecord[es.id] = {
              skor: 0,
              yangSudahBenar: [],
              yangKurang: ["Evaluasi AI mengalami kendala sementara."],
              saran: "Tekan tombol 'Nilai Ulang' pada halaman hasil.",
              jawabanContoh: es.kunciJawaban,
            };
            skorEssayList.push(0);
          }
        } catch {
          evaluasiEssayRecord[es.id] = {
            skor: 0,
            yangSudahBenar: [],
            yangKurang: ["Gagal terhubung ke AI evaluator."],
            saran: "Periksa koneksi lalu coba tekan 'Nilai Ulang'.",
            jawabanContoh: es.kunciJawaban,
          };
          skorEssayList.push(0);
        }
      });

      await Promise.allSettled(evalPromises);
    }

    const skorEssay = hitungRataRataEssay(skorEssayList);
    const skorAkhir = hitungSkorAkhir(
      skorPg,
      skorEssay,
      totalPg > 0,
      totalEssay > 0
    );

    const hasilObj: HasilQuiz = {
      quizId: session.quizId,
      tanggal: new Date().toISOString(),
      materiSlugs: session.materiSlugs,
      skorPg,
      skorEssay,
      skorAkhir,
      totalPgBenar,
      totalPg,
      totalEssay,
      evaluasiEssay: evaluasiEssayRecord,
      jawabanPg,
      jawabanEssay,
      soalPg,
      soalEssay,
    };

    // 3. Simpan hasil ke session dan riwayat lokal
    setHasil(hasilObj);

    const riwayatItem: RiwayatQuizItem = {
      quizId: session.quizId,
      tanggal: hasilObj.tanggal,
      materiSlugs: session.materiSlugs,
      materiJudul: session.materiSlugs,
      skorPg,
      skorEssay,
      skorAkhir,
      totalPg,
      totalEssay,
      kesulitan: session.kesulitan,
    };

    const allStems = [
      ...soalPg.map((q) => q.pertanyaan),
      ...soalEssay.map((q) => q.pertanyaan),
    ];

    addQuizResult(riwayatItem, allStems, hasilObj);

    // 4. Buka halaman hasil
    router.push("/quiz/hasil");
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 pt-4 pb-28">
      {/* Top Sticky Progress Bar */}
      <div className="sticky top-16 z-30 mb-8 rounded-2xl border bg-card/90 backdrop-blur-md p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
          <span className="text-foreground">
            Progress Pengerjaan:{" "}
            <strong>
              {totalDijawab} dari {totalSoal} Soal
            </strong>
          </span>
          <span className="text-primary font-bold">{percentProgress}%</span>
        </div>
        <Progress value={percentProgress} className="h-2.5 rounded-full" />
      </div>

      {/* Daftar Soal */}
      <div className="space-y-8">
        {/* Soal PG */}
        {soalPg.map((pg, index) => (
          <SoalPilihanGanda
            key={pg.id}
            soal={pg}
            nomorSoal={index + 1}
            jawabanTerpilih={jawabanPg[pg.id]}
            onPilihJawaban={(optIdx) => updateJawabanPg(pg.id, optIdx)}
          />
        ))}

        {/* Soal Essay */}
        {soalEssay.map((es, index) => (
          <SoalEssay
            key={es.id}
            soal={es}
            nomorSoal={totalPg + index + 1}
            jawaban={jawabanEssay[es.id]}
            onJawab={(text) => updateJawabanEssay(es.id, text)}
          />
        ))}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur-xl py-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))",
        }}
      >
        <div className="container mx-auto max-w-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            {sisaKosong > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {sisaKosong} soal belum dijawab
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold flex items-center justify-center sm:justify-start gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                Semua soal telah terjawab!
              </span>
            )}
          </div>

          <Button
            id="btn-kumpulkan-quiz"
            size="lg"
            onClick={handleKlikKumpulkan}
            disabled={submitting}
            className="w-full sm:w-auto rounded-xl font-bold gap-2 cursor-pointer shadow-md h-12 px-7 text-base active:scale-98 transition-transform justify-center"
          >
            <Send className="h-4 w-4" />
            <span>{submitting ? "Menilai..." : "Kumpulkan Jawaban"}</span>
          </Button>
        </div>
      </div>

      {/* Overlay Loading Evaluasi */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-4 text-center">
          <div className="max-w-sm rounded-3xl border bg-card p-8 shadow-xl space-y-4">
            <Brain className="h-12 w-12 animate-bounce mx-auto text-primary" />
            <h3 className="text-lg font-bold text-foreground">
              Sedang Menilai Jawabanmu
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {submitStatusText}
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Dialog bila ada soal kosong */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Masih Ada Soal Kosong
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              Kamu masih memiliki <strong>{sisaKosong} soal</strong> yang belum
              dijawab. Soal yang tidak dijawab akan mendapatkan skor 0. Yakin
              ingin mengumpulkan sekarang?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel className="rounded-xl">
              Periksa Kembali
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={prosesKumpulkan}
              className="rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Ya, Kumpulkan Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
