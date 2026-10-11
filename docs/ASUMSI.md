# Catatan Asumsi Teknis & Keputusan Desain

1. **"Sanch UI" = shadcn/ui**:
   Sesuai catatan PRD Bagian 0 dan permintaan user, komponen UI menggunakan implementasi resmi shadcn/ui berbasis Tailwind CSS dan Radix UI primitives.

2. **Penyimpanan Rate Limit**:
   Rate limiter pada route handler menggunakan in-memory Map berbasis IP klien (dengan sliding window / per menit). Untuk deployment multi-instance di Vercel atau serverless skala besar di masa depan, layer ini dapat diganti dengan Redis / Upstash KV tanpa mengubah signature fungsi.

3. **Fallback AI & Offline Mocking**:
   Jika `AI_API_KEY` belum diset di lokal development, sistem memberikan pesan ramah yang jelas dan route handler mengembalikan error informatif yang mengarahkan pengguna/pengembang untuk menambahkan `AI_API_KEY` di `.env.local`.

4. **Kunci Jawaban PG**:
   Sesuai PRD Bagian 9.3, kunci jawaban PG disimpan di memori klien selama pengerjaan dan TIDAK pernah dirender ke DOM hingga pengguna menekan tombol "Kumpulkan".
