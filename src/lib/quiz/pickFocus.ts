import crypto from "crypto";
import { KartuMateri, TingkatKesulitan } from "@/types";

/**
 * Memilih secara acak ~60% kartu materi (minimal 3, maksimal semua kartu yang ada).
 * Menggunakan crypto.randomUUID() sebagai seed/sumber acak per PRD Bagian 7.4.
 */
export function pickFocusCards(cards: KartuMateri[]): string[] {
  if (cards.length === 0) return [];
  if (cards.length <= 3) return cards.map((c) => c.judul);

  // Ambil ~60% dari jumlah kartu, minimal 3
  const targetCount = Math.max(3, Math.round(cards.length * 0.6));

  // Acak urutan kartu memakai crypto hash / randomUUID
  const shuffled = [...cards].sort(() => {
    const uuid = crypto.randomUUID();
    const charCode = uuid.charCodeAt(0);
    return (charCode % 3) - 1;
  });

  return shuffled.slice(0, targetCount).map((c) => c.judul);
}

/**
 * Menghasilkan komposisi variasi level kemampuan (mengingat, memahami, menerapkan di situasi kelas, menganalisis)
 * sesuai tingkat kesulitan yang dipilih.
 */
export function getKomposisiLevel(
  kesulitan: TingkatKesulitan,
  totalSoal: number
): string {
  if (totalSoal <= 0) return "1 mengingat, 1 memahami";

  switch (kesulitan) {
    case "mudah": {
      const mengingat = Math.max(1, Math.ceil(totalSoal * 0.6));
      const memahami = totalSoal - mengingat;
      return `${mengingat} mengingat definisi/istilah, ${memahami} memahami konsep`;
    }
    case "sedang": {
      const memahami = Math.max(1, Math.floor(totalSoal * 0.4));
      const menerapkan = Math.max(1, Math.ceil(totalSoal * 0.4));
      const sisa = totalSoal - memahami - menerapkan;
      return `${memahami} memahami, ${menerapkan} menerapkan di situasi kelas PAUD${
        sisa > 0 ? `, ${sisa} menganalisis` : ""
      }`;
    }
    case "sulit": {
      const menerapkan = Math.max(1, Math.floor(totalSoal * 0.4));
      const menganalisis = Math.max(1, totalSoal - menerapkan);
      return `${menerapkan} menerapkan di studi kasus kelas PAUD, ${menganalisis} menganalisis tindakan guru/anak`;
    }
    case "campur":
    default: {
      const n1 = Math.max(1, Math.floor(totalSoal / 4));
      const n2 = Math.max(1, Math.floor(totalSoal / 4));
      const n3 = Math.max(1, Math.floor(totalSoal / 4));
      const n4 = Math.max(0, totalSoal - n1 - n2 - n3);
      return `${n1} mengingat, ${n2} memahami, ${n3} menerapkan di situasi nyata kelas PAUD${
        n4 > 0 ? `, ${n4} menganalisis` : ""
      }`;
    }
  }
}
