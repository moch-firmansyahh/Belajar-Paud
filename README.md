# Web Belajar PAUD Kelompok 11

Aplikasi web belajar interaktif untuk mahasiswa Pendidikan Guru PAUD (Pendidikan Anak Usia Dini). Berisi rangkuman materi presentasi kelompok yang disajikan dalam bentuk kartu belajar terstruktur, serta latihan soal Pilihan Ganda (PG) dan Essay kasus yang digenerate secara dinamis dan variatif bertenaga AI Google Gemini.

---

## Fitur Utama

1. **4 Modul Materi Presentasi Terstruktur**:
   - Modul 1: Landasan Psikologi dan Perkembangan Anak (*Tema Doodle*)
   - Modul 2: Konsep Learning Environment (*Tema Pink & Marun*)
   - Modul 3: Memahami dan Mengkaji Pedagogik (*Tema Toska*)
   - Modul 4: Landasan Sosiologis dan Korelasi Budaya (*Tema Cokelat*)
2. **Kartu Belajar Terarah**:
   - Label kategori/tokoh, kotak "Apa itu", daftar konsep tebal, kotak "Ingat" berwarna kuning lembut.
   - Tabel 8 Tahap Erikson dirender interaktif dan menyorot tahap anak PAUD (tahap 2 & 3).
   - Penanda "Sudah Paham" (Checklist) yang otomatis menghitung progres per materi.
   - Daftar kata kunci & istilah penting di setiap modul.
3. **Latihan Soal Bertenaga AI (Gemini)**:
   - Kombinasi soal Pilihan Ganda (3, 5, 10 soal) dan Essay (1, 2, 3 soal).
   - Tingkat kesulitan: Mudah, Sedang, Sulit, Campur.
   - Strategi Anti-Pengulangan: AI memvariasikan studi kasus kelas PAUD nyata, mengacak fokus materi (~60%), dan menghindari 30 soal sebelumnya.
   - Posisi opsi jawaban PG diacak di server untuk mencegah bias pola jawaban.
4. **Penilaian Mandiri & Evaluasi Dosen AI**:
   - Penilaian instan PG langsung di browser.
   - Evaluasi jawaban essay oleh AI dosen PAUD: skor 0-100, poin yang tepat, poin yang masih kurang, saran perbaikan hangat, dan contoh jawaban ideal.
   - Pembahasan interaktif dalam Accordion dan tautan langsung *"Baca ulang kartunya"* menuju kartu materi asal soal.
5. **Riwayat Latihan & Privasi**:
   - Menyimpan hingga 20 riwayat latihan di penyimpanan lokal browser.
   - Tombol "Ulangi" untuk mengulang kuis dengan pengaturan yang sama.
   - Tanpa login atau pendaftaran akun.
6. **Desain Modern (shadcn/ui)**:
   - Dukungan Mode Terang & Gelap otomatis sesuai perangkat atau sakelar manual.
   - Tampilan responsif (mulai 360px hingga layar desktop lebar) dengan ukuran target sentuh nyaman.

---

## Tech Stack

- **Framework**: Next.js 15/16 (App Router)
- **Bahasa**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 & shadcn/ui
- **Komponen**: Radix UI Primitives, Lucide React Icons
- **Markdown**: Gray-matter, React-Markdown, Remark-GFM
- **Validasi**: Zod
- **AI Provider**: Google GenAI SDK (`@google/genai`)
- **Testing**: Vitest
- **Package Manager**: pnpm

---

## Panduan Menjalankan Proyek

### 1. Prasyarat
- Node.js versi 18 atau lebih baru
- `pnpm` (`npm install -g pnpm`)

### 2. Instalasi Dependensi
```bash
pnpm install
```

### 3. Konfigurasi Environment
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel lingkungan:
```env
# Dapatkan API Key gratis di https://aistudio.google.com/
AI_API_KEY=kunci_api_gemini_anda

# Model rekomendasi (cepat, murah, dan terstruktur)
AI_MODEL=gemini-2.5-flash

# Batas permintaan per IP per menit (default 8)
RATE_LIMIT_PER_MINUTE=8

# Nama Aplikasi
NEXT_PUBLIC_APP_NAME="Belajar PAUD"
```

### 4. Menjalankan Server Pengembangan
```bash
pnpm dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

### 5. Menjalankan Pengujian (Unit Tests)
```bash
pnpm test
```

### 6. Menjalankan Linting
```bash
pnpm lint
```

### 7. Membangun Bundle Produksi
```bash
pnpm build
```

---

## Cara Menambah Materi Baru

Materi disimpan di folder `content/materi/` dalam format Markdown (`.md`).
Untuk menambahkan materi baru:
1. Buat file baru di `content/materi/`, contoh: `05-kurikulum-paud.md`.
2. Sertakan frontmatter YAML wajib di awal file:
```markdown
---
judul: Kurikulum dan Pembelajaran PAUD
slug: 05-kurikulum-paud
urutan: 5
tema: toska
sumber: Kurikulum Merdeka PAUD.pdf
ringkasan: "Penjelasan kurikulum merdeka dan pendekatan berbasis bermain."
---
```
3. Gunakan heading `#` untuk judul dan `##` untuk tiap kartu belajar:
```markdown
# Kurikulum dan Pembelajaran PAUD

Pengantar materi...

## Pendekatan Bermain Bermakna

*Pendekatan*

**Apa itu:** Belajar melalui bermain yang dirancang dengan tujuan stimulasi.

- **Poin 1**: Penjelasan konsep
- **Poin 2**: Penjelasan konsep

> **Ingat:** Bermain adalah cara anak belajar paling alami.

## Kata Kunci

Istilah 1, Istilah 2, Istilah 3
```
4. Sistem akan otomatis memvalidasi, memuat, dan menyertakan materi baru ke beranda dan generator kuis AI tanpa perlu mengubah kode sumber.
