import { Suspense } from "react";
import { Metadata } from "next";
import { getAllMateri } from "@/lib/content/loadMateri";
import { FormPengaturanQuiz } from "@/components/quiz/FormPengaturanQuiz";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Pengaturan Quiz AI | Belajar PAUD Kelompok 11",
  description:
    "Atur jumlah soal pilihan ganda, essay, dan tingkat kesulitan untuk menghasilkan latihan soal AI otomatis.",
};

export default function QuizSettingsPage() {
  const materiList = getAllMateri();

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12 flex-1">
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto space-y-4">
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        }
      >
        <FormPengaturanQuiz materiList={materiList} />
      </Suspense>
    </div>
  );
}
