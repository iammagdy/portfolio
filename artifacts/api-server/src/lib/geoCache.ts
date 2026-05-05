const CACHE_MAX = 500;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface Entry { country: string | null; expires: number }

const cache = new Map<string, Entry>();

export const getCountry = async (ip: string | null): Promise<string | null> => {
  // RFC1918 private ranges: 10/8, 192.168/16, 172.16/12 (172.16-172.31).
  const m172 = ip ? /^172\.(\d+)\./.exec(ip) : null;
  const isPrivate172 = m172 ? (() => { const o = Number(m172[1]); return o >= 16 && o <= 31; })() : false;
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("10.") || ip.startsWith("192.168.") || isPrivate172) {
    return null;
  }
  // True LRU: re-insert on read so most-recently-used entries stay; evict oldest at capacity.
  const cached = cache.get(ip);
  if (cached && cached.expires > Date.now()) {
    cache.delete(ip);
    cache.set(ip, cached);
    return cached.country;
  }

  const setLru = (entry: Entry) => {
    cache.delete(ip);
    if (cache.size >= CACHE_MAX) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) cache.delete(firstKey);
    }
    cache.set(ip, entry);
  };

  const tryFetch = async (url: string, timeoutMs: number): Promise<string | null> => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const resp = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!resp.ok) return null;
      const text = (await resp.text()).trim().toUpperCase();
      return /^[A-Z]{2}$/.test(text) ? text : null;
    } catch {
      clearTimeout(timer);
      return null;
    }
  };

  try {
    // Primary: ipapi.co — 3 s timeout (was 200 ms, too short for production)
    let country = await tryFetch(`https://ipapi.co/${encodeURIComponent(ip)}/country/`, 3_000);

    // Fallback: ip-api.com (free, no key required)
    if (country === null) {
      const raw = await tryFetch(`http://ip-api.com/line/${encodeURIComponent(ip)}?fields=countryCode`, 3_000);
      if (raw && /^[A-Z]{2}$/.test(raw)) country = raw;
    }

    setLru({ country, expires: Date.now() + (country ? CACHE_TTL_MS : 60_000) });
    return country;
  } catch {
    setLru({ country: null, expires: Date.now() + 60_000 });
    return null;
  }
};

// Read the real client IP. Express's `trust proxy` setting makes req.ip
// resolve through X-Forwarded-For when behind a reverse proxy.
export const getClientIp = (req: {
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
  socket: { remoteAddress?: string | null };
}): string | null => {
  if (typeof req.ip === "string" && req.ip.length > 0) return req.ip;
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) return xf.split(",")[0]!.trim();
  return req.socket.remoteAddress ?? null;
};
