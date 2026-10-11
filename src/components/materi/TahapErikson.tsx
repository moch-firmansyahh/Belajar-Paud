import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export interface EriksonStage {
  no: number;
  tahap: string;
  usia: string;
  artinya: string;
  isPaud: boolean;
}

const ERIKSON_STAGES: EriksonStage[] = [
  {
    no: 1,
    tahap: "Percaya vs Tidak percaya",
    usia: "Bayi, 0 sampai 1 tahun",
    artinya:
      "Bayi belajar apakah dunia ini aman. Kalau kebutuhannya (susu, pelukan) dipenuhi, ia jadi percaya. Kalau tidak, ia jadi cemas dan curiga.",
    isPaud: false,
  },
  {
    no: 2,
    tahap: "Mandiri vs Malu dan ragu",
    usia: "Balita, 1 sampai 3 tahun",
    artinya:
      "Anak mulai ingin melakukan sendiri, misalnya makan atau memakai baju. Kalau didukung, ia mandiri. Kalau terus dimarahi atau dilarang, ia jadi malu dan ragu.",
    isPaud: true,
  },
  {
    no: 3,
    tahap: "Inisiatif vs Rasa bersalah",
    usia: "Prasekolah, 3 sampai 6 tahun",
    artinya:
      "Anak berani memulai kegiatan dan punya ide sendiri. Kalau dihargai, ia punya inisiatif. Kalau sering dikritik, ia merasa bersalah.",
    isPaud: true,
  },
  {
    no: 4,
    tahap: "Tekun vs Rendah diri",
    usia: "Usia SD, 6 sampai 12 tahun",
    artinya:
      "Anak ingin berhasil menyelesaikan tugas. Kalau berhasil dan dihargai, ia tekun dan percaya diri. Kalau sering gagal atau dibanding-bandingkan, ia merasa rendah diri.",
    isPaud: false,
  },
  {
    no: 5,
    tahap: "Identitas vs Kebingungan peran",
    usia: "Remaja, 12 sampai 18 tahun",
    artinya:
      "Remaja mencari jawaban 'aku ini siapa'. Kalau berhasil, ia punya jati diri yang jelas. Kalau tidak, ia bingung dengan perannya.",
    isPaud: false,
  },
  {
    no: 6,
    tahap: "Keintiman vs Isolasi",
    usia: "Dewasa awal",
    artinya:
      "Orang dewasa muda membangun hubungan yang dekat dan dalam. Kalau gagal, ia merasa terpisah dan sendirian.",
    isPaud: false,
  },
  {
    no: 7,
    tahap: "Generativitas vs Penghentian",
    usia: "Dewasa madya",
    artinya:
      "Orang dewasa ingin berguna bagi generasi berikutnya, misalnya lewat mendidik anak dan berkarya. Kalau tidak, ia merasa hidupnya mandek.",
    isPaud: false,
  },
  {
    no: 8,
    tahap: "Integritas vs Keputusasaan",
    usia: "Lanjut usia",
    artinya:
      "Orang tua menengok kembali hidupnya. Kalau merasa hidupnya bermakna, ia damai. Kalau banyak menyesal, ia putus asa.",
    isPaud: false,
  },
];

export function TahapErikson() {
  return (
    <div className="my-4 space-y-3">
      <div className="flex items-center justify-between pb-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          8 Tahap Perkembangan Psikososial Erikson
        </p>
        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          Tahap 2 & 3 adalah fokus PAUD
        </span>
      </div>

      <div className="grid gap-3 sm:gap-3.5">
        {ERIKSON_STAGES.map((stage) => (
          <div
            key={stage.no}
            className={`group relative rounded-xl border p-4 transition-all duration-200 ${
              stage.isPaud
                ? "border-amber-300/80 bg-amber-50/70 shadow-xs ring-1 ring-amber-300/60 dark:border-amber-700/60 dark:bg-amber-950/20 dark:ring-amber-800/40"
                : "border-border/70 bg-card hover:bg-muted/40"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-xs ${
                    stage.isPaud
                      ? "bg-amber-500 text-white dark:bg-amber-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stage.no}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base leading-tight">
                    {stage.tahap}
                  </h4>
                  <span className="text-xs font-medium text-muted-foreground">
                    {stage.usia}
                  </span>
                </div>
              </div>

              {stage.isPaud && (
                <div className="self-start sm:self-center">
                  <Badge
                    variant="outline"
                    className="border-amber-500/50 bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 text-xs font-semibold px-2.5 py-0.5"
                  >
                    Tahap Anak PAUD
                  </Badge>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-foreground/85 pt-1 sm:pt-0 sm:pl-11 leading-relaxed">
              {stage.artinya}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
