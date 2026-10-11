export type TemaWarna = "doodle" | "pink" | "toska" | "cokelat";

export type TingkatKesulitan = "mudah" | "sedang" | "sulit" | "campur";

export interface MateriFrontmatter {
  judul: string;
  slug: string;
  urutan: number;
  tema: TemaWarna;
  sumber: string;
  ringkasan: string;
}

export interface KartuMateri {
  id: string;
  judul: string;
  label: string;
  apaItu: string;
  isiMarkdown: string;
  ingat: string;
}

export interface MateriDetail extends MateriFrontmatter {
  judulHalaman?: string;
  pengantar: string;
  kartu: KartuMateri[];
  kataKunci: string[];
}

export interface SoalPg {
  id: string;
  pertanyaan: string;
  opsi: string[];
  indeksBenar: number;
  pembahasan: string;
  kesulitan: "mudah" | "sedang" | "sulit";
  kartuRujukan: string;
  materiSlug: string;
}

export interface SoalEssay {
  id: string;
  pertanyaan: string;
  kunciJawaban: string;
  rubrik: string[];
  kesulitan: "mudah" | "sedang" | "sulit";
  kartuRujukan: string;
  materiSlug: string;
}

export interface QuizGenerateResponse {
  quizId: string;
  dibuatPada: string;
  soalPg: SoalPg[];
  soalEssay: SoalEssay[];
  sumber?: "ai" | "cadangan";
}

export interface EvaluasiEssayResponse {
  skor: number;
  yangSudahBenar: string[];
  yangKurang: string[];
  saran: string;
  jawabanContoh: string;
}

export interface HasilQuiz {
  quizId: string;
  tanggal: string;
  materiSlugs: string[];
  skorPg: number;
  skorEssay: number;
  skorAkhir: number;
  totalPgBenar: number;
  totalPg: number;
  totalEssay: number;
  evaluasiEssay: Record<string, EvaluasiEssayResponse>;
  jawabanPg: Record<string, number>;
  jawabanEssay: Record<string, string>;
  soalPg: SoalPg[];
  soalEssay: SoalEssay[];
}

export interface QuizSession {
  quizId: string;
  dibuatPada: string;
  materiSlugs: string[];
  kesulitan: TingkatKesulitan;
  soalPg: SoalPg[];
  soalEssay: SoalEssay[];
  jawabanPg: Record<string, number>;
  jawabanEssay: Record<string, string>;
  selesai: boolean;
  hasil?: HasilQuiz;
}

export interface RiwayatQuizItem {
  quizId: string;
  tanggal: string;
  materiSlugs: string[];
  materiJudul: string[];
  skorPg: number;
  skorEssay: number;
  skorAkhir: number;
  totalPg: number;
  totalEssay: number;
  kesulitan: TingkatKesulitan;
}

export interface PengaturanQuiz {
  materiSlugs: string[];
  jumlahPg: number;
  jumlahEssay: number;
  kesulitan: TingkatKesulitan;
}

export interface ProgressMateri {
  [materiSlug: string]: string[]; // list of completed kartu ids
}
