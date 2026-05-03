const CACHE_MAX = 500;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface Entry { country: string | null; expires: number }

const cache = new Map<string, Entry>();

export const getCountry = async (ip: string | null): Promise<string | null> => {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.")) {
    return null;
  }
  const cached = cache.get(ip);
  if (cached && cached.expires > Date.now()) return cached.country;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 250);
    const resp = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country/`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!resp.ok) {
      cache.set(ip, { country: null, expires: Date.now() + 60_000 });
      return null;
    }
    const text = (await resp.text()).trim().toUpperCase();
    const country = /^[A-Z]{2}$/.test(text) ? text : null;
    if (cache.size >= CACHE_MAX) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) cache.delete(firstKey);
    }
    cache.set(ip, { country, expires: Date.now() + CACHE_TTL_MS });
    return country;
  } catch {
    cache.set(ip, { country: null, expires: Date.now() + 60_000 });
    return null;
  }
};

export const getClientIp = (req: { headers: Record<string, string | string[] | undefined>; socket: { remoteAddress?: string | null } }): string | null => {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) {
    return xf.split(",")[0]!.trim();
  }
  return req.socket.remoteAddress ?? null;
};
