import { describe, it, expect } from "vitest";
import { shuffleQuestionOptions } from "../shuffle";
import { hitungSkorPg, hitungRataRataEssay, hitungSkorAkhir } from "../scoring";
import { pickFocusCards, getKomposisiLevel } from "../pickFocus";
import { GenerateQuizRequestSchema, AiQuizOutputSchema } from "../schema";
import { KartuMateri } from "@/types";

describe("Quiz Utilities & Scoring", () => {
  describe("shuffleQuestionOptions", () => {
    it("harus menjaga konsistensi jawaban benar meskipun opsi diacak", () => {
      const q = {
        pertanyaan: "Siapa tokoh teori kognitif?",
        opsi: ["Jean Piaget", "Ivan Pavlov", "B.F. Skinner", "Erik Erikson"],
        indeksBenar: 0, // 'Jean Piaget'
      };

      // Jalankan 10 kali untuk memastikan selalu konsisten
      for (let i = 0; i < 10; i++) {
        const shuffled = shuffleQuestionOptions(q);
        expect(shuffled.opsi.length).toBe(4);
        expect(shuffled.opsi[shuffled.indeksBenar]).toBe("Jean Piaget");
      }
    });
  });

  describe("scoring (PRD Bagian 7.6 & Lampiran B)", () => {
    it("harus menghitung skor PG dengan benar", () => {
      expect(hitungSkorPg(4, 5)).toBe(80);
      expect(hitungSkorPg(5, 5)).toBe(100);
      expect(hitungSkorPg(0, 5)).toBe(0);
      expect(hitungSkorPg(0, 0)).toBe(0);
    });

    it("harus menghitung rata-rata essay dengan benar", () => {
      expect(hitungRataRataEssay([70, 90])).toBe(80);
      expect(hitungRataRataEssay([85])).toBe(85);
      expect(hitungRataRataEssay([])).toBe(0);
    });

    it("harus lulus skenario Lampiran B: 5 PG (benar 4 = 80) & 2 essay (70, 90 = 80) -> skor akhir 80", () => {
      const skorPg = hitungSkorPg(4, 5); // 80
      const skorEssay = hitungRataRataEssay([70, 90]); // 80
      const skorAkhir = hitungSkorAkhir(skorPg, skorEssay, true, true);
      expect(skorAkhir).toBe(80);
    });

    it("harus memberikan bobot 100% jika hanya ada satu jenis soal", () => {
      // Hanya PG
      expect(hitungSkorAkhir(85, 0, true, false)).toBe(85);
      // Hanya Essay
      expect(hitungSkorAkhir(0, 92, false, true)).toBe(92);
    });
  });

  describe("pickFocus & getKomposisiLevel", () => {
    it("harus memilih minimal 3 kartu dan sekitar 60% jika kartu banyak", () => {
      const dummyCards: KartuMateri[] = Array.from({ length: 10 }, (_, i) => ({
        id: `card-${i}`,
        judul: `Judul Kartu ${i}`,
        label: "Teori",
        apaItu: "Definisi",
        isiMarkdown: "Isi",
        ingat: "Ingat",
      }));

      const focus = pickFocusCards(dummyCards);
      expect(focus.length).toBeGreaterThanOrEqual(3);
      expect(focus.length).toBe(6); // 60% dari 10
    });

    it("harus mengembalikan string komposisi level yang sesuai kesulitan", () => {
      expect(getKomposisiLevel("mudah", 5)).toContain("mengingat");
      expect(getKomposisiLevel("sedang", 5)).toContain("menerapkan");
      expect(getKomposisiLevel("sulit", 5)).toContain("menganalisis");
    });
  });

  describe("Zod Schema Validation", () => {
    it("harus menolak request quiz jika jumlah PG dan Essay sama-sama 0", () => {
      const res = GenerateQuizRequestSchema.safeParse({
        materiSlugs: ["01-psikologi-dan-perkembangan-anak"],
        jumlahPg: 0,
        jumlahEssay: 0,
        kesulitan: "campur",
      });
      expect(res.success).toBe(false);
    });

    it("harus menerima request quiz yang valid", () => {
      const res = GenerateQuizRequestSchema.safeParse({
        materiSlugs: ["01-psikologi-dan-perkembangan-anak"],
        jumlahPg: 5,
        jumlahEssay: 2,
        kesulitan: "campur",
      });
      expect(res.success).toBe(true);
    });

    it("harus otomatis memotong pokok soal lama jika melebihi 300 karakter", () => {
      const longStem = "A".repeat(500);
      const res = GenerateQuizRequestSchema.safeParse({
        materiSlugs: ["01-psikologi-dan-perkembangan-anak"],
        jumlahPg: 5,
        jumlahEssay: 0,
        kesulitan: "campur",
        soalSebelumnya: [longStem],
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.soalSebelumnya?.[0].length).toBe(300);
      }
    });

    it("harus menolak output AI jika opsi PG tidak berjumlah 4", () => {
      const res = AiQuizOutputSchema.safeParse({
        soalPg: [
          {
            pertanyaan: "Contoh soal",
            opsi: ["A", "B", "C"], // Cuma 3 opsi
            indeksBenar: 0,
            pembahasan: "Pembahasan",
            kesulitan: "mudah",
            kartuRujukan: "Judul Kartu",
          },
        ],
        soalEssay: [],
      });
      expect(res.success).toBe(false);
    });
  });
});
