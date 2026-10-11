import { z } from "zod";

// Validasi request pembuat soal (PRD Bagian 9.1)
export const GenerateQuizRequestSchema = z
  .object({
    materiSlugs: z
      .array(z.string().min(1))
      .min(1, "Pilih minimal 1 materi")
      .max(4, "Maksimal 4 materi"),
    jumlahPg: z.union([
      z.literal(0),
      z.literal(3),
      z.literal(5),
      z.literal(10),
    ]),
    jumlahEssay: z.number().int().min(0).max(3),
    kesulitan: z.enum(["mudah", "sedang", "sulit", "campur"]),
    soalSebelumnya: z
      .array(z.string().transform((s) => s.slice(0, 300)))
      .max(50)
      .optional()
      .default([]),
  })
  .refine(
    (data) => data.jumlahPg + data.jumlahEssay >= 1,
    {
      message: "Total jumlah soal PG dan Essay minimal 1 soal",
      path: ["jumlahPg"],
    }
  );

export type GenerateQuizRequest = z.infer<typeof GenerateQuizRequestSchema>;
export type GenerateQuizInput = z.input<typeof GenerateQuizRequestSchema>;

const KesulitanEnum = z.preprocess((val) => {
  if (typeof val !== "string") return "sedang";
  const s = val.toLowerCase().trim();
  if (s.includes("mudah") || s.includes("easy")) return "mudah";
  if (s.includes("sulit") || s.includes("hard")) return "sulit";
  return "sedang";
}, z.enum(["mudah", "sedang", "sulit"]).default("sedang"));

// Skema output AI untuk PG
export const AiSoalPgSchema = z.object({
  id: z.string().optional(),
  pertanyaan: z.string().min(3, "Pertanyaan terlalu pendek"),
  opsi: z
    .array(z.string().min(1))
    .length(4, "Opsi PG harus tepat 4 pilihan"),
  indeksBenar: z.preprocess((val) => {
    if (typeof val === "number") return Math.min(3, Math.max(0, val));
    return 0;
  }, z.number().int().min(0).max(3).default(0)),
  pembahasan: z.string().default("Pembahasan tersedia pada materi terkait."),
  kesulitan: KesulitanEnum,
  kartuRujukan: z.string().default("Materi Terkait"),
  materiSlug: z.string().optional(),
});

// Skema output AI untuk Essay
export const AiSoalEssaySchema = z.object({
  id: z.string().optional(),
  pertanyaan: z.string().min(3, "Pertanyaan essay terlalu pendek"),
  kunciJawaban: z.string().default("Jawaban menguraikan pemahaman konsep PAUD secara tepat."),
  rubrik: z.preprocess((val) => {
    if (Array.isArray(val)) return val.map(String).filter(Boolean);
    if (typeof val === "string") return val.split("\n").map((s) => s.trim()).filter(Boolean);
    return [
      "Ketepatan konsep yang dijelaskan",
      "Penerapan di situasi kelas PAUD",
      "Kejelasan argumen",
    ];
  }, z.array(z.string()).default([
    "Ketepatan konsep yang dijelaskan",
    "Penerapan di situasi kelas PAUD",
    "Kejelasan argumen",
  ])),
  kesulitan: KesulitanEnum,
  kartuRujukan: z.string().default("Materi Terkait"),
  materiSlug: z.string().optional(),
});

// Skema respons AI pembuat soal (tanpa quizId & dibuatPada)
export const AiQuizOutputSchema = z.object({
  soalPg: z.array(AiSoalPgSchema).optional().default([]),
  soalEssay: z.array(AiSoalEssaySchema).optional().default([]),
});

export type AiQuizOutput = z.infer<typeof AiQuizOutputSchema>;

// Validasi request evaluasi essay (PRD Bagian 9.2)
export const EvaluateEssayRequestSchema = z.object({
  materiSlug: z.string().min(1),
  pertanyaan: z.string().min(1),
  kunciJawaban: z.string().min(1),
  rubrik: z.array(z.string()),
  jawabanPengguna: z
    .string()
    .min(1, "Jawaban minimal 1 karakter")
    .max(1200, "Jawaban maksimal 1200 karakter"),
});

export type EvaluateEssayRequest = z.infer<typeof EvaluateEssayRequestSchema>;

// Skema respons evaluasi essay
export const EvaluateEssayResponseSchema = z.object({
  skor: z.preprocess((val) => {
    if (typeof val === "number") return Math.min(100, Math.max(0, Math.round(val)));
    return 70;
  }, z.number().int().min(0).max(100).default(70)),
  yangSudahBenar: z.array(z.string()).default([]),
  yangKurang: z.array(z.string()).default([]),
  saran: z.string().default("Bagus! Tingkatkan pemahaman konsep dengan membaca ulang materi."),
  jawabanContoh: z.string().default(""),
});

export type EvaluateEssayResponse = z.infer<typeof EvaluateEssayResponseSchema>;
