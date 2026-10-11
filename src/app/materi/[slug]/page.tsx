import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllMateri, getAllMateriSlugs, getMateriBySlug } from "@/lib/content/loadMateri";
import { MateriViewClient } from "@/components/materi/MateriViewClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllMateriSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const materi = getMateriBySlug(slug);
  if (!materi) {
    return { title: "Materi Tidak Ditemukan - Belajar PAUD" };
  }

  return {
    title: `${materi.judul} | Belajar PAUD Kelompok 11`,
    description: materi.ringkasan,
  };
}

export default async function MateriPage({ params }: PageProps) {
  const { slug } = await params;
  const materi = getMateriBySlug(slug);

  if (!materi) {
    notFound();
  }

  const allMateri = getAllMateri();
  const currentIndex = allMateri.findIndex((m) => m.slug === slug);
  const prevMateri = currentIndex > 0 ? allMateri[currentIndex - 1] : null;
  const nextMateri = currentIndex < allMateri.length - 1 ? allMateri[currentIndex + 1] : null;

  return (
    <MateriViewClient
      materi={materi}
      prevMateri={prevMateri}
      nextMateri={nextMateri}
    />
  );
}
