import { describe, it, expect } from "vitest";
import { getAllMateri, getMateriBySlug } from "../loadMateri";
import { slugify } from "../parseKartu";

describe("Content Parser & Validator", () => {
  it("harus membuat slug yang rapi dan konsisten", () => {
    expect(slugify("Teori Kognitif (Jean Piaget)")).toBe("teori-kognitif-jean-piaget");
    expect(slugify("4 Tahap Perkembangan Kognitif (Jean Piaget)")).toBe(
      "4-tahap-perkembangan-kognitif-jean-piaget"
    );
  });

  it("harus berhasil memuat dan memvalidasi semua 4 file materi", () => {
    const list = getAllMateri();
    expect(list.length).toBe(4);

    const slugs = list.map((m) => m.slug);
    expect(slugs).toEqual([
      "01-psikologi-dan-perkembangan-anak",
      "02-learning-environment",
      "03-pedagogik",
      "04-sosiologis-dan-budaya",
    ]);

    for (const materi of list) {
      expect(materi.judul).toBeTruthy();
      expect(materi.slug).toBeTruthy();
      expect(materi.tema).toBeDefined();
      expect(materi.kartu.length).toBeGreaterThan(0);
      expect(materi.kataKunci.length).toBeGreaterThan(0);
    }
  });

  it("harus mengurai materi psikologi dengan kartu yang tepat dan tabel erikson", () => {
    const materi = getMateriBySlug("01-psikologi-dan-perkembangan-anak");
    expect(materi).not.toBeNull();
    if (!materi) return;

    expect(materi.kartu.length).toBeGreaterThanOrEqual(10);
    const kartuPiaget = materi.kartu.find((k) => k.id.includes("teori-kognitif-jean-piaget"));
    expect(kartuPiaget).toBeDefined();
    expect(kartuPiaget?.label).toContain("Tokoh: Jean Piaget");
    expect(kartuPiaget?.apaItu).toContain("cara anak berpikir");
    expect(kartuPiaget?.ingat).toContain("bukan gelas kosong");

    // Cek Erikson
    const kartuErikson = materi.kartu.find((k) => k.id.includes("teori-psikososial"));
    expect(kartuErikson).toBeDefined();
    expect(kartuErikson?.isiMarkdown).toContain("Percaya vs Tidak percaya");
    expect(kartuErikson?.isiMarkdown).toContain("Mandiri vs Malu dan ragu");
  });

  it("harus mengekstrak kata kunci dan tidak memasukkannya sebagai kartu materi", () => {
    const materi = getMateriBySlug("02-learning-environment");
    expect(materi).not.toBeNull();
    if (!materi) return;

    const kartuKataKunci = materi.kartu.find((k) => k.judul.toLowerCase() === "kata kunci");
    expect(kartuKataKunci).toBeUndefined();
    expect(materi.kataKunci.length).toBeGreaterThan(5);
    expect(materi.kataKunci).toContain("Penataan ruang");
  });
});
