"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const TABS = [
  {
    label: "Site Evaluation",
    headline: "Scoring and ranking\nsubject properties.",
    description:
      "Understanding what makes a site work: power access, highway proximity, fleet demand, and the other variables that determine whether a location pencils out.",
  },
  {
    label: "Demand Forecasting",
    headline: "Projecting where fleet\ndemand will emerge.",
    description:
      "Our models forecast autonomous fleet demand across metro and freight corridors over 5–10 year horizons, so operators and investors can move ahead of the curve.",
  },
  {
    label: "Corridor Mapping",
    headline: "Charting freight and\nRoboTaxi corridors.",
    description:
      "We map the physical corridors connecting metro areas and freight networks, identifying the routes and staging points that will anchor autonomous operations.",
  },
  {
    label: "Regulatory Intelligence",
    headline: "Navigating zoning, permits,\nand AV policy.",
    description:
      "We track and analyze the regulatory landscape: zoning restrictions, permitting timelines, and emerging AV policy, so infrastructure decisions are never blindsided.",
  },
];

const CYCLE_MS = 4000;

export default function WhatWeDoSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % TABS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(advance, CYCLE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, advance]);

  const selectTab = (i: number) => {
    setActive(i);
    setPaused(true);
    setTimeout(() => setPaused(false), CYCLE_MS * 2);
  };

  return (
    <section id="about" className="bg-white py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <ScrollReveal>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary/40">
            What We Do
          </p>
          <nav className="flex items-center gap-8 border-b border-[#e5e5e5] pb-4 overflow-x-auto scrollbar-hide">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => selectTab(i)}
                className={`relative shrink-0 pb-1 text-base font-medium transition-colors duration-200 ${
                  i === active
                    ? "text-text-primary"
                    : "text-text-secondary/60 hover:text-text-secondary"
                }`}
              >
                {tab.label}
                {i === active && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-text-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}

            <div className="ml-auto shrink-0">
              <button
                onClick={() => setPaused((p) => !p)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e0e0e0] text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
                aria-label={paused ? "Resume auto-play" : "Pause auto-play"}
              >
                {paused ? (
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 2l10 6-10 6V2z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="3" y="2" width="3.5" height="12" rx="0.5" />
                    <rect x="9.5" y="2" width="3.5" height="12" rx="0.5" />
                  </svg>
                )}
              </button>
            </div>
          </nav>
        </ScrollReveal>

        <div className="mt-12 grid min-h-[420px] items-start gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col justify-center"
            >
              <h2 className="font-heading whitespace-pre-line text-2xl font-bold leading-snug tracking-tight text-text-primary md:text-[2rem]">
                {TABS[active].headline}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-text-secondary md:text-base">
                {TABS[active].description}
              </p>

              <ProgressBar
                key={`progress-${active}-${paused}`}
                duration={CYCLE_MS}
                paused={paused}
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-bg-base"
            >
              <TabVisual index={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ProgressBar({ duration, paused }: { duration: number; paused: boolean }) {
  return (
    <div className="mt-8 h-[2px] w-full max-w-[200px] overflow-hidden rounded-full bg-[#e5e5e5]">
      <motion.div
        className="h-full origin-left bg-text-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: paused ? undefined : 1 }}
        transition={paused ? undefined : { duration: duration / 1000, ease: "linear" }}
      />
    </div>
  );
}

function GridLines() {
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1="40" y1={50 + i * 40} x2="520" y2={50 + i * 40} stroke="#d4d4d4" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={40 + i * 40} y1="50" x2={40 + i * 40} y2="370" stroke="#d4d4d4" strokeWidth="0.5" />
      ))}
    </>
  );
}

