import crypto from "crypto";
import { getMateriBySlug } from "@/lib/content/loadMateri";
import { pickFocusCards, getKomposisiLevel } from "@/lib/quiz/pickFocus";
import { shuffleQuestionOptions } from "@/lib/quiz/shuffle";
import {
  AiQuizOutputSchema,
  GenerateQuizInput,
  AiQuizOutput,
} from "@/lib/quiz/schema";
import {
  buildUserPromptGenerator,
  SYSTEM_PROMPT_GENERATOR,
} from "./prompts";
import { generateJson, ValidasiError } from "./provider";
import { QuizGenerateResponse, SoalPg, SoalEssay, KartuMateri } from "@/types";
import { ambilSoalCadangan } from "@/lib/quiz/bankSoalCadangan";

export async function generateQuiz(
  req: GenerateQuizInput
): Promise<QuizGenerateResponse> {
  const { materiSlugs, jumlahPg, jumlahEssay, kesulitan, soalSebelumnya = [] } = req;

  // 1. Kumpulkan seluruh materi yang diminta
  const allCards: KartuMateri[] = [];
  const materiTexts: string[] = [];

  for (const slug of materiSlugs) {
    const detail = getMateriBySlug(slug);
    if (!detail) {
      throw new ValidasiError(`Materi dengan slug '${slug}' tidak ditemukan.`);
    }
    allCards.push(...detail.kartu);

    // Siapkan teks materi lengkap untuk prompt
    const cardSnippets = detail.kartu
      .map(
        (k) =>
          `[Kartu: ${k.judul}]\nLabel: ${k.label}\nApa itu: ${k.apaItu}\nIsi:\n${k.isiMarkdown}\nIngat: ${k.ingat}`
      )
      .join("\n\n");

    materiTexts.push(
      `=== MATERI: ${detail.judul} (slug: ${detail.slug}) ===\n${cardSnippets}\nKata Kunci: ${detail.kataKunci.join(", ")}`
    );
  }

  const teksMateriLengkap = materiTexts.join("\n\n");
  const focusCards = pickFocusCards(allCards);
  const totalSoal = jumlahPg + jumlahEssay;
  const komposisiLevel = getKomposisiLevel(kesulitan, totalSoal);
  const nonce = crypto.randomUUID().slice(0, 8);

  const userPrompt = buildUserPromptGenerator({
    jumlahPg,
    jumlahEssay,
    kesulitan,
    komposisiLevel,
    kartuFokus: focusCards,
    nonce,
    soalSebelumnya,
    teksMateri: teksMateriLengkap,
  });

  // 2. Panggil AI dengan mekanisme retry maksimal 2 kali bila gagal validasi Zod
  const MAX_RETRIES = 2;
  let parsedAiOutput: AiQuizOutput | null = null;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const rawJson = await generateJson<unknown>(userPrompt, {
        systemPrompt: SYSTEM_PROMPT_GENERATOR,
        temperature: 1.0,
      });

      const validation = AiQuizOutputSchema.safeParse(rawJson);
      if (validation.success) {
        parsedAiOutput = validation.data;
        break;
      } else {
        lastError = new Error(
          `Respons AI tidak memenuhi skema: ${validation.error.issues
            .map((i) => i.message)
            .join(", ")}`
        );
      }
    } catch (err: unknown) {
      lastError = err as Error;
    }
  }

  if (!parsedAiOutput) {
    // FAILSAFE OTOMATIS:
    // Jika AI gagal (kuota habis, network error, 503, atau format salah),
    // aktifkan Bank Soal Cadangan Terkurasi agar siswa tetap bisa latihan kuis!
    console.warn(
      `[Failsafe] AI generation gagal (${lastError?.message || "unknown"}). Mengaktifkan Bank Soal Cadangan Terkurasi...`
    );
    return ambilSoalCadangan(req);
  }

  // 3. Olah output: acak opsi PG di server (PRD 7.4), tentukan ID, & asosiasi slug
  const finalSoalPg: SoalPg[] = parsedAiOutput.soalPg.map((pg, index) => {
    // Cari kartu rujukan untuk menemukan slug asalnya
    const matchedCard = allCards.find(
      (c) => c.judul.toLowerCase() === pg.kartuRujukan.toLowerCase()
    );
    const assignedSlug =
      matchedCard?.id || materiSlugs[index % materiSlugs.length];

    const baseQuestion = {
      id: `pg-${index + 1}-${crypto.randomUUID().slice(0, 6)}`,
      pertanyaan: pg.pertanyaan,
      opsi: pg.opsi,
      indeksBenar: pg.indeksBenar,
      pembahasan: pg.pembahasan,
      kesulitan: pg.kesulitan,
      kartuRujukan: pg.kartuRujukan,
      materiSlug: assignedSlug,
    };

    // Acak posisi pilihan jawaban
    return shuffleQuestionOptions(baseQuestion);
  });

  const finalSoalEssay: SoalEssay[] = parsedAiOutput.soalEssay.map(
    (es, index) => {
      const matchedCard = allCards.find(
        (c) => c.judul.toLowerCase() === es.kartuRujukan.toLowerCase()
      );
      const assignedSlug =
        matchedCard?.id || materiSlugs[index % materiSlugs.length];

      return {
        id: `es-${index + 1}-${crypto.randomUUID().slice(0, 6)}`,
        pertanyaan: es.pertanyaan,
        kunciJawaban: es.kunciJawaban,
        rubrik: es.rubrik,
        kesulitan: es.kesulitan,
        kartuRujukan: es.kartuRujukan,
        materiSlug: assignedSlug,
      };
    }
  );

  return {
    quizId: crypto.randomUUID(),
    dibuatPada: new Date().toISOString(),
    soalPg: finalSoalPg,
    soalEssay: finalSoalEssay,
    sumber: "ai",
  };
}
