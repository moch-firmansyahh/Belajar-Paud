import { TemaWarna, TingkatKesulitan, PengaturanQuiz } from "@/types";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Belajar PAUD";

export const RATE_LIMIT_DEFAULT = 8;
export const MAX_BODY_SIZE_BYTES = 20 * 1024; // 20 KB per PRD
export const MAX_HISTORIES = 20;
export const MAX_OLD_STEMS = 30;
export const MAX_ESSAY_CHARACTERS = 1200;

export const STORAGE_KEYS = {
  PROGRESS: "paud:progress",
  RIWAYAT: "paud:riwayat",
  SOAL_LAMA: "paud:soal-lama",
  PENGATURAN: "paud:pengaturan",
  SESI_QUIZ: "paud:sesi-quiz",
} as const;

export const JUMLAH_PG_OPTIONS = [0, 3, 5, 10] as const;
export const JUMLAH_ESSAY_OPTIONS = [0, 1, 2, 3] as const;

export const KESULITAN_OPTIONS: { value: TingkatKesulitan; label: string; desc: string }[] = [
  { value: "mudah", label: "Mudah", desc: "Fokus mengingat definisi dan konsep dasar" },
  { value: "sedang", label: "Sedang", desc: "Campuran pemahaman dan studi kasus kelas" },
  { value: "sulit", label: "Sulit", desc: "Analisis situasi kelas dan penalaran mendalam" },
  { value: "campur", label: "Campur (Rekomendasi)", desc: "Kombinasi merata semua tingkat kesulitan" },
];

export const DEFAULT_PENGATURAN_QUIZ: PengaturanQuiz = {
  materiSlugs: [],
  jumlahPg: 5,
  jumlahEssay: 2,
  kesulitan: "campur",
};

export const TEMA_CONFIG: Record<
  TemaWarna,
  {
    name: string;
    aksen: string;
    latarLembut: string;
    kotakIngat: string;
    badgeStyle: string;
    borderStyle: string;
  }
> = {
  doodle: {
    name: "Doodle (Biru & Hijau)",
    aksen: "#2f3556",
    latarLembut: "#d9efe0",
    kotakIngat: "#fdeaa0",
    badgeStyle: "bg-[#d9efe0] text-[#2f3556] border-[#2f3556]/20 dark:bg-[#1c2e26] dark:text-[#8b9cdb]",
    borderStyle: "border-[#2f3556]/30",
  },
  pink: {
    name: "Pink & Marun",
    aksen: "#994a50",
    latarLembut: "#ffd9de",
    kotakIngat: "#ffe9a3",
    badgeStyle: "bg-[#ffd9de] text-[#994a50] border-[#994a50]/20 dark:bg-[#35161c] dark:text-[#f38ba8]",
    borderStyle: "border-[#994a50]/30",
  },
  toska: {
    name: "Toska Segar",
    aksen: "#2f8f8f",
    latarLembut: "#cdeeee",
    kotakIngat: "#fdf3a0",
    badgeStyle: "bg-[#cdeeee] text-[#2f8f8f] border-[#2f8f8f]/20 dark:bg-[#133030] dark:text-[#59cccc]",
    borderStyle: "border-[#2f8f8f]/30",
  },
  cokelat: {
    name: "Cokelat Klasik",
    aksen: "#7a4a2e",
    latarLembut: "#ecd5b5",
    kotakIngat: "#f6e6c0",
    badgeStyle: "bg-[#ecd5b5] text-[#7a4a2e] border-[#7a4a2e]/20 dark:bg-[#331f13] dark:text-[#d99a75]",
    borderStyle: "border-[#7a4a2e]/30",
  },
};
