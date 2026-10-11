import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40 py-8 text-sm text-muted-foreground transition-colors">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-foreground">
            Web Belajar Interaktif PAUD &bull; Kelompok 11
          </p>
          <p className="text-xs text-muted-foreground">
            Rangkuman materi presentasi & generator quiz bertenaga AI Gemini.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            id="link-footer-quiz"
            href="/quiz"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Latihan Quiz AI
          </Link>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            Dibuat dengan <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> untuk PAUD
          </span>
        </div>
      </div>
    </footer>
  );
}
