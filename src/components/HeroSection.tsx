"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";

const SpatialGrid = dynamic(() => import("./SpatialGrid"), { ssr: false });

const EVAL_FACTORS = [
  { label: "Electrical Infrastructure", target: 0.88 },
  { label: "Highway Proximity", target: 0.72 },
  { label: "Deployment Timeline", target: 0.64 },
  { label: "Fleet Demand Density", target: 0.91 },
];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function easedRange(progress: number, start: number, end: number) {
  const t = clamp((progress - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const candidateScreenRef = useRef({ x: 0, y: 0 });

  const [connectorLine, setConnectorLine] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  scrollYProgress.on("change", (v) => {
    scrollProgressRef.current = v;
  });

  const updateConnector = useCallback(() => {
    const card = cardRef.current;
    const sticky = stickyRef.current;
    if (!card || !sticky) return;

    const stickyRect = sticky.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const siteX = candidateScreenRef.current.x;
    const siteY = candidateScreenRef.current.y;

    const cardAnchorX = cardRect.left - stickyRect.left;
    const cardAnchorY = cardRect.top - stickyRect.top + cardRect.height * 0.3;

    setConnectorLine({ x1: siteX, y1: siteY, x2: cardAnchorX, y2: cardAnchorY });
  }, []);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      updateConnector();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [updateConnector]);

  const textY = useTransform(scrollYProgress, [0, 0.35], [0, -220]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const valleyOpacity = useTransform(scrollYProgress, [0.05, 0.7], [0, 0.18]);

  const cardOpacity = useTransform(scrollYProgress, (p) =>
    easedRange(p, 0.32, 0.96)
  );
  const cardY = useTransform(scrollYProgress, (p) => {
    const progress = easedRange(p, 0.32, 0.96);
    return 12 - progress * 12;
  });

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div ref={stickyRef} className="sticky top-0 flex h-screen w-full items-center justify-center overflow-visible bg-bg-base">
        <motion.div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            opacity: vignetteOpacity,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.12) 100%)",
          }}
        />
        <SpatialGrid scrollRef={scrollProgressRef} candidateScreenRef={candidateScreenRef} />

        <motion.div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            opacity: valleyOpacity,
            background:
              "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 25%, rgba(0,0,0,0.28) 100%)",
          }}
        />

        <motion.svg
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
          style={{ opacity: cardOpacity }}
        >
          <line
            x1={connectorLine.x1}
            y1={connectorLine.y1}
            x2={connectorLine.x2}
            y2={connectorLine.y2}
            stroke="#fb923c"
            strokeWidth="1"
            strokeDasharray="5 4"
            strokeOpacity="0.55"
          />
          <circle
            cx={connectorLine.x1}
            cy={connectorLine.y1}
            r="4"
            fill="#fb923c"
            fillOpacity="0.7"
          />
        </motion.svg>

        <motion.div
          ref={cardRef}
          className="pointer-events-none absolute -bottom-16 right-8 z-20 w-[320px] md:right-12"
          style={{ opacity: cardOpacity, y: cardY }}
        >
          <div className="rounded-[2px] border border-orange-400/50 bg-white/90 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-orange-400/25 px-5 py-3">
              <span
                className="inline-block h-2 w-2 rounded-full bg-orange-400"
                style={{ boxShadow: "0 0 6px #ff7a1a" }}
              />
              <span className="text-sm font-semibold text-text-primary">
                Candidate Site
              </span>
              <span className="ml-auto text-[11px] font-medium text-orange-500">
                Evaluating
              </span>
            </div>
            <div className="flex flex-col gap-3 px-5 py-4">
              {EVAL_FACTORS.map((factor, fi) => (
                <EvalBar
                  key={fi}
                  label={factor.label}
                  target={factor.target}
                  index={fi}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
            <DemandSparkline scrollYProgress={scrollYProgress} />
          </div>
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.h1
            className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Every autonomous fleet needs
            <br />
            a physical footprint.
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            We find the sites, corridors, and infrastructure plays before
            they&apos;re obvious.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mt-10"
          >
            <a
              href="#research"
              className="group inline-flex items-center gap-2 rounded-full border border-text-primary/15 bg-white/60 px-7 py-3.5 text-sm font-medium text-text-primary backdrop-blur-sm transition-all duration-300 hover:border-accent-green/40 hover:bg-white/80 hover:shadow-lg hover:shadow-accent-green/5"
            >
              Read Our Research
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: chevronOpacity }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            className="h-6 w-6 text-text-secondary/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

const SPARKLINE_POINTS = [
  [0, 28], [18, 24], [36, 26], [54, 18], [72, 20],
  [90, 14], [108, 16], [126, 10], [144, 12], [162, 6],
  [180, 8], [198, 4], [216, 2], [234, 5], [240, 3],
] as const;

const SPARKLINE_PATH = "M" + SPARKLINE_POINTS.map(([x, y]) => `${x},${y}`).join(" L");
const SPARKLINE_FILL_PATH =
  SPARKLINE_PATH + ` L240,40 L0,40 Z`;
const SPARKLINE_LENGTH = (() => {
  let len = 0;
  for (let i = 1; i < SPARKLINE_POINTS.length; i++) {
    const dx = SPARKLINE_POINTS[i][0] - SPARKLINE_POINTS[i - 1][0];
    const dy = SPARKLINE_POINTS[i][1] - SPARKLINE_POINTS[i - 1][1];
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.ceil(len);
})();

function DemandSparkline({
  scrollYProgress,
}: {
  scrollYProgress: { get: () => number };
}) {
  const dashOffset = useTransform(
    scrollYProgress as ReturnType<typeof useScroll>["scrollYProgress"],
    (p: number) => {
      const card = easedRange(p, 0.32, 0.96);
      const draw = clamp((card - 0.45) / 0.5, 0, 1);
      return SPARKLINE_LENGTH * (1 - draw);
    }
  );
  const fillOpacity = useTransform(
    scrollYProgress as ReturnType<typeof useScroll>["scrollYProgress"],
    (p: number) => {
      const card = easedRange(p, 0.32, 0.96);
      return clamp((card - 0.55) / 0.4, 0, 0.15);
    }
  );
  const demandText = useTransform(
    scrollYProgress as ReturnType<typeof useScroll>["scrollYProgress"],
    (p: number) => {
      const card = easedRange(p, 0.32, 0.96);
      const draw = clamp((card - 0.45) / 0.5, 0, 1);
      const value = Math.round(draw * 1240);
      return value.toLocaleString() + " / day";
    }
  );

  return (
    <div className="border-t border-orange-400/15 px-5 pb-4 pt-3">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[10px] text-[#6B6B6B]">Projected Fleet Demand</span>
        <motion.span className="text-[10px] font-semibold tabular-nums text-text-primary">
          {demandText}
        </motion.span>
      </div>
      <svg viewBox="0 0 240 40" className="h-[36px] w-full">
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={SPARKLINE_FILL_PATH}
          fill="url(#sparkFill)"
          style={{ opacity: fillOpacity }}
        />
        <motion.path
          d={SPARKLINE_PATH}
          fill="none"
          stroke="#fb923c"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={SPARKLINE_LENGTH}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
    </div>
  );
}

function EvalBar({
  label,
  target,
  index,
  scrollYProgress,
}: {
  label: string;
  target: number;
  index: number;
  scrollYProgress: { get: () => number };
}) {
  const stagger = index * 0.08;
  const width = useTransform(
    scrollYProgress as ReturnType<typeof useScroll>["scrollYProgress"],
    (p: number) => {
      const card = easedRange(p, 0.32, 0.96);
      const bar = clamp((card - 0.12 - stagger) / 0.65, 0, 1);
      return `${Math.round(bar * target * 100)}%`;
    }
  );
  const pctText = useTransform(
    scrollYProgress as ReturnType<typeof useScroll>["scrollYProgress"],
    (p: number) => {
      const card = easedRange(p, 0.32, 0.96);
      const bar = clamp((card - 0.12 - stagger) / 0.65, 0, 1);
      return `${Math.round(bar * target * 100)}%`;
    }
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-[#4a4a4a]">{label}</span>
        <motion.span className="text-xs font-semibold tabular-nums text-text-primary">
          {pctText}
        </motion.span>
      </div>
      <div className="h-[5px] w-full rounded-[1px] bg-[#e5e5e5]">
        <motion.div
          className="h-full rounded-[1px] bg-orange-400"
          style={{ width }}
        />
      </div>
    </div>
  );
}
