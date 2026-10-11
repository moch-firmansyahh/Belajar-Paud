import { supabase, isSupabaseConfigured } from "./client";
import { RiwayatQuizItem } from "@/types";

export { isSupabaseConfigured };

export interface SupabaseRiwayatRow {
  id?: string;
  quiz_id: string;
  tanggal: string;
  materi_slugs: string[];
  skor_pg: number;
  skor_essay: number;
  skor_akhir: number;
  total_pg: number;
  total_essay: number;
  kesulitan: string;
  detail_hasil?: unknown;
}

export async function saveQuizToSupabase(
  item: RiwayatQuizItem,
  detailHasil?: unknown
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase.from("riwayat_quiz").insert([
      {
        quiz_id: item.quizId,
        tanggal: item.tanggal,
        materi_slugs: item.materiSlugs,
        skor_pg: item.skorPg,
        skor_essay: item.skorEssay,
        skor_akhir: item.skorAkhir,
        total_pg: item.totalPg,
        total_essay: item.totalEssay,
        kesulitan: item.kesulitan,
        detail_hasil: detailHasil,
      },
    ]);

    if (error) {
      console.warn("Gagal menyimpan ke Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Kesalahan koneksi Supabase:", err);
    return false;
  }
}

export async function fetchQuizFromSupabase(): Promise<RiwayatQuizItem[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from("riwayat_quiz")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data) {
      console.warn("Gagal mengambil data dari Supabase:", error?.message);
      return null;
    }

    return data.map((row: SupabaseRiwayatRow) => ({
      quizId: row.quiz_id,
      tanggal: row.tanggal,
      materiSlugs: row.materi_slugs,
      materiJudul: row.materi_slugs,
      skorPg: row.skor_pg,
      skorEssay: row.skor_essay,
      skorAkhir: row.skor_akhir,
      totalPg: row.total_pg,
      totalEssay: row.total_essay,
      kesulitan: row.kesulitan as RiwayatQuizItem["kesulitan"],
    }));
  } catch (err) {
    console.warn("Kesalahan saat fetch dari Supabase:", err);
    return null;
  }
}

export async function clearQuizInSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase
      .from("riwayat_quiz")
      .delete()
      .neq("quiz_id", "");

    if (error) {
      console.warn("Gagal menghapus riwayat di Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Kesalahan saat delete di Supabase:", err);
    return false;
  }
}
