/**
 * Modul penilaian skor Quiz (PRD Bagian 7.6 & Lampiran B)
 */

export function hitungSkorPg(totalBenar: number, totalSoal: number): number {
  if (totalSoal <= 0) return 0;
  return Math.round((totalBenar / totalSoal) * 100);
}

export function hitungRataRataEssay(skorList: number[]): number {
  if (skorList.length === 0) return 0;
  const total = skorList.reduce((acc, curr) => acc + curr, 0);
  return Math.round(total / skorList.length);
}

export function hitungSkorAkhir(
  skorPg: number,
  skorEssay: number,
  hasPg: boolean,
  hasEssay: boolean
): number {
  if (hasPg && hasEssay) {
    return Math.round(0.5 * skorPg + 0.5 * skorEssay);
  }
  if (hasPg && !hasEssay) {
    return Math.round(skorPg);
  }
  if (!hasPg && hasEssay) {
    return Math.round(skorEssay);
  }
  return 0;
}
