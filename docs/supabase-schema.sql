-- ============================================================
-- SQL SCHEMA UNTUK WEB BELAJAR PAUD KELOMPOK 11
-- Copy dan paste seluruh isi file ini ke Supabase SQL Editor
-- ============================================================

-- 1. Buat tabel riwayat_quiz
CREATE TABLE IF NOT EXISTS public.riwayat_quiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  quiz_id TEXT NOT NULL,
  tanggal TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  materi_slugs TEXT[] NOT NULL,
  skor_pg INTEGER NOT NULL DEFAULT 0,
  skor_essay INTEGER NOT NULL DEFAULT 0,
  skor_akhir INTEGER NOT NULL DEFAULT 0,
  total_pg INTEGER NOT NULL DEFAULT 0,
  total_essay INTEGER NOT NULL DEFAULT 0,
  kesulitan TEXT NOT NULL DEFAULT 'campur',
  detail_hasil JSONB
);

-- 2. Buat index untuk performa query
CREATE INDEX IF NOT EXISTS idx_riwayat_created_at ON public.riwayat_quiz (created_at DESC);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.riwayat_quiz ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan (Policy) agar pengguna web bisa membaca & menyimpan riwayat tanpa login
DROP POLICY IF EXISTS "Izinkan publik membaca riwayat" ON public.riwayat_quiz;
CREATE POLICY "Izinkan publik membaca riwayat"
  ON public.riwayat_quiz
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Izinkan publik menyimpan riwayat" ON public.riwayat_quiz;
CREATE POLICY "Izinkan publik menyimpan riwayat"
  ON public.riwayat_quiz
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Izinkan publik menghapus riwayat" ON public.riwayat_quiz;
CREATE POLICY "Izinkan publik menghapus riwayat"
  ON public.riwayat_quiz
  FOR DELETE
  USING (true);
