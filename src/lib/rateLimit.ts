import { RATE_LIMIT_DEFAULT } from "@/constants";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Bersihkan data lama setiap 5 menit
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now > record.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  ip: string,
  limitPerMinute: number = RATE_LIMIT_DEFAULT
): RateLimitResult {
  const now = Date.now();
  const windowMs = 60 * 1000;

  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetTime) {
    ipRequestMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit: limitPerMinute,
      remaining: limitPerMinute - 1,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= limitPerMinute) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      limit: limitPerMinute,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfter),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: limitPerMinute,
    remaining: limitPerMinute - record.count,
    retryAfterSeconds: 0,
  };
}
