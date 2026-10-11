import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { GenerateQuizRequestSchema } from "@/lib/quiz/schema";
import { generateQuiz } from "@/lib/ai/quizGenerator";
import { MAX_BODY_SIZE_BYTES } from "@/constants";
import { AiGagalError, ValidasiError } from "@/lib/ai/provider";
import { ambilSoalCadangan } from "@/lib/quiz/bankSoalCadangan";

export async function POST(req: NextRequest) {
  // 1. Ambil IP untuk rate limiter
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateLimitStatus = checkRateLimit(ip);
  if (!rateLimitStatus.success) {
    return NextResponse.json(
      {
        error: {
          kode: "RATE_LIMIT",
          pesan: `Terlalu banyak permintaan. Silakan tunggu ${rateLimitStatus.retryAfterSeconds} detik lagi sebelum membuat soal baru.`,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitStatus.retryAfterSeconds),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // 2. Batasi ukuran body maksimal 20 KB
  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_SIZE_BYTES) {
    return NextResponse.json(
      {
        error: {
          kode: "VALIDASI",
          pesan: "Ukuran permintaan melebihi batas 20 KB.",
        },
      },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const body = await req.json();
    const validation = GenerateQuizRequestSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = validation.error.issues
        .map((i) => i.message)
        .join(", ");
      return NextResponse.json(
        {
          error: {
            kode: "VALIDASI",
            pesan: `Permintaan tidak valid: ${errorMsg}`,
          },
        },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const quizResponse = await generateQuiz(validation.data);

    return NextResponse.json(quizResponse, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    if (error instanceof ValidasiError) {
      return NextResponse.json(
        { error: { kode: "VALIDASI", pesan: error.message } },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Secondary Failsafe: Jika ada exception tak terduga, langsung selamatkan dengan Bank Soal Cadangan!
    try {
      const fallbackData = ambilSoalCadangan({
        materiSlugs: ["01-psikologi-dan-perkembangan-anak"],
        jumlahPg: 5,
        jumlahEssay: 2,
        kesulitan: "campur",
      });
      return NextResponse.json(fallbackData, {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      });
    } catch {
      const pesan =
        error instanceof AiGagalError
          ? error.message
          : "Terjadi gangguan saat membuat soal AI. Silakan coba lagi.";

      return NextResponse.json(
        { error: { kode: "AI_GAGAL", pesan } },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }
  }
}
