"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error code/digest only without sensitive user data
    console.error("App error:", error.message);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 mb-6 shadow-xs">
        <AlertTriangle className="h-10 w-10" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-2">
        Terjadi Sedikit Kendala
      </h1>

      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Sistem sedang mengalami gangguan sementara. Silakan coba muat ulang atau kembali ke halaman beranda.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          onClick={() => reset()}
          size="lg"
          className="rounded-xl font-semibold gap-2 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Coba Lagi</span>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold gap-2 cursor-pointer">
          <Link href="/">
            <Home className="h-4 w-4" />
            <span>Ke Beranda</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
