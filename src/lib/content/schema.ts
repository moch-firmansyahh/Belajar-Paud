import { z } from "zod";

export const MateriFrontmatterSchema = z.object({
  judul: z.string().min(1, "Judul materi wajib diisi"),
  slug: z.string().min(1, "Slug materi wajib diisi"),
  urutan: z.number().int().positive("Urutan materi harus bilangan bulat positif"),
  tema: z.enum(["doodle", "pink", "toska", "cokelat"], {
    message: "Tema harus salah satu dari: doodle, pink, toska, cokelat",
  }),
  sumber: z.string().min(1, "Sumber materi wajib diisi"),
  ringkasan: z.string().min(1, "Ringkasan materi wajib diisi"),
});

export type MateriFrontmatterInput = z.infer<typeof MateriFrontmatterSchema>;
