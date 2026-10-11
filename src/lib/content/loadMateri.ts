import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MateriFrontmatterSchema } from "./schema";
import { parseMarkdownContent } from "./parseKartu";
import { MateriDetail, MateriFrontmatter } from "@/types";

const MATERI_DIR = path.join(process.cwd(), "content", "materi");

export function getAllMateriSlugs(): string[] {
  if (!fs.existsSync(MATERI_DIR)) return [];
  const files = fs.readdirSync(MATERI_DIR);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getMateriBySlug(slug: string): MateriDetail | null {
  const filePath = path.join(MATERI_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const rawFile = fs.readFileSync(filePath, "utf-8");
  const { data: rawFrontmatter, content } = matter(rawFile);

  // Validasi frontmatter dengan Zod
  const validatedFrontmatter = MateriFrontmatterSchema.safeParse(rawFrontmatter);
  if (!validatedFrontmatter.success) {
    const errorMsg = validatedFrontmatter.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Frontmatter validation failed for ${slug}.md: ${errorMsg}`);
  }

  const parsed = parseMarkdownContent(content);

  return {
    ...validatedFrontmatter.data,
    pengantar: parsed.pengantar,
    judulHalaman: parsed.judulHalaman,
    kartu: parsed.kartu,
    kataKunci: parsed.kataKunci,
  };
}

export function getAllMateri(): MateriDetail[] {
  const slugs = getAllMateriSlugs();
  const list = slugs
    .map((slug) => getMateriBySlug(slug))
    .filter((m): m is MateriDetail => m !== null);

  return list.sort((a, b) => a.urutan - b.urutan);
}

export function getAllMateriSummary(): MateriFrontmatter[] {
  return getAllMateri().map((m) => ({
    judul: m.judul,
    slug: m.slug,
    urutan: m.urutan,
    tema: m.tema,
    sumber: m.sumber,
    ringkasan: m.ringkasan,
  }));
}
