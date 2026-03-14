"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(245, 245, 245, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
        <a
          href="#"
          className="font-heading text-[15px] font-bold tracking-[0.2em] text-text-primary uppercase"
        >
          Claro Connects
        </a>

        <div className="flex items-center gap-8">
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
              Infrastructure Research
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5l5 5 5-5" />
              </svg>
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-green transition-all duration-300 group-hover:w-full group-open:w-full" />
            </summary>
            <div className="absolute right-0 top-full mt-3 min-w-[240px] rounded-xl border border-black/5 bg-white p-2 shadow-xl shadow-black/10">
              <a
                href="#research-robotaxi"
                className="block rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-base hover:text-text-primary"
              >
                RoboTaxi Infrastructure
              </a>
              <a
                href="#research-freight"
                className="block rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-base hover:text-text-primary"
              >
                Freight Infrastructure
              </a>
            </div>
          </details>

          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
