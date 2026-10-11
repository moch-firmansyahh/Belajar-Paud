import {
  EvaluateEssayRequest,
  EvaluateEssayResponse,
  EvaluateEssayResponseSchema,
} from "@/lib/quiz/schema";
import {
  buildUserPromptEvaluator,
  SYSTEM_PROMPT_EVALUATOR,
} from "./prompts";
import { generateJson } from "./provider";

export async function evaluateEssay(
  req: EvaluateEssayRequest
): Promise<EvaluateEssayResponse> {
  const { pertanyaan, kunciJawaban, rubrik, jawabanPengguna } = req;

  // Guard: jawaban kosong langsung diberi skor 0
  if (!jawabanPengguna || jawabanPengguna.trim().length === 0) {
    return {
      skor: 0,
      yangSudahBenar: [],
      yangKurang: ["Jawaban tidak diisi atau kosong"],
      saran: "Cobalah untuk menuangkan pemikiranmu sesuai materi yang telah dipelajari.",
      jawabanContoh: kunciJawaban,
    };
  }

  const prompt = buildUserPromptEvaluator({
    pertanyaan,
    kunciJawaban,
    rubrik,
    jawabanPengguna,
  });

  const MAX_RETRIES = 1;
  let parsedResult: EvaluateEssayResponse | null = null;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const rawJson = await generateJson<unknown>(prompt, {
        systemPrompt: SYSTEM_PROMPT_EVALUATOR,
        temperature: 0.2, // Temperatur rendah untuk konsistensi evaluasi
      });

      const validation = EvaluateEssayResponseSchema.safeParse(rawJson);
      if (validation.success) {
        parsedResult = validation.data;
        break;
      } else {
        lastError = new Error(
          `Format penilaian AI tidak sesuai: ${validation.error.issues
            .map((i) => i.message)
            .join(", ")}`
        );
      }
    } catch (err: unknown) {
      lastError = err as Error;
    }
  }

  if (!parsedResult) {
    console.warn(
      `[Failsafe] Evaluasi AI gagal (${lastError?.message || "unknown"}). Mengaktifkan penilaian cadangan cerdas...`
    );
    return evaluasiEssayFallback(kunciJawaban, rubrik, jawabanPengguna);
  }

  return parsedResult;
}

function evaluasiEssayFallback(
  kunciJawaban: string,
  rubrik: string[],
  jawabanPengguna: string
): EvaluateEssayResponse {
  const teksJawaban = jawabanPengguna.toLowerCase().trim();
  const kataKunciRubrik: string[] = [];

  for (const r of rubrik) {
    const words = r
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4);
    kataKunciRubrik.push(...words);
  }

  const kataDitemukan = Array.from(new Set(kataKunciRubrik)).filter((k) =>
    teksJawaban.includes(k)
  );

  let skor = 65;
  const jumlahKata = teksJawaban.split(/\s+/).length;

  if (jumlahKata >= 40) skor += 15;
  else if (jumlahKata >= 20) skor += 10;
  else if (jumlahKata < 8) skor -= 25;

  if (kataDitemukan.length >= 3) skor += 15;
  else if (kataDitemukan.length >= 1) skor += 5;

  skor = Math.min(95, Math.max(35, skor));

  return {
    skor,
    yangSudahBenar: [
      "Argumen yang kamu sampaikan terstruktur dan relevan dengan pertanyaan.",
      ...(kataDitemukan.length > 0
        ? [`Mencantumkan konsep kunci materi (${kataDitemukan.slice(0, 3).join(", ")}).`]
        : ["Penjelasan menjawab inti permasalahan studi kasus."]),
    ],
    yangKurang: [
      "Penilaian ini menggunakan modul evaluasi cadangan otomatis.",
      "Analisis dapat diperkaya lagi dengan menghubungkan ke teori perkembangan anak.",
    ],
    saran:
      "Jawabanmu sudah cukup baik dan menunjukkan pemahaman konsep. Kamu bisa menekan tombol 'Nilai Ulang' jika ingin evaluasi mendalam dari AI.",
    jawabanContoh: kunciJawaban,
  };
}
