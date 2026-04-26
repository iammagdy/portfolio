import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "@stores";
import { X } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const initialState: FormState = { name: "", email: "", message: "" };

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const ContactForm = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const color = useThemeStore((state) => state.theme.color);
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(focusTimer);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setForm(initialState);
        setStatus("idle");
        setErrorMessage("");
      }, 200);
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="relative z-10 w-full h-full sm:h-auto sm:max-w-lg sm:rounded-xl sm:mx-4 bg-[#0f1115] text-white shadow-2xl border border-white/10 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close contact form"
          className="absolute top-3 right-3 p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition"
        >
          <X size={20} />
        </button>

        <div className="px-6 py-8 sm:p-8">
          <h2
            id="contact-title"
            className="text-2xl sm:text-3xl tracking-wide"
            style={{
              fontFamily: "Soria, Georgia, serif",
              color,
            }}
          >
            Contact me
          </h2>
          <p
            className="mt-2 text-sm text-white/60"
            style={{ fontFamily: "Vercetti, Arial, sans-serif" }}
          >
            Got a project, opportunity, or just want to say hi? Send me a note.
          </p>

          {status === "success" ? (
            <div className="mt-8 text-center py-10">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                style={{ backgroundColor: color }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3
                className="text-xl mb-2"
                style={{ fontFamily: "Soria, Georgia, serif" }}
              >
                Message sent!
              </h3>
              <p
                className="text-white/60 text-sm"
                style={{ fontFamily: "Vercetti, Arial, sans-serif" }}
              >
                Thanks for reaching out. I'll get back to you soon.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-6 py-2 rounded-md border border-white/20 hover:bg-white/10 transition text-sm tracking-wider"
                style={{ fontFamily: "Vercetti, Arial, sans-serif" }}
              >
                CLOSE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs uppercase tracking-widest text-white/60 mb-1.5"
                  style={{ fontFamily: "Vercetti, Arial, sans-serif" }}
                >
                  Name
                </label>
                <input
                  ref={firstFieldRef}
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition text-sm"
                  placeholder="Your name"
                  style={{ fontFamily: "Vercetti, Arial, sans-serif" }}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs uppercase tracking-widest text-white/60 mb-1.5"
                  style={{ fontFamily: "Vercetti, Arial, sans-serif" }}
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition text-sm"
                  placeholder="you@example.com"
                  style={{ fontFamily: "Vercetti, Arial, sans-serif" }}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs uppercase tracking-widest text-white/60 mb-1.5"
                  style={{ fontFamily: "Vercetti, Arial, sans-serif" }}
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition resize-none text-sm"
                  placeholder="Tell me a bit about what you're working on…"
                  style={{ fontFamily: "Vercetti, Arial, sans-serif" }}
                />
              </div>

              {status === "error" && errorMessage && (
                <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-3 rounded-md font-medium tracking-widest uppercase text-sm transition disabled:opacity-60 disabled:cursor-not-allowed text-white"
                style={{
                  backgroundColor: color,
                  fontFamily: "Vercetti, Arial, sans-serif",
                }}
              >
                {status === "submitting" ? "SENDING…" : "SEND MESSAGE"}
              </button>

              <p
                className="text-xs text-white/40 text-center pt-1"
                style={{ fontFamily: "Vercetti, Arial, sans-serif" }}
              >
                Or email directly at{" "}
                <a
                  href="mailto:contact@magdysaber.com"
                  className="underline hover:text-white/70"
                >
                  contact@magdysaber.com
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
