"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const INQUIRY_TYPES = [
  "Advisory & Consulting",
  "Research Access",
  "Partnership",
  "Media & Press",
  "Other",
];

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [activeType, setActiveType] = useState<string | null>(null);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-bg-base">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 70% 50%, rgba(168,216,50,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-12">
        <Link
          href="/"
          className="font-heading text-[15px] font-bold tracking-[0.2em] text-text-primary uppercase"
        >
          Claro Connects
        </Link>
        <Link
          href="/"
          className="group flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L3 12m0 0l4-5M3 12h18" />
          </svg>
          Back
        </Link>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 md:px-12">
        <div className="grid w-full gap-16 py-12 md:grid-cols-2 md:gap-20">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
              Contact
            </p>
            <h1 className="font-heading mt-4 text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
              Let&apos;s talk<br />infrastructure.
            </h1>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-text-secondary">
              Interested in autonomous infrastructure? We&apos;d love to
              connect.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-bg-surface">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                hello@claroconnects.com
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-bg-surface">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                San Francisco, CA
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-black/5 bg-white p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/15">
                  <svg className="h-6 w-6 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-heading mt-5 text-xl font-semibold text-text-primary">
                  Message received.
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  We&apos;ll be in touch shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="flex flex-col gap-5 rounded-2xl border border-black/5 bg-white p-8 shadow-sm md:p-10"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-secondary">
                      Name
                    </span>
                    <input
                      required
                      type="text"
                      className="rounded-lg border border-black/8 bg-bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/20"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-secondary">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      className="rounded-lg border border-black/8 bg-bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/20"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-secondary">
                    Inquiry Type
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {INQUIRY_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setActiveType(type)}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                          activeType === type
                            ? "border-accent-green/40 bg-accent-green/10 text-text-primary"
                            : "border-black/8 bg-bg-base text-text-secondary hover:border-black/15 hover:text-text-primary"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-secondary">
                    Message
                  </span>
                  <textarea
                    required
                    rows={4}
                    className="resize-none rounded-lg border border-black/8 bg-bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/20"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-text-primary px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-text-primary/85 active:scale-[0.98]"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-6 md:px-12">
        <p className="text-[11px] text-text-secondary/50">
          &copy; {new Date().getFullYear()} Claro Connects
        </p>
      </footer>
    </div>
  );
}
