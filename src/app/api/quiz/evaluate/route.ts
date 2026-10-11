import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { EvaluateEssayRequestSchema } from "@/lib/quiz/schema";
import { evaluateEssay } from "@/lib/ai/essayEvaluator";
import { MAX_BODY_SIZE_BYTES } from "@/constants";
import { AiGagalError } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  // 1. Rate limiter
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
          pesan: `Terlalu banyak permintaan evaluasi. Tunggu ${rateLimitStatus.retryAfterSeconds} detik.`,
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

  // 2. Batas ukuran body maksimal 20 KB
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
    const validation = EvaluateEssayRequestSchema.safeParse(body);

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

    const evaluationResult = await evaluateEssay(validation.data);

    return NextResponse.json(evaluationResult, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    const pesan =
      error instanceof AiGagalError
        ? error.message
        : "Terjadi gangguan saat mengevaluasi jawaban. Silakan coba lagi.";

    return NextResponse.json(
      { error: { kode: "AI_GAGAL", pesan } },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
