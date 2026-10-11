import { KartuMateri } from "@/types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface ParseResult {
  judulHalaman: string;
  pengantar: string;
  kartu: KartuMateri[];
  kataKunci: string[];
}

export function parseMarkdownContent(rawContent: string): ParseResult {
  const lines = rawContent.split(/\r?\n/);
  let judulHalaman = "";
  let pengantar = "";
  const kartu: KartuMateri[] = [];
  let kataKunci: string[] = [];

  // 1. Ambil # judul halaman dan pengantar sebelum ## pertama
  let firstH2Index = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("# ") && !judulHalaman) {
      judulHalaman = line.replace(/^#\s+/, "").trim();
    } else if (line.startsWith("## ")) {
      firstH2Index = i;
      break;
    } else if (judulHalaman && line && !pengantar) {
      pengantar = line;
    }
  }

  const contentFromFirstH2 = firstH2Index !== -1 ? lines.slice(firstH2Index).join("\n") : "";

  // 2. Pisahkan berdasarkan pola "## "
  // Regex untuk memisahkan setiap ## Heading
  const sections = contentFromFirstH2.split(/\n(?=##\s+)/);

  for (const section of sections) {
    const trimmedSection = section.trim();
    if (!trimmedSection.startsWith("## ")) continue;

    const sectionLines = trimmedSection.split(/\r?\n/);
    const headingLine = sectionLines[0];
    const judul = headingLine.replace(/^##\s+/, "").trim();

    if (judul.toLowerCase() === "kata kunci") {
      // Ekstrak kata kunci
      const bodyText = sectionLines
        .slice(1)
        .join(" ")
        .replace(/Daftar istilah di materi ini[^:]*:\s*/i, "")
        .trim();

      kataKunci = bodyText
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      continue;
    }

    // Parsing kartu materi
    const bodyLines = sectionLines.slice(1);
    let label = "";
    let apaItu = "";
    let ingat = "";
    const isiMarkdownLines: string[] = [];

    let inApaItu = false;
    const apaItuBuffer: string[] = [];

    for (const rawLine of bodyLines) {
      const line = rawLine.trim();

      // Cek label (biasanya *Teori | Tokoh...*)
      if (line.startsWith("*") && line.endsWith("*") && !label && !inApaItu) {
        label = line.replace(/^\*+|\*+$/g, "").trim();
        continue;
      }

      // Cek Apa itu
      if (line.startsWith("**Apa itu:**")) {
        inApaItu = true;
        const textAfter = line.replace(/^\*\*Apa itu:\*\*\s*/, "").trim();
        if (textAfter) {
          apaItuBuffer.push(textAfter);
        }
        continue;
      }

      // Cek Ingat
      if (line.startsWith(">") && (line.includes("**Ingat:**") || line.includes("Ingat:"))) {
        inApaItu = false;
        const ingatText = line
          .replace(/^>\s*/, "")
          .replace(/\*\*Ingat:\*\*\s*/i, "")
          .replace(/Ingat:\s*/i, "")
          .trim();
        ingat = ingatText;
        continue;
      }

      // Jika dalam blok Apa itu, kumpulkan sampai baris kosong atau bullet / table
      if (inApaItu) {
        if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("|") || line.startsWith(">")) {
          inApaItu = false;
        } else if (line.length > 0) {
          apaItuBuffer.push(line);
          continue;
        } else {
          inApaItu = false;
          continue;
        }
      }

      // Isi markdown (bullet list, tabel, dsb)
      if (line.length > 0 && !line.startsWith(">")) {
        isiMarkdownLines.push(rawLine);
      }
    }

    apaItu = apaItuBuffer.join(" ").trim();
    const isiMarkdown = isiMarkdownLines.join("\n").trim();
    const id = slugify(judul);

    kartu.push({
      id,
      judul,
      label,
      apaItu,
      isiMarkdown,
      ingat,
    });
  }

  return {
    judulHalaman,
    pengantar,
    kartu,
    kataKunci,
  };
}
