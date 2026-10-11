import React from "react";
import { Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KataKunciProps {
  kataKunci: string[];
}

export function KataKunci({ kataKunci }: KataKunciProps) {
  if (!kataKunci || kataKunci.length === 0) return null;

  return (
    <div id="kata-kunci" className="scroll-mt-24 rounded-2xl border bg-card/60 p-6 shadow-xs backdrop-blur-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Hash className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">
            Kata Kunci & Istilah Penting
          </h3>
          <p className="text-xs text-muted-foreground">
            Daftar konsep penting yang sering diujikan dalam quiz AI
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {kataKunci.map((kata, idx) => (
          <Badge
            key={`${kata}-${idx}`}
            variant="secondary"
            className="text-xs sm:text-sm font-medium px-3 py-1 bg-muted/80 hover:bg-muted text-foreground/90 border border-border/60 transition-colors"
          >
            {kata}
          </Badge>
        ))}
      </div>
    </div>
  );
}
