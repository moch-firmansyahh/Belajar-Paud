import Link from "next/link";
import { Compass, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6 shadow-xs">
        <Compass className="h-10 w-10 animate-pulse" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground mb-2">
        Halaman Tidak Ditemukan
      </h1>

      <p className="text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed">
        Maaf, modul atau halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button asChild size="lg" className="rounded-xl font-semibold gap-2 cursor-pointer">
          <Link href="/">
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold gap-2 cursor-pointer">
          <Link href="/quiz">
            <BookOpen className="h-4 w-4" />
            <span>Latihan Quiz AI</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
