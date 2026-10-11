import { describe, it, expect } from "vitest";
import { ambilSoalCadangan, BANK_SOAL_PG, BANK_SOAL_ESSAY } from "../bankSoalCadangan";

describe("Bank Soal Cadangan Failsafe", () => {
  it("harus memiliki bank soal PG dan Essay terkurasi yang valid", () => {
    expect(BANK_SOAL_PG.length).toBeGreaterThanOrEqual(15);
    expect(BANK_SOAL_ESSAY.length).toBeGreaterThanOrEqual(6);

    // Pastikan seluruh soal PG memiliki 4 opsi dan indeksBenar dalam rentang 0-3
    for (const pg of BANK_SOAL_PG) {
      expect(pg.opsi).toHaveLength(4);
      expect(pg.indeksBenar).toBeGreaterThanOrEqual(0);
      expect(pg.indeksBenar).toBeLessThan(4);
      expect(pg.pertanyaan.length).toBeGreaterThan(10);
      expect(pg.pembahasan.length).toBeGreaterThan(5);
    }

    // Pastikan seluruh soal Essay memiliki rubrik
    for (const es of BANK_SOAL_ESSAY) {
      expect(es.rubrik.length).toBeGreaterThanOrEqual(2);
      expect(es.kunciJawaban.length).toBeGreaterThan(10);
    }
  });

  it("harus menghasilkan kuis sesuai jumlah PG dan Essay yang diminta", () => {
    const hasil = ambilSoalCadangan({
      materiSlugs: ["01-psikologi-dan-perkembangan-anak", "02-learning-environment"],
      jumlahPg: 5,
      jumlahEssay: 2,
      kesulitan: "campur",
    });

    expect(hasil.soalPg).toHaveLength(5);
    expect(hasil.soalEssay).toHaveLength(2);
    expect(hasil.sumber).toBe("cadangan");
    expect(hasil.quizId).toBeDefined();

    // Verifikasi opsi PG teracak dan valid
    for (const pg of hasil.soalPg) {
      expect(pg.opsi).toHaveLength(4);
      expect(pg.opsi[pg.indeksBenar]).toBeDefined();
    }
  });

  it("harus menangani permintaan hanya PG atau hanya Essay", () => {
    const hasilHanyaPg = ambilSoalCadangan({
      materiSlugs: ["03-pedagogik"],
      jumlahPg: 3,
      jumlahEssay: 0,
      kesulitan: "sedang",
    });
    expect(hasilHanyaPg.soalPg).toHaveLength(3);
    expect(hasilHanyaPg.soalEssay).toHaveLength(0);

    const hasilHanyaEssay = ambilSoalCadangan({
      materiSlugs: ["04-sosiologis-dan-budaya"],
      jumlahPg: 0,
      jumlahEssay: 2,
      kesulitan: "sulit",
    });
    expect(hasilHanyaEssay.soalPg).toHaveLength(0);
    expect(hasilHanyaEssay.soalEssay).toHaveLength(2);
  });
});
