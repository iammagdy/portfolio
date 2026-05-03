const STORAGE_KEY_VISITOR = "ms_visitor_id";
const STORAGE_KEY_SESSION = "ms_session_id";
const STORAGE_KEY_SESSION_START = "ms_session_start";
const SESSION_IDLE_MS = 30 * 60 * 1000;

const isBrowser = typeof window !== "undefined";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const apiUrl = (path: string) => `${API_BASE}${path}`;

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

interface EventInput {
  kind: "pageview" | "click" | "session_end" | "theme_change" | "portal_open" | "portal_close";
  target?: string;
  label?: string;
  durationMs?: number;
}

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
  const payload = {
    kind: e.kind,
    target: e.target,
    label: e.label,
    durationMs: e.durationMs,
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
  };
  send(payload, e.kind === "session_end");
};

let installed = false;
export const installTracker = () => {
  if (!isBrowser || installed) return;
  if (isDoNotTrack() || isDevkitPath()) return;
  installed = true;

  // initial pageview
  track({ kind: "pageview" });

  // session_end on hide/unload (single-flight per page lifecycle).
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
