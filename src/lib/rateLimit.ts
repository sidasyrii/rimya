interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const limits = new Map<string, RateLimitRecord>();

export function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = limits.get(ip);

  if (!record || record.resetTime < now) {
    limits.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}
