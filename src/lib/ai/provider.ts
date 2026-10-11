import { GoogleGenAI } from "@google/genai";

export class ValidasiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidasiError";
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export class AiGagalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiGagalError";
  }
}

export interface GenerateJsonOptions {
  systemPrompt?: string;
  temperature?: number;
}

/**
 * Adapter provider AI yang membungkus SDK Google GenAI.
 * Dilengkapi automatic model fallback (jika model utama 503 high demand / 404).
 */
export async function generateJson<T>(
  userPrompt: string,
  options: GenerateJsonOptions = {}
): Promise<T> {
  const apiKey = process.env.AI_API_KEY?.trim();
  const primaryModel = process.env.AI_MODEL?.trim() || "gemini-3.5-flash-lite";

  if (!apiKey) {
    throw new AiGagalError(
      "API Key belum dikonfigurasi. Tambahkan AI_API_KEY di environment server (.env.local)."
    );
  }

  // Model-model tercepat (respons ~1.2 detik) dan tahan lonjakan traffic
  const candidateModels = Array.from(
    new Set([primaryModel, "gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.8-flash"])
  );

  const ai = new GoogleGenAI({ apiKey });
  let lastError: Error | null = null;

  for (const currentModel of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: userPrompt,
        config: {
          systemInstruction: options.systemPrompt,
          temperature: options.temperature ?? 1.0,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text;
      if (!responseText) {
        continue;
      }

      // Bersihkan pembatas markdown ```json jika ada
      const cleanedText = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      return JSON.parse(cleanedText) as T;
    } catch (error: unknown) {
      const err = error as Error;
      lastError = err;
      console.warn(
        `Model ${currentModel} mengalami kendala: ${err.message}. Mencoba model cadangan...`
      );
    }
  }

  throw new AiGagalError(
    `Layanan AI Google sedang mengalami lonjakan traffic tinggi (503): ${
      lastError?.message || "Silakan coba klik kembali beberapa saat lagi."
    }`
  );
}
