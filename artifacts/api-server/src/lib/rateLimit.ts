interface Bucket { tokens: number; updatedAt: number }

const MAX_KEYS = 5_000;

const make = (capacity: number, refillPerMs: number) => {
  const map = new Map<string, Bucket>();
  return (key: string): boolean => {
    const now = Date.now();
    let b = map.get(key);
    if (!b) {
      if (map.size >= MAX_KEYS) {
        const first = map.keys().next().value;
        if (first !== undefined) map.delete(first);
      }
      b = { tokens: capacity, updatedAt: now };
      map.set(key, b);
    } else {
      const elapsed = now - b.updatedAt;
      b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerMs);
      b.updatedAt = now;
    }
    if (b.tokens < 1) return false;
    b.tokens -= 1;
    return true;
  };
};

// Events: 60 per minute per IP.
const eventsBucket = make(60, 60 / 60_000);
// Login: 10 attempts per 5 minutes per IP.
const loginBucket = make(10, 10 / (5 * 60_000));

export const allow = (key: string): boolean => eventsBucket(key);
export const allowLogin = (key: string): boolean => loginBucket(key);
