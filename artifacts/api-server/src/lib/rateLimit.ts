interface Bucket { tokens: number; updatedAt: number }

const buckets = new Map<string, Bucket>();
const CAPACITY = 60;
const REFILL_PER_MS = 60 / 60_000; // 60 tokens / minute
const MAX_KEYS = 5_000;

export const allow = (key: string): boolean => {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b) {
    if (buckets.size >= MAX_KEYS) {
      const first = buckets.keys().next().value;
      if (first !== undefined) buckets.delete(first);
    }
    b = { tokens: CAPACITY, updatedAt: now };
    buckets.set(key, b);
  } else {
    const elapsed = now - b.updatedAt;
    b.tokens = Math.min(CAPACITY, b.tokens + elapsed * REFILL_PER_MS);
    b.updatedAt = now;
  }
  if (b.tokens < 1) return false;
  b.tokens -= 1;
  return true;
};
