const STORAGE_KEY_VISITOR = "ms_visitor_id";
const STORAGE_KEY_SESSION = "ms_session_id";
const STORAGE_KEY_SESSION_START = "ms_session_start";
const SESSION_IDLE_MS = 30 * 60 * 1000;

const isBrowser = typeof window !== "undefined";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const apiUrl = (path: string) => `${API_BASE}${path}`;

// ── Returning visitor: snapshot BEFORE we might create the key ────────────────
const _isReturning: boolean = isBrowser ? !!localStorage.getItem(STORAGE_KEY_VISITOR) : false;

const safeUUID = (): string => {
  if (isBrowser && "crypto" in window && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getOrCreate = (key: string, store: Storage): string => {
  let v = store.getItem(key);
  if (!v) {
    v = safeUUID();
    store.setItem(key, v);
  }
  return v;
};

const isDoNotTrack = (): boolean => {
  if (!isBrowser) return true;
  const dnt = navigator.doNotTrack ?? (window as Window & { doNotTrack?: string }).doNotTrack;
  return dnt === "1" || dnt === "yes";
};

const isDevkitPath = (): boolean => isBrowser && window.location.pathname.startsWith("/devkit");

const getVisitorId = (): string => getOrCreate(STORAGE_KEY_VISITOR, localStorage);

const getSessionId = (): string => {
  const startStr = sessionStorage.getItem(STORAGE_KEY_SESSION_START);
  const start = startStr ? Number(startStr) : 0;
  let id = sessionStorage.getItem(STORAGE_KEY_SESSION);
  if (!id || !start || Date.now() - start > SESSION_IDLE_MS) {
    id = safeUUID();
    sessionStorage.setItem(STORAGE_KEY_SESSION, id);
    sessionStorage.setItem(STORAGE_KEY_SESSION_START, String(Date.now()));
  }
  return id;
};

const sessionStart = (): number => {
  const s = sessionStorage.getItem(STORAGE_KEY_SESSION_START);
  return s ? Number(s) : Date.now();
};

// ── UTM helpers ───────────────────────────────────────────────────────────────
const _utmCache: { source?: string; medium?: string; campaign?: string } = {};
const readUTM = () => {
  if (!isBrowser) return _utmCache;
  const sp = new URLSearchParams(window.location.search);
  const source = sp.get("utm_source") ?? undefined;
  const medium = sp.get("utm_medium") ?? undefined;
  const campaign = sp.get("utm_campaign") ?? undefined;
  if (source) _utmCache.source = source;
  if (medium) _utmCache.medium = medium;
  if (campaign) _utmCache.campaign = campaign;
  return _utmCache;
};

// ── Core event types ──────────────────────────────────────────────────────────
interface EventInput {
  kind: "pageview" | "click" | "session_end" | "theme_change" | "portal_open" | "portal_close" | "perf";
  target?: string;
  label?: string;
  durationMs?: number;
}

const buildPayload = (e: EventInput): Record<string, unknown> => {
  const utm = _utmCache;
  return {
    kind: e.kind,
    target: e.target,
    label: e.label,
    durationMs: e.durationMs,
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    isReturning: _isReturning,
    utmSource: utm.source,
    utmMedium: utm.medium,
    utmCampaign: utm.campaign,
  };
};

const send = (payload: Record<string, unknown>, useBeacon = false) => {
  if (!isBrowser) return;
  const url = apiUrl("/api/devkit/events");
  const body = JSON.stringify(payload);
  try {
    if (useBeacon && "sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "include",
    }).catch(() => undefined);
  } catch {
    // ignore
  }
};

export const track = (e: EventInput) => {
  if (!isBrowser || isDoNotTrack() || isDevkitPath()) return;
  send(buildPayload(e), e.kind === "session_end");
};

// ── Performance tracking — single perf event with JSON label ─────────────────
// Spec: one 'perf' event per pageview with label = JSON.stringify({load_ms, fcp_ms})
const trackPerf = () => {
  if (!isBrowser || isDoNotTrack() || isDevkitPath()) return;

  let loadMs: number | null = null;
  let fcpMs: number | null = null;
  let sent = false;

  const trySend = () => {
    if (sent || (loadMs === null && fcpMs === null)) return;
    sent = true;
    const label = JSON.stringify({
      ...(loadMs != null ? { load_ms: Math.round(loadMs) } : {}),
      ...(fcpMs != null ? { fcp_ms: Math.round(fcpMs) } : {}),
    });
    send(buildPayload({ kind: "perf", label }));
  };

  // FCP via PerformanceObserver (usually fires before load event)
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          fcpMs = entry.startTime;
          observer.disconnect();
          break;
        }
      }
    });
    observer.observe({ type: "paint", buffered: true });
  } catch { /* unsupported browser */ }

  // Navigation timing for total load time
  const readNav = () => {
    try {
      const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      const nav = entries[0];
      if (nav && nav.loadEventEnd > 0) {
        loadMs = nav.loadEventEnd;
      }
    } catch { /* unsupported */ }
  };

  // After page load: read nav timing, then send combined event
  const onLoaded = () => {
    readNav();
    // Small delay so FCP observer has time to fire
    setTimeout(trySend, 200);
  };

  if (document.readyState === "complete") {
    onLoaded();
  } else {
    window.addEventListener("load", onLoaded, { once: true });
    // Safety net: send whatever we have after 15s
    setTimeout(trySend, 15_000);
  }
};

let installed = false;
export const installTracker = () => {
  if (!isBrowser || installed) return;
  if (isDoNotTrack() || isDevkitPath()) return;
  installed = true;

  // UTM: read on first load so they're cached before first track() call
  readUTM();

  // Initial pageview
  track({ kind: "pageview" });

  // Single combined performance event after page fully loads
  trackPerf();

  // session_end on hide/unload (single-flight per page lifecycle)
  let endFlushed = false;
  const flushEnd = () => {
    if (endFlushed) return;
    endFlushed = true;
    track({ kind: "session_end", durationMs: Date.now() - sessionStart() });
  };
  window.addEventListener("pagehide", flushEnd);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushEnd();
  });
};
