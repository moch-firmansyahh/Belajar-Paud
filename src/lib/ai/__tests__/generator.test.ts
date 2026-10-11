import { describe, it, expect, vi, beforeEach } from "vitest";
import * as provider from "../provider";
import { generateQuiz } from "../quizGenerator";
import { evaluateEssay } from "../essayEvaluator";

describe("AI Quiz Generator & Evaluator with Mock Provider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("harus berhasil menghasilkan quiz lengkap dengan opsi diacak", async () => {
    vi.spyOn(provider, "generateJson").mockResolvedValueOnce({
      soalPg: [
        {
          pertanyaan: "Anak memanggil anjing dengan sebutan 'kucing'. Ini contoh proses apa?",
          opsi: ["Asimilasi", "Akomodasi", "Ekuilibrasi", "Skema"],
          indeksBenar: 0,
          pembahasan: "Asimilasi adalah memasukkan informasi baru ke skema yang sudah ada.",
          kesulitan: "sedang",
          kartuRujukan: "Teori Kognitif (Jean Piaget)",
        },
      ],
      soalEssay: [
        {
          pertanyaan: "Jelaskan perbedaan asimilasi dan akomodasi dalam konteks kelas PAUD!",
          kunciJawaban:
            "Asimilasi memasukkan hal baru ke pemahaman lama, sedangkan akomodasi mengubah skema karena hal baru tidak cocok.",
          rubrik: [
            "Menjelaskan pengertian asimilasi",
            "Menjelaskan pengertian akomodasi",
            "Memberikan contoh konkret di kelas",
          ],
          kesulitan: "sulit",
          kartuRujukan: "Teori Kognitif (Jean Piaget)",
        },
      ],
    });

    const result = await generateQuiz({
      materiSlugs: ["01-psikologi-dan-perkembangan-anak"],
      jumlahPg: 3,
      jumlahEssay: 1,
      kesulitan: "sedang",
    });

    expect(result.quizId).toBeDefined();
    expect(result.soalPg.length).toBe(1);
    expect(result.soalEssay.length).toBe(1);
    expect(result.soalPg[0].opsi.length).toBe(4);
    // Jawaban benar harus tetap 'Asimilasi' meskipun letaknya diacak
    expect(result.soalPg[0].opsi[result.soalPg[0].indeksBenar]).toBe("Asimilasi");
  });

  it("harus berhasil mengevaluasi jawaban essay mahasiswa", async () => {
    vi.spyOn(provider, "generateJson").mockResolvedValueOnce({
      skor: 85,
      yangSudahBenar: ["Memahami definisi asimilasi dan akomodasi dengan baik"],
      yangKurang: ["Contoh situasi kelas PAUD kurang detail"],
      saran: "Bagus sekali! Tambahkan contoh interaksi guru-anak agar makin aplikatif.",
      jawabanContoh:
        "Asimilasi adalah memasukkan konsep baru ke skema lama, sedangkan akomodasi memperbarui skema.",
    });

    const evalResult = await evaluateEssay({
      materiSlug: "01-psikologi-dan-perkembangan-anak",
      pertanyaan: "Jelaskan konsep asimilasi!",
      kunciJawaban: "Asimilasi adalah...",
      rubrik: ["Definisi tepat", "Penjelasan contoh", "Relevan dengan PAUD"],
      jawabanPengguna: "Asimilasi adalah ketika anak menggunakan skema lamanya.",
    });

    expect(evalResult.skor).toBe(85);
    expect(evalResult.yangSudahBenar.length).toBe(1);
    expect(evalResult.saran).toContain("Bagus sekali");
  });

  it("harus langsung memberi skor 0 tanpa panggil AI jika jawaban kosong", async () => {
    const spy = vi.spyOn(provider, "generateJson");

    const evalResult = await evaluateEssay({
      materiSlug: "01-psikologi-dan-perkembangan-anak",
      pertanyaan: "Jelaskan konsep asimilasi!",
      kunciJawaban: "Asimilasi adalah...",
      rubrik: ["Poin 1", "Poin 2", "Poin 3"],
      jawabanPengguna: "   ",
    });

    expect(spy).not.toHaveBeenCalled();
    expect(evalResult.skor).toBe(0);
    expect(evalResult.yangKurang).toContain("Jawaban tidak diisi atau kosong");
  });
});