function TabVisual({ index }: { index: number }) {
  const common = "absolute inset-0 flex items-center justify-center";

  if (index === 0) {
    return (
      <div className={common}>
        <svg viewBox="0 0 560 400" className="h-full w-full" fill="none">
          <GridLines />
          {[
            { cx: 180, cy: 140, score: 0.88, label: "SITE A  88%" },
            { cx: 340, cy: 180, score: 0.72, label: "SITE B  72%" },
            { cx: 260, cy: 280, score: 0.64, label: "SITE C  64%" },
            { cx: 430, cy: 120, score: 0.91, label: "SITE D  91%" },
          ].map((s, i) => (
            <g key={i}>
              <circle cx={s.cx} cy={s.cy} r="28" stroke="#a8d832" strokeWidth="1" strokeOpacity="0.15" />
              <circle cx={s.cx} cy={s.cy} r="28" stroke="#a8d832" strokeWidth="2.5" strokeOpacity="0.5" strokeDasharray={`${s.score * 176} 176`} strokeLinecap="round" transform={`rotate(-90 ${s.cx} ${s.cy})`} />
              <circle cx={s.cx} cy={s.cy} r="5" fill="#a8d832" fillOpacity="0.4" stroke="#a8d832" strokeWidth="1.2" />
              <text x={s.cx + 34} y={s.cy + 4} fontSize="9" fill="#6B6B6B" fontFamily="monospace">{s.label}</text>
            </g>
          ))}
          <rect x="80" y="338" width="100" height="6" rx="1" fill="#e5e5e5" />
          <rect x="80" y="338" width="88" height="6" rx="1" fill="#a8d832" fillOpacity="0.5" />
          <text x="80" y="333" fontSize="8" fill="#9a9a9a" fontFamily="monospace">POWER AVAILABILITY</text>
          <rect x="210" y="338" width="100" height="6" rx="1" fill="#e5e5e5" />
          <rect x="210" y="338" width="72" height="6" rx="1" fill="#a8d832" fillOpacity="0.5" />
          <text x="210" y="333" fontSize="8" fill="#9a9a9a" fontFamily="monospace">HIGHWAY ACCESS</text>
          <rect x="340" y="338" width="100" height="6" rx="1" fill="#e5e5e5" />
          <rect x="340" y="338" width="91" height="6" rx="1" fill="#a8d832" fillOpacity="0.5" />
          <text x="340" y="333" fontSize="8" fill="#9a9a9a" fontFamily="monospace">FLEET DEMAND</text>
          <text x="80" y="373" fontSize="10" fill="#6B6B6B" fontFamily="monospace">EVALUATING 4 SUBJECT PROPERTIES</text>
        </svg>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className={common}>
        <svg viewBox="0 0 560 400" className="h-full w-full" fill="none">
          <GridLines />
          <path d="M80 300 Q140 290 180 260 T280 200 T380 130 T480 90" stroke="#fb923c" strokeWidth="2" strokeOpacity="0.6" />
          <path d="M80 300 Q140 290 180 260 T280 200 T380 130 T480 90 L480 370 L80 370 Z" fill="#fb923c" fillOpacity="0.06" />
          <path d="M80 310 Q140 300 180 275 T280 220 T380 155 T480 120" stroke="#fb923c" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="4 3" />
          <path d="M80 290 Q140 278 180 245 T280 180 T380 105 T480 60" stroke="#fb923c" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="4 3" />
          <line x1="280" y1="60" x2="280" y2="370" stroke="#fb923c" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="3 4" />
          <text x="284" y="72" fontSize="9" fill="#fb923c" fontFamily="monospace" fillOpacity="0.6">2028</text>
          <line x1="380" y1="60" x2="380" y2="370" stroke="#fb923c" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="3 4" />
          <text x="384" y="72" fontSize="9" fill="#fb923c" fontFamily="monospace" fillOpacity="0.6">2031</text>
          {[{x:120,y:288},{x:180,y:260},{x:230,y:230},{x:280,y:200},{x:330,y:165},{x:380,y:130},{x:440,y:100}].map((p,i)=>(
            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#fb923c" fillOpacity="0.5" stroke="#fb923c" strokeWidth="1" />
          ))}
          <text x="46" y="305" fontSize="8" fill="#9a9a9a" fontFamily="monospace" textAnchor="end">0</text>
          <text x="46" y="205" fontSize="8" fill="#9a9a9a" fontFamily="monospace" textAnchor="end">5K</text>
          <text x="46" y="105" fontSize="8" fill="#9a9a9a" fontFamily="monospace" textAnchor="end">10K</text>
          <text x="80" y="385" fontSize="10" fill="#6B6B6B" fontFamily="monospace">FLEET DEMAND PROJECTION — TRIPS / DAY</text>
        </svg>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className={common}>
        <svg viewBox="0 0 560 400" className="h-full w-full" fill="none">
          <GridLines />
          {[
            { cx: 100, cy: 160, r: 18, label: "PHX" },
            { cx: 280, cy: 100, r: 22, label: "DFW" },
            { cx: 460, cy: 150, r: 16, label: "ATL" },
            { cx: 180, cy: 300, r: 14, label: "ELP" },
            { cx: 400, cy: 310, r: 20, label: "HOU" },
          ].map((m, i) => (
            <g key={i}>
              <circle cx={m.cx} cy={m.cy} r={m.r} fill="#a8d832" fillOpacity="0.08" stroke="#a8d832" strokeWidth="1.2" strokeOpacity="0.3" />
              <circle cx={m.cx} cy={m.cy} r="4" fill="#a8d832" fillOpacity="0.4" stroke="#a8d832" strokeWidth="1" />
              <text x={m.cx} y={m.cy - m.r - 6} fontSize="8" fill="#9a9a9a" fontFamily="monospace" textAnchor="middle">{m.label}</text>
            </g>
          ))}
          <path d="M100 160 Q190 100 280 100" stroke="#a8d832" strokeWidth="2" strokeOpacity="0.35" />
          <path d="M280 100 Q370 90 460 150" stroke="#a8d832" strokeWidth="1.8" strokeOpacity="0.3" />
          <path d="M100 160 Q130 230 180 300" stroke="#a8d832" strokeWidth="1.5" strokeOpacity="0.25" />
          <path d="M460 150 Q440 230 400 310" stroke="#a8d832" strokeWidth="1.5" strokeOpacity="0.25" />
          <path d="M180 300 Q290 320 400 310" stroke="#a8d832" strokeWidth="2" strokeOpacity="0.35" />
          <path d="M280 100 Q240 200 180 300" stroke="#a8d832" strokeWidth="1.2" strokeOpacity="0.15" strokeDasharray="6 4" />
          <path d="M280 100 Q340 200 400 310" stroke="#a8d832" strokeWidth="1.2" strokeOpacity="0.15" strokeDasharray="6 4" />
          {[{x:190,y:118},{x:370,y:112},{x:130,y:230},{x:442,y:230},{x:290,y:314}].map((p,i)=>(
            <g key={i}>
              <rect x={p.x-4} y={p.y-4} width="8" height="8" rx="1" fill="#a8d832" fillOpacity="0.3" stroke="#a8d832" strokeWidth="0.8" />
            </g>
          ))}
          <text x="80" y="375" fontSize="10" fill="#6B6B6B" fontFamily="monospace">CORRIDOR NETWORK — 5 METROS, 7 ROUTES</text>
        </svg>
      </div>
    );
  }

  return (
    <div className={common}>
      <svg viewBox="0 0 560 400" className="h-full w-full" fill="none">
        <GridLines />
        <rect x="80" y="70" width="180" height="130" rx="4" fill="#8b5cf6" fillOpacity="0.06" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="6 4" />
        <rect x="300" y="90" width="180" height="140" rx="4" fill="#8b5cf6" fillOpacity="0.04" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="6 4" />
        <rect x="140" y="240" width="200" height="100" rx="4" fill="#8b5cf6" fillOpacity="0.05" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.22" strokeDasharray="6 4" />
        <text x="90" y="90" fontSize="9" fill="#8b5cf6" fontFamily="monospace" fillOpacity="0.7">JURISDICTION 01</text>
        <text x="310" y="110" fontSize="9" fill="#8b5cf6" fontFamily="monospace" fillOpacity="0.7">JURISDICTION 02</text>
        <text x="150" y="260" fontSize="9" fill="#8b5cf6" fontFamily="monospace" fillOpacity="0.7">JURISDICTION 03</text>
        {[
          { x: 130, y: 130, status: "APPROVED", color: "#a8d832" },
          { x: 130, y: 155, status: "AV TESTING OK", color: "#a8d832" },
          { x: 130, y: 180, status: "ZONING: COMMERCIAL", color: "#a8d832" },
          { x: 350, y: 145, status: "PENDING REVIEW", color: "#fb923c" },
          { x: 350, y: 170, status: "AV RESTRICTED", color: "#ef4444" },
          { x: 350, y: 195, status: "ZONING: TBD", color: "#fb923c" },
          { x: 200, y: 285, status: "APPROVED", color: "#a8d832" },
          { x: 200, y: 310, status: "PERMIT REQ", color: "#fb923c" },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={s.x - 8} cy={s.y - 3} r="3" fill={s.color} fillOpacity="0.6" />
            <text x={s.x} y={s.y} fontSize="9" fill="#6B6B6B" fontFamily="monospace">{s.status}</text>
          </g>
        ))}
        <text x="80" y="370" fontSize="10" fill="#6B6B6B" fontFamily="monospace">REGULATORY SCAN — 3 JURISDICTIONS</text>
        <text x="80" y="385" fontSize="10" fill="#6B6B6B" fontFamily="monospace">2 CLEARED / 1 PENDING</text>
      </svg>
    </div>
  );
}
