import { useEffect, useState, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Stats {
  days: number;
  totals: { events?: number; pageviews?: number; clicks?: number; visitors?: number; sessions?: number };
  windows: {
    sessions_24h?: number; sessions_7d?: number; sessions_30d?: number;
    visitors_24h?: number; visitors_7d?: number; visitors_30d?: number;
  };
  daily: Array<{ day: string; pageviews: number; visitors: number }>;
  countries: Array<{ country: string; visitors: number }>;
  devices: Array<{ device: string; visitors: number }>;
  oses: Array<{ os: string; visitors: number }>;
  browsers: Array<{ browser: string; visitors: number }>;
  topEvents: Array<{ kind: string; target: string; label: string | null; hits: number }>;
  sessionLength: { avg_ms?: number | null; max_ms?: number | null };
  referrers: Array<{ referrer: string; hits: number }>;
}

const countryFlag = (cc: string): string => {
  if (!cc || cc.length !== 2 || !/^[A-Za-z]{2}$/.test(cc)) return "";
  const A = 0x1f1e6;
  const base = "A".charCodeAt(0);
  const u = cc.toUpperCase();
  return String.fromCodePoint(A + (u.charCodeAt(0) - base), A + (u.charCodeAt(1) - base));
};

const fmtNum = (n: unknown) => (typeof n === "number" ? n.toLocaleString() : Number(n ?? 0).toLocaleString());
const fmtMs = (ms: unknown) => {
  const n = Number(ms ?? 0);
  if (!n || Number.isNaN(n)) return "—";
  if (n < 60_000) return `${Math.round(n / 1000)}s`;
  return `${Math.round(n / 60000)}m ${Math.round((n % 60000) / 1000)}s`;
};

const Card = ({ title, value, sub }: { title: string; value: string; sub?: string }) => (
  <div className="bg-white border border-black rounded-sm p-4">
    <div className="font-vercetti text-[10px] tracking-widest uppercase text-black/50">{title}</div>
    <div className="font-soria text-3xl mt-1 text-black">{value}</div>
    {sub && <div className="font-vercetti text-[10px] text-black/50 mt-1">{sub}</div>}
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-black rounded-sm p-4">
    <div className="font-vercetti text-xs tracking-widest uppercase text-black mb-3">{title}</div>
    {children}
  </div>
);

const DevkitPage = () => {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsErr, setStatsErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Devkit — Magdy Saber";
    document.body.style.background = "#f3f4f6";
    fetch("/api/devkit/session", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d: { authed: boolean }) => setAuthed(!!d.authed))
      .catch(() => setAuthed(false));
    return () => {
      document.body.style.background = "";
    };
  }, []);

  const loadStats = useCallback(async (d: number) => {
    setLoading(true);
    setStatsErr(null);
    try {
      const r = await fetch(`/api/devkit/stats?days=${d}`, { credentials: "same-origin" });
      if (r.status === 401) { setAuthed(false); return; }
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { error?: string };
        setStatsErr(j.error ?? `HTTP ${r.status}`);
        return;
      }
      setStats((await r.json()) as Stats);
    } catch (err) {
      setStatsErr(err instanceof Error ? err.message : "failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) void loadStats(days);
  }, [authed, days, loadStats]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginErr(null);
    try {
      const r = await fetch("/api/devkit/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });
      if (r.ok) { setAuthed(true); setPassword(""); }
      else { setLoginErr("Invalid password"); }
    } catch {
      setLoginErr("Network error");
    } finally {
      setLoggingIn(false);
    }
  };

  const onLogout = async () => {
    await fetch("/api/devkit/logout", { method: "POST", credentials: "same-origin" });
    setAuthed(false);
    setStats(null);
  };

  if (authed === null) {
    return <div className="min-h-screen flex items-center justify-center font-vercetti text-black/60">Loading…</div>;
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={onLogin} className="w-full max-w-sm bg-white border border-black rounded-sm p-6 space-y-4">
          <h1 className="font-soria text-3xl text-black">Devkit</h1>
          <p className="font-vercetti text-xs text-black/60">Owner-only analytics. Enter password to continue.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full border border-black/40 px-3 py-2 font-vercetti text-sm focus:outline-none focus:border-black"
          />
          {loginErr && <div className="font-vercetti text-xs text-red-600">{loginErr}</div>}
          <button
            type="submit"
            disabled={loggingIn || !password}
            className="w-full bg-black text-white font-vercetti text-xs tracking-widest uppercase py-2 disabled:opacity-50"
          >
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  const t = stats?.totals ?? {};
  const w = stats?.windows ?? {};

  const downloadCsv = () => {
    window.location.href = `/api/devkit/export.csv?days=${days}`;
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-soria text-4xl text-black">Devkit</h1>
          <p className="font-vercetti text-xs text-black/60 mt-1">Portfolio analytics — last {days} days</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border border-black px-3 py-2 font-vercetti text-xs bg-white"
          >
            <option value={1}>24 hours</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
          <button
            onClick={() => loadStats(days)}
            className="border border-black px-3 py-2 font-vercetti text-xs uppercase tracking-widest hover:bg-black hover:text-white transition"
          >
            Refresh
          </button>
          <button
            onClick={downloadCsv}
            className="border border-black px-3 py-2 font-vercetti text-xs uppercase tracking-widest hover:bg-black hover:text-white transition"
          >
            Download CSV
          </button>
          <button
            onClick={onLogout}
            className="border border-black px-3 py-2 font-vercetti text-xs uppercase tracking-widest hover:bg-black hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </header>

      {statsErr && (
        <div className="border border-red-600 bg-red-50 text-red-800 px-4 py-3 mb-4 font-vercetti text-xs">
          {statsErr}
        </div>
      )}

      {loading && !stats && <div className="font-vercetti text-black/60">Loading…</div>}

      {stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <Card title="Today" value={fmtNum(w.sessions_24h)} sub={`${fmtNum(w.visitors_24h)} unique`} />
            <Card title="Last 7 days" value={fmtNum(w.sessions_7d)} sub={`${fmtNum(w.visitors_7d)} unique`} />
            <Card title="Last 30 days" value={fmtNum(w.sessions_30d)} sub={`${fmtNum(w.visitors_30d)} unique`} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card title={`Visitors (${days}d)`} value={fmtNum(t.visitors)} />
            <Card title="Pageviews" value={fmtNum(t.pageviews)} />
            <Card title="Clicks" value={fmtNum(t.clicks)} />
            <Card title="Avg session" value={fmtMs(stats.sessionLength.avg_ms)} sub={`max ${fmtMs(stats.sessionLength.max_ms)}`} />
          </div>

          <Section title="Daily">
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={stats.daily} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="pageviews" stroke="#000" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="visitors" stroke="#888" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Top countries">
              <table className="w-full font-vercetti text-sm">
                <thead>
                  <tr className="border-b border-black/20 text-left text-[10px] uppercase tracking-widest text-black/50">
                    <th className="py-2">Country</th>
                    <th className="py-2 text-right">Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.countries.length === 0 && (
                    <tr><td colSpan={2} className="py-3 text-black/50">No data.</td></tr>
                  )}
                  {stats.countries.map((c) => (
                    <tr key={c.country} className="border-b border-black/10">
                      <td className="py-2">
                        <span className="mr-2 text-base">{countryFlag(c.country) || "🏳"}</span>
                        {c.country}
                      </td>
                      <td className="py-2 text-right">{fmtNum(c.visitors)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            <Section title="Devices · OS · Browser">
              <div className="grid grid-cols-3 gap-2 text-xs font-vercetti">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-black/50 mb-1">Device</div>
                  {stats.devices.map((d) => (
                    <div key={d.device} className="flex justify-between border-b border-black/10 py-1">
                      <span className="capitalize">{d.device}</span><span>{fmtNum(d.visitors)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-black/50 mb-1">OS</div>
                  {stats.oses.map((o) => (
                    <div key={o.os} className="flex justify-between border-b border-black/10 py-1">
                      <span className="truncate mr-1">{o.os}</span><span>{fmtNum(o.visitors)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-black/50 mb-1">Browser</div>
                  {stats.browsers.map((b) => (
                    <div key={b.browser} className="flex justify-between border-b border-black/10 py-1">
                      <span className="truncate mr-1">{b.browser}</span><span>{fmtNum(b.visitors)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>

          <Section title="Top events">
            <table className="w-full font-vercetti text-sm">
              <thead>
                <tr className="border-b border-black/20 text-left text-[10px] uppercase tracking-widest text-black/50">
                  <th className="py-2">Kind</th>
                  <th className="py-2">Target</th>
                  <th className="py-2">Label</th>
                  <th className="py-2 text-right">Hits</th>
                </tr>
              </thead>
              <tbody>
                {stats.topEvents.length === 0 && (
                  <tr><td colSpan={4} className="py-3 text-black/50">No events tracked yet.</td></tr>
                )}
                {stats.topEvents.map((e, i) => (
                  <tr key={i} className="border-b border-black/10">
                    <td className="py-2 text-black/60">{e.kind}</td>
                    <td className="py-2">{e.target}</td>
                    <td className="py-2 text-black/60">{e.label ?? "—"}</td>
                    <td className="py-2 text-right">{fmtNum(e.hits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Top referrers">
            <table className="w-full font-vercetti text-sm">
              <thead>
                <tr className="border-b border-black/20 text-left text-[10px] uppercase tracking-widest text-black/50">
                  <th className="py-2">Referrer</th>
                  <th className="py-2 text-right">Hits</th>
                </tr>
              </thead>
              <tbody>
                {stats.referrers.length === 0 && (
                  <tr><td colSpan={2} className="py-3 text-black/50">No external referrers.</td></tr>
                )}
                {stats.referrers.map((r, i) => (
                  <tr key={i} className="border-b border-black/10">
                    <td className="py-2 truncate max-w-md">{r.referrer}</td>
                    <td className="py-2 text-right">{fmtNum(r.hits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>
      )}
    </div>
  );
};

export default DevkitPage;
