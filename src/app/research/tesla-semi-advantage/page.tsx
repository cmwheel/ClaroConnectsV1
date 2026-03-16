"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ResearchArticleByline,
  ResearchArticleHero,
  RelatedArticles,
} from "@/components/research/ResearchArticleShell";
import Chart from "chart.js/auto";

/* ─── palette mapped to site tokens ─── */
const C = {
  green: "#a8d832",
  greenDim: "rgba(168,216,50,0.15)",
  greenMid: "#93bf2e",
  dark: "#1A1A1A",
  body: "#6B6B6B",
  muted: "#9ca3af",
  surface: "#EBEBEB",
  base: "#F5F5F5",
  white: "#FFFFFF",
  grey1: "#888888",
  grey2: "#ADADAD",
  grey3: "#CCCCCC",
  diesel: "#666666",
};

/* ─── reusable chart wrapper with intersection-based animation ─── */
function AnimatedChart({
  id,
  build,
  height = "h-[360px]",
}: {
  id: string;
  build: (ctx: CanvasRenderingContext2D) => Chart;
  height?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const builtRef = useRef(false);

  const buildChart = useCallback(() => {
    if (builtRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    builtRef.current = true;
    chartRef.current = build(ctx);
  }, [build]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) buildChart();
      },
      { threshold: 0.25 }
    );
    obs.observe(canvas);
    return () => {
      obs.disconnect();
      chartRef.current?.destroy();
    };
  }, [buildChart]);

  return (
    <div className={`relative w-full ${height}`}>
      <canvas ref={canvasRef} id={id} />
    </div>
  );
}

/* ─── chart builder helpers (brand-consistent) ─── */
const chartDefaults = () => {
  Chart.defaults.color = C.body;
  Chart.defaults.borderColor = "rgba(0,0,0,0.05)";
  Chart.defaults.font.family = "var(--font-inter), Inter, system-ui, sans-serif";
  Chart.defaults.font.size = 12;
};

function buildRangeChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Tesla Semi LR",
        "Tesla Semi SR",
        "Nikola Tre BEV",
        "Volvo VNR Electric",
        "Freightliner eCascadia",
      ],
      datasets: [
        {
          label: "Range (miles)",
          data: [500, 325, 330, 275, 225],
          backgroundColor: [C.green, C.greenMid, C.grey1, C.grey2, C.grey3],
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          titleColor: C.white,
          bodyColor: C.white,
          cornerRadius: 6,
          padding: 10,
          callbacks: { label: (c) => `${c.raw} miles fully loaded` },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { callback: (v) => v + " mi", color: C.muted },
        },
        y: { grid: { display: false }, ticks: { color: C.dark, font: { weight: 500 } } },
      },
    },
  });
}

function buildEfficiencyChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Tesla Semi\n(best pilot)",
        "Tesla Semi\n(official)",
        "Nikola\nTre BEV",
        "Volvo VNR\nElectric",
        "Freightliner\neCascadia",
        "Diesel Truck\n(equivalent)",
      ],
      datasets: [
        {
          label: "kWh/mile",
          data: [1.55, 1.7, 2.0, 2.05, 2.2, 5.5],
          backgroundColor: [C.green, C.greenMid, C.grey1, C.grey2, C.grey3, C.diesel],
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => `${c.raw} kWh/mile` },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.04)" },
          ticks: { callback: (v) => Number(v).toFixed(1) + " kWh/mi", color: C.muted },
        },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { size: 11 } } },
      },
    },
  });
}

function buildMpdgeChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Tesla Semi (ZE)", "RNG Truck", "Diesel Truck"],
      datasets: [
        {
          label: "MPDGE",
          data: [19.6, 8.9, 8.2],
          backgroundColor: [C.green, C.grey1, C.diesel],
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => `${c.raw} miles per diesel gallon equivalent` },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => v + " MPDGE", color: C.muted },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { weight: 500 } } },
      },
    },
  });
}

function buildPilotChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "ArcBest\n(Donner Pass)",
        "Mone Transport\n(Texas)",
        "PepsiCo\n(California)",
        "DHL\n(Long-haul)",
        "Saia\n(LTL)",
        "RoadOne\n(Drayage)",
      ],
      datasets: [
        {
          label: "kWh/mile",
          data: [1.55, 1.64, 1.7, 1.72, 1.73, 1.9],
          backgroundColor: [C.green, C.green, C.green, C.green, C.green, C.greenMid],
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => `${c.raw} kWh/mi` },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 2.5,
          ticks: { callback: (v) => Number(v).toFixed(1) + " kWh/mi", color: C.muted },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { size: 11 } } },
      },
    },
  });
}

function buildPricingChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Tesla Semi\nSR (325 mi)",
        "Tesla Semi\nLR (500 mi)",
        "Nikola Tre\nBEV (330 mi)",
        "Industry Median\n(ICCT 2025)",
        "Industry Avg\n(CARB 2024)",
      ],
      datasets: [
        {
          label: "Price ($)",
          data: [260000, 290000, 389000, 411200, 435000],
          backgroundColor: [C.green, C.green, C.grey1, C.grey2, C.grey3],
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => "$" + Number(c.raw).toLocaleString() },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => "$" + Number(v) / 1000 + "k", color: C.muted },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { size: 11 } } },
      },
    },
  });
}

function buildTcoChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Purchase Price\n(after incentives)",
        "Fuel\n(8 years)",
        "Maintenance\n(8 years)",
        "Total TCO\n(8 years)",
      ],
      datasets: [
        {
          label: "Tesla Semi",
          data: [170000, 104000, 48000, 322000],
          backgroundColor: C.green,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          label: "Diesel Class 8",
          data: [150000, 464000, 96000, 710000],
          backgroundColor: C.diesel,
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: {
          position: "top",
          labels: { usePointStyle: true, pointStyle: "circle", padding: 16, color: C.dark },
        },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: {
            label: (c) => c.dataset.label + ": $" + Number(c.raw).toLocaleString(),
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => "$" + Number(v) / 1000 + "k", color: C.muted },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { size: 11 } } },
      },
    },
  });
}

function buildChargingChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Tesla Semi\n(Megacharger)",
        "Nikola Tre BEV\n(CCS)",
        "Volvo VNR\n(Dual CCS)",
        "Freightliner eCascadia\n(Dual CCS)",
      ],
      datasets: [
        {
          label: "Max Charging Power (kW)",
          data: [1200, 350, 270, 270],
          backgroundColor: [C.green, C.grey1, C.grey2, C.grey3],
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => `${Number(c.raw).toLocaleString()} kW peak` },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => Number(v).toLocaleString() + " kW", color: C.muted },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { size: 11 } } },
      },
    },
  });
}

function buildEmissionsChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["1 truck", "10 trucks", "25 trucks", "50 trucks", "100 trucks"],
      datasets: [
        {
          label: "Metric tons CO₂ reduced/year",
          data: [50, 500, 1250, 2500, 5000],
          backgroundColor: [C.greenMid, C.greenMid, C.green, C.green, C.green],
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: {
            label: (c) =>
              `${Number(c.raw).toLocaleString()} metric tons CO₂ reduced per year`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => Number(v).toLocaleString() + " t", color: C.muted },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { weight: 500 } } },
      },
    },
  });
}

/* ─── sub-components ─── */
function Ref({ n }: { n: number }) {
  return (
    <a
      href={`#ref${n}`}
      className="ml-0.5 text-[10px] font-bold text-accent-green align-super hover:underline"
    >
      [{n}]
    </a>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <ScrollReveal>
      <div className="my-10 overflow-hidden rounded-lg border border-black/5 bg-white">
        <div className="h-[2px] bg-gradient-to-r from-accent-green via-accent-green/60 to-accent-green" />
        <div className="p-6 md:p-8">
          <h3 className="font-heading text-[15px] font-bold tracking-tight text-text-primary md:text-base">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollReveal>
      <div className="my-8 rounded-r-md border-l-[3px] border-accent-green bg-accent-green-dim px-5 py-4">
        <p className="text-[15px] leading-relaxed text-text-primary">{children}</p>
      </div>
    </ScrollReveal>
  );
}

function Quote({
  text,
  attribution,
}: {
  text: string;
  attribution: React.ReactNode;
}) {
  return (
    <ScrollReveal>
      <blockquote className="my-8 rounded-r-md border-l-[3px] border-accent-green/50 bg-accent-green-dim/50 px-5 py-4">
        <p className="text-[15px] italic leading-relaxed text-text-primary">
          &ldquo;{text}&rdquo;
        </p>
        <cite className="mt-2 block text-xs font-normal not-italic text-text-secondary">
          {attribution}
        </cite>
      </blockquote>
    </ScrollReveal>
  );
}

function ImagePlaceholder({ caption, aspect = "aspect-[16/9]" }: { caption: string; aspect?: string }) {
  return (
    <ScrollReveal>
      <figure className="my-10">
        <div
          className={`${aspect} w-full overflow-hidden rounded-lg border border-black/5 bg-bg-surface`}
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 800 450"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width="800" height="450" fill="#EBEBEB" />
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 30}
                x2="800"
                y2={i * 30}
                stroke="#d8d8d8"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 28 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 30}
                y1="0"
                x2={i * 30}
                y2="450"
                stroke="#d8d8d8"
                strokeWidth="0.5"
              />
            ))}
            <circle cx="400" cy="200" r="40" fill="#a8d832" opacity="0.12" />
            <circle cx="400" cy="200" r="18" fill="#a8d832" opacity="0.25" />
            <path
              d="M392 194 L392 210 M392 210 L404 200 M392 210 L380 200"
              stroke="#a8d832"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
              strokeLinecap="round"
            />
            <text
              x="400"
              y="260"
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="13"
              fontFamily="Inter, system-ui, sans-serif"
            >
              Image Placeholder
            </text>
          </svg>
        </div>
        <figcaption className="mt-2 text-center text-xs text-text-secondary">
          {caption}
        </figcaption>
      </figure>
    </ScrollReveal>
  );
}

/* ─── spec card grid ─── */
function SpecCard({
  name,
  featured,
  specs,
}: {
  name: string;
  featured?: boolean;
  specs: { label: string; value: string }[];
}) {
  return (
    <div
      className={`rounded-lg border p-5 transition-all duration-300 hover:-translate-y-0.5 ${
        featured
          ? "border-accent-green/30 bg-gradient-to-br from-white to-accent-green-dim"
          : "border-black/5 bg-white hover:border-accent-green/15"
      }`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.08em] ${
          featured ? "text-accent-green" : "text-text-secondary"
        }`}
      >
        {name}
      </p>
      <div className="mt-3 flex flex-col">
        {specs.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between border-b border-black/5 py-2 text-[13px] last:border-none"
          >
            <span className="text-text-secondary">{s.label}</span>
            <span className="font-semibold text-text-primary">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── main page ─── */
export default function TeslaSemiArticle() {
  const [reportEmail, setReportEmail] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  return (
    <>
      <Navbar />
      <main className="bg-bg-base">
        <ResearchArticleHero
          title="The Tesla Semi Advantage"
          description="How Tesla's Class 8 electric truck is outperforming every competitor on range, efficiency, and total cost of ownership."
          imageSrc="/images/article1.jpg"
          imageAlt="Tesla Semi on the road"
          imageClassName="object-contain object-center"
        >
          <motion.div
            className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {[
              { val: "500 mi", label: "Long Range" },
              { val: "1.55–1.72", label: "kWh / mile in pilots" },
              { val: "3–4×", label: "Less energy vs diesel" },
              { val: "$290k", label: "Long Range price" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-heading text-lg font-bold tracking-tight text-accent-green md:text-xl">
                  {s.val}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </ResearchArticleHero>

        <ResearchArticleByline
          authorName="Charlie Wheeler"
          date="March 15, 2026"
          readTime="15 min read"
        />

        {/* ── article body ── */}
        <article className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-14 md:px-12 md:py-20">
          {/* Section 1 */}
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
              The Shift
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              500 Miles Changes Everything
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              The knock on electric semis has always been range. Fine for port
              drayage, maybe a regional loop. But real freight: 80,000 pounds,
              cross-state, get-it-there-by-morning. Nobody was buying it.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Then PepsiCo put 15 Tesla Semis on the same California routes as
              its diesel and natural gas trucks, and something interesting
              happened. One Semi ran{" "}
              <strong className="text-text-primary">
                320.4 miles across 15 trips in a single 8.4-hour shift,
                without plugging in once.
              </strong>
              <Ref n={1} /> That
              wasn&rsquo;t an outlier. There were 139 days in the dataset where
              a Semi covered more than 250 miles.<Ref n={1} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              In the NACFE Run on Less test, the best-performing Tesla Semi
              averaged{" "}
              <strong className="text-text-primary">574 miles in a single day</strong>
              . The Nikola Tre BEV managed 255. The Freightliner eCascadia, 181.
              The Volvo VNR Electric, 175.<Ref n={2} /> It wasn&rsquo;t close.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              That puts the range debate to rest. The question now is how far
              ahead the Tesla Semi actually is, and what that means for fleet
              economics.
            </p>
          </ScrollReveal>

          <hr className="my-12 border-black/5" />

          {/* Section 2 — Specs */}
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
              Head to Head
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              Tesla Semi vs. The Competition
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              Tesla finally locked in production specs in early 2026. Two
              variants: a{" "}
              <strong className="text-text-primary">
                Standard Range (325 miles)
              </strong>{" "}
              and a{" "}
              <strong className="text-text-primary">
                Long Range (500 miles)
              </strong>
              , both running a tri-motor, 1,072-horsepower drivetrain that charges
              at 1.2&nbsp;MW.<Ref n={3} /> On paper, that&rsquo;s a generation
              ahead of the competition. But let&rsquo;s look at the actual
              numbers.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-3 text-xs text-text-secondary">
              Note: Nikola restructured in 2025, but its BEV line remains in
              production and incentive-eligible.<Ref n={12} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="my-10 grid gap-4 md:grid-cols-2">
              <SpecCard
                name="Tesla Semi LR"
                featured
                specs={[
                  { label: "Range", value: "500 miles" },
                  { label: "Battery (est.)", value: "~900 kWh" },
                  { label: "Power", value: "1,072 hp" },
                  { label: "Efficiency", value: "1.7 kWh/mi" },
                  { label: "Charge to 60%", value: "30 min" },
                  { label: "Max Charge", value: "1.2 MW" },
                  { label: "Payload", value: "59,000 lbs" },
                  { label: "Price", value: "$290,000" },
                ]}
              />
              <SpecCard
                name="Nikola Tre BEV"
                specs={[
                  { label: "Range", value: "330 miles" },
                  { label: "Battery", value: "738 kWh" },
                  { label: "Power", value: "~645 hp" },
                  { label: "Efficiency", value: "~2.0 kWh/mi" },
                  { label: "Charge to 80%", value: "~90 min" },
                  { label: "Max Charge", value: "350 kW" },
                  { label: "Payload", value: "~55,000 lbs" },
                  { label: "Price", value: "~$389,000*" },
                ]}
              />
              <SpecCard
                name="Volvo VNR Electric"
                specs={[
                  { label: "Range", value: "275 miles" },
                  { label: "Battery", value: "565 kWh" },
                  { label: "Power", value: "~600 hp" },
                  { label: "Efficiency", value: "2.05 kWh/mi" },
                  { label: "Charge to 80%", value: "~90 min" },
                  { label: "Max Charge", value: "270 kW" },
                  { label: "Payload", value: "~52,000 lbs" },
                  { label: "Price", value: "Not disclosed*" },
                ]}
              />
              <SpecCard
                name="Freightliner eCascadia"
                specs={[
                  { label: "Range", value: "220–230 miles" },
                  { label: "Battery", value: "291–438 kWh" },
                  { label: "Power", value: "425–470 hp" },
                  { label: "Efficiency", value: "2.20 kWh/mi" },
                  { label: "Charge to 80%", value: "~90 min" },
                  { label: "Max Charge", value: "270 kW" },
                  { label: "Payload", value: "~54,000 lbs" },
                  { label: "Price", value: "Not disclosed*" },
                ]}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <p className="text-xs leading-relaxed text-text-secondary">
              Sources: Tesla.com (Feb 2026)<Ref n={3} />, Electrek<Ref n={9} />,
              Freightliner<Ref n={10} />, Nikola Motor<Ref n={8} />. Tesla
              pricing from confirmed customer quotes<Ref n={9} />. *Competitor
              gross pricing is not publicly disclosed by most OEMs; the ICCT 2025
              study found the median Class 8 BEV tractor price was $411,200.
              <Ref n={11} /> Nikola figure from current dealer listings.
              <Ref n={12} /> Heavy incentives (HVIP vouchers of $84k–$351k in
              California) can significantly reduce net cost for all trucks shown.
              <Ref n={9} />
            </p>
          </ScrollReveal>

          <ChartCard
            title="Range Comparison (miles, fully loaded at 82,000 lbs GCW)"
            subtitle="Tesla Semi Long Range offers double the range of the nearest affordable competitor"
          >
            <AnimatedChart id="rangeChart" build={buildRangeChart} />
          </ChartCard>

          <hr className="my-12 border-black/5" />

          {/* Section 3 — Efficiency */}
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
              The Efficiency Edge
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              Using 3–4× Less Energy Than Diesel
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              This is where the math breaks open. The Semi uses three to
              four times less energy than a diesel truck to move the same load the
              same distance.<Ref n={4} /> That&rsquo;s not a marginal improvement.
              That&rsquo;s a completely different cost structure.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The Frito-Lay deployment made it concrete. Running the same routes
              with the same loads, the Tesla Semi posted{" "}
              <strong className="text-text-primary">
                19.6 miles per diesel gallon equivalent (MPDGE)
              </strong>
              , 2.4 times more efficient than diesel and 2.2 times better than the
              natural gas trucks sitting right next to it in the fleet.
              <Ref n={1} /> And the efficiency kept improving as drivers learned
              the truck, trending from 1.6&nbsp;kWh/mile toward 1.4.
              <Ref n={1} />
            </p>
          </ScrollReveal>

          <ChartCard
            title="Energy Efficiency: kWh per Mile (Lower Is Better)"
            subtitle="Tesla Semi uses a fraction of the energy consumed by diesel and competing EVs"
          >
            <AnimatedChart id="efficiencyChart" build={buildEfficiencyChart} />
          </ChartCard>

          <Callout>
            <strong className="text-text-primary">
              What does 1.64&nbsp;kWh/mile actually mean?
            </strong>{" "}
            At average U.S. commercial electricity rates (~$0.08/kWh), that&rsquo;s
            about <strong className="text-text-primary">$0.13 per mile</strong>{" "}
            in fuel cost. A diesel truck at 6.5&nbsp;MPG paying $3.80/gallon
            spends{" "}
            <strong className="text-text-primary">$0.58 per mile</strong>. The
            Tesla Semi cuts fuel costs by about 78%.
          </Callout>

          <ChartCard
            title="Fuel Efficiency: Miles Per Diesel Gallon Equivalent (MPDGE)"
            subtitle={
              <>
                From the Frito-Lay pilot program: identical routes, same loads,
                measured side by side<Ref n={1} />
              </>
            }
          >
            <AnimatedChart id="mpdgeChart" build={buildMpdgeChart} />
          </ChartCard>

          <hr className="my-12 border-black/5" />

          {/* Section 4 — Pilot Data */}
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
              Real-World Data
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              What Fleet Operators Are Actually Seeing
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              Specs only tell part of the story. The real test is what
              happens when you hand the keys to fleet operators and let them haul
              actual freight. Six companies have now put the Semi through
              real-world routes, and the pattern is consistent.
            </p>
          </ScrollReveal>

          {/* Pilot table */}
          <ScrollReveal delay={0.08}>
            <div className="my-10 overflow-x-auto rounded-lg border border-black/5">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="bg-bg-surface">
                    {["Operator", "Region / Routes", "Miles", "Efficiency", "Key Detail"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      op: "ArcBest (ABF Freight)",
                      region: "Varied, incl. Donner Pass (7,200 ft)",
                      miles: "4,494",
                      eff: "1.55 kWh/mi",
                      detail: (
                        <>
                          &ldquo;Generally matched diesel counterparts&rdquo;
                          <Ref n={4} />
                        </>
                      ),
                    },
                    {
                      op: "Mone Transport",
                      region: "Texas, U.S.–Mexico border",
                      miles: "4,700",
                      eff: "1.64 kWh/mi",
                      detail: (
                        <>
                          Cross-border freight operations<Ref n={4} />
                        </>
                      ),
                    },
                    {
                      op: "PepsiCo / Frito-Lay",
                      region: "California regional",
                      miles: "Ongoing",
                      eff: "1.6–1.7 kWh/mi",
                      detail: (
                        <>
                          15 Semis, 574 mi best single day, 19.6 MPDGE
                          <Ref n={1} />
                          <Ref n={4} />
                        </>
                      ),
                    },
                    {
                      op: "DHL Supply Chain",
                      region: "Livermore, CA (long-haul)",
                      miles: "3,000+",
                      eff: "1.72 kWh/mi",
                      detail: (
                        <>
                          390-mile route at 75,000 lbs GCW<Ref n={5} />
                        </>
                      ),
                    },
                    {
                      op: "Saia",
                      region: "LTL regional",
                      miles: "Pilot",
                      eff: "1.73 kWh/mi",
                      detail: (
                        <>
                          Less-than-truckload carrier<Ref n={4} />
                        </>
                      ),
                    },
                    {
                      op: "RoadOne IntermodaLogistics",
                      region: "Oakland / Fremont, CA",
                      miles: "Ongoing",
                      eff: "1.9 kWh/mi",
                      detail: (
                        <>
                          38,000 lb payloads, aluminum/steel coils
                          <Ref n={6} />
                        </>
                      ),
                    },
                  ].map((r) => (
                    <tr
                      key={r.op}
                      className="border-t border-black/5 transition-colors hover:bg-accent-green-dim/30"
                    >
                      <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">
                        {r.op}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">
                        {r.region}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">
                        {r.miles}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-accent-green">
                        {r.eff}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">
                        {r.detail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          <Quote
            text="Our pilot of the Tesla Semi exceeded expectations, proving its ability to efficiently haul a typical DHL freight over long distances on a single charge. With its range of up to 500 miles, the Semi unlocks opportunities that were previously beyond the limits of heavy-duty EVs."
            attribution={
              <>
                — Jim Monkmeyer, President of Transportation, DHL Supply Chain
                North America<Ref n={5} />
              </>
            }
          />

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              The consistency is the point. Whether it&rsquo;s cross-border
              freight in Texas<Ref n={4} />, a 7,200-foot climb over Donner
              Pass<Ref n={4} />, or heavy industrial hauls in the Bay Area<Ref n={6} />,
              the Semi delivers efficiency between 1.55 and 1.9&nbsp;kWh per
              mile. That&rsquo;s a level of predictability fleet managers can
              plan around.
            </p>
          </ScrollReveal>

          <ChartCard
            title="Pilot Program Efficiency Results (kWh/mile)"
            subtitle={
              <>
                Every operator beat or matched Tesla&rsquo;s official
                1.7&nbsp;kWh/mi target. The red dashed line shows diesel&rsquo;s
                energy equivalent at 5.5&nbsp;kWh/mi.
              </>
            }
          >
            <AnimatedChart id="pilotChart" build={buildPilotChart} />
          </ChartCard>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              RoadOne IntermodaLogistics, which has hauled components for Tesla
              since 2012, purchased its first Semi in January 2026 and plans to
              acquire up to 10 more for its Oakland operations. VP of Strategic
              Growth Alex Joyce noted the company is{" "}
              <strong className="text-text-primary">
                &ldquo;in the works of bringing on more trucks to service more of
                our primary customers asking for these ESG/clean truck
                solutions.&rdquo;
              </strong>
              <Ref n={6} />
            </p>
          </ScrollReveal>

          <hr className="my-12 border-black/5" />

          {/* Section 5 — Pricing & TCO */}
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              Pricing &amp; Total Cost of Ownership
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <div className="mt-6 rounded-lg border border-black/5 bg-white px-4 py-3 text-xs leading-relaxed text-text-secondary">
              <strong className="text-text-primary">Note:</strong> Prices are
              gross MSRP before incentives. HVIP vouchers ($84k–$351k) and CORE
              programs can significantly reduce net cost.<Ref n={11} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              For years, Tesla didn&rsquo;t confirm Semi pricing. In February 2026,
              Electrek got an answer: the
              Long Range (500 miles) is{" "}
              <strong className="text-text-primary">
                $290,000 before destination fees and taxes
              </strong>
              , and the Standard Range (325 miles) is approximately{" "}
              <strong className="text-text-primary">$260,000</strong> per
              California&rsquo;s HVIP voucher data.<Ref n={9} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              That&rsquo;s about 60% more than the $150,000/$180,000 Tesla quoted
              in 2017. But at $290,000, it&rsquo;s still $145,000 below the
              industry average&nbsp;&mdash; CARB put the average zero-emission
              Class 8 at $435,000 in 2024.<Ref n={9} /> The Semi also sits well
              below the ICCT&rsquo;s 2025 median of $411,200 for Class 8 BEV
              tractors, with the longest range in the segment.<Ref n={11} />
            </p>
          </ScrollReveal>

          <ChartCard
            title="Class 8 EV Truck Pricing Comparison"
            subtitle={
              <>
                Gross MSRP before incentives. Tesla undercuts the industry median
                by ~$120,000 while delivering the longest range.<Ref n={9} />
                <Ref n={11} /> Freightliner and Volvo do not publicly quote gross
                pricing.
              </>
            }
          >
            <AnimatedChart id="pricingChart" build={buildPricingChart} />
          </ChartCard>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              California has set aside nearly{" "}
              <strong className="text-text-primary">
                $165 million in HVIP vouchers specifically for Tesla Semi purchases
              </strong>
              , covering about 992 vouchers worth between $84,000 and $351,000
              each. Tesla has also partnered with Uber Freight to offer additional
              discounts through a fleet accelerator program, further reducing the
              effective purchase price for qualifying operators.<Ref n={9} />
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              But sticker price is only part of the picture. The Frito-Lay pilot
              program found that{" "}
              <strong className="text-text-primary">
                electric trucks are about one-third as costly to operate
              </strong>{" "}
              as diesel when accounting for fuel, maintenance, and insurance.
              <Ref n={1} /> Zero oil changes, dramatically fewer brake
              replacements (thanks to regenerative braking), and no emissions
              system maintenance translate to significantly lower annual service
              bills.
            </p>
          </ScrollReveal>

          <ChartCard
            title="Total Cost of Ownership: Tesla Semi vs. Diesel"
            subtitle={
              <>
                Estimated 8-year TCO including purchase price, fuel, and
                maintenance. EV assumes CORE incentives applied.<Ref n={1} />
                <Ref n={9} />
              </>
            }
          >
            <AnimatedChart id="tcoChart" build={buildTcoChart} />
          </ChartCard>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              The CalStart study modeled payback periods with available incentives
              and found{" "}
              <strong className="text-text-primary">
                the payback period is approximately 5.5 years against an 8-year
                operational life
              </strong>
              , with total savings of about $200,000 over that lifespan.
              <Ref n={1} /> Electrek&rsquo;s analysis tracks: at ~$0.18/kWh, the
              Semi&rsquo;s ~$110,000 premium over a new diesel pays for itself in
              about 4 years on local distribution routes.<Ref n={9} />
            </p>
          </ScrollReveal>

          <hr className="my-12 border-black/5" />

          {/* Section 6 — Charging */}
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
              Infrastructure
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              The Charging Equation
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              The biggest open question for fleet operators is charging.
              Tesla&rsquo;s answer is twofold: depot charging for daily ops and
              a public Megacharger network for longer hauls.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The Semi charges via the Megawatt Charging System (MCS 3.2) standard
              at a peak rate of{" "}
              <strong className="text-text-primary">
                1.2&nbsp;MW (1,200&nbsp;kW)
              </strong>
              , reaching 60% state of charge in just 30 minutes.<Ref n={3} /> For
              comparison, the Freightliner eCascadia and Volvo VNR Electric max
              out at 270&nbsp;kW, meaning a 90-minute charge gets them to 80%.
              <Ref n={2} /> That&rsquo;s about a three-to-one speed advantage
              for the Tesla Semi.
            </p>
          </ScrollReveal>

          <ChartCard
            title="Charging Speed: Max Power (kW) and Time to Usable Charge"
            subtitle="Tesla's 1.2 MW Megacharger is in a different class from CCS-based competitors"
          >
            <AnimatedChart id="chargingChart" build={buildChargingChart} />
          </ChartCard>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              For many fleets, depot charging is even more important than en-route
              charging. The Frito-Lay data showed that{" "}
              <strong className="text-text-primary">
                overnight charging was sufficient for the Semi&rsquo;s daily
                300-mile duty cycle
              </strong>
              , with an average charge session completing in 1.24 hours and
              delivering 313.3&nbsp;kWh.<Ref n={1} /> DHL&rsquo;s Semi in Central
              California currently runs about 100 miles per day and only needs to
              charge about once per week.<Ref n={5} />
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Tesla launched its first public Semi Megacharger site in Los Angeles
              in early 2026 and is actively building out a freight corridor
              network.<Ref n={4} /> The Frito-Lay facility also demonstrated the
              power of integrated energy solutions: Tesla Solar, Tesla Battery
              Energy Storage (BESS), and Tesla Megachargers working together. At
              that site,{" "}
              <strong className="text-text-primary">
                solar production exceeded all energy consumed by the zero-emission
                vehicles combined.
              </strong>
              <Ref n={1} />
            </p>
          </ScrollReveal>

          <Callout>
            <strong className="text-text-primary">Peak shaving matters:</strong>{" "}
            The Frito-Lay study found that demand charges (fees utilities levy
            based on peak power draw) can constitute the majority of a
            site&rsquo;s electricity costs. Tesla&rsquo;s battery storage systems
            address this by slowly charging from the grid during off-peak hours
            and then powering chargers during peak demand.<Ref n={1} />
          </Callout>

          <hr className="my-12 border-black/5" />

          {/* Section 7 — Environment */}
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
              The Green Case
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              Environmental Impact at Scale
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              Freight accounts for about 25% of all transportation emissions in
              California.<Ref n={1} /> Electrifying even a slice of the Class 8
              fleet moves the needle.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The CalStart study quantified it.{" "}
              <strong className="text-text-primary">
                A single electric yard tractor offsets 23,570&nbsp;kg of
                CO&#8322;, 93.8&nbsp;kg of NO&#8339;, and 850 grams of
                particulate matter per year
              </strong>{" "}
              over 2,500 service hours.<Ref n={1} /> That&rsquo;s the equivalent
              of pulling 5.2 gas cars off the road, per truck, per year.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              DHL projects each Tesla Semi in its fleet will reduce greenhouse gas
              emissions by{" "}
              <strong className="text-text-primary">
                50 metric tons annually
              </strong>
              .<Ref n={5} /> At that rate, a 100-truck fleet would eliminate 5,000
              metric tons of CO&#8322; per year, before accounting for any
              renewable energy integration at the depot.
            </p>
          </ScrollReveal>

          <ChartCard
            title="Scaling the Impact: Annual CO₂ Reduction by Fleet Size"
            subtitle={
              <>
                Based on DHL&rsquo;s projection of 50 metric tons CO₂ reduced per
                Tesla Semi per year<Ref n={5} />
              </>
            }
          >
            <AnimatedChart id="emissionsChart" build={buildEmissionsChart} />
          </ChartCard>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              Driver experience backs it up. In the Frito-Lay pilot,{" "}
              <strong className="text-text-primary">
                80% of drivers reported that operating the Tesla Semi was similar
                to or an improvement over diesel tractors
              </strong>
              .<Ref n={1} /> Nearly all operators found the ZE Semi to be a better
              alternative than both the baseline diesel and the new RNG tractors.
              Time spent charging, they said, impacted their daily schedule about
              the same as fueling a diesel truck.<Ref n={1} />
            </p>
          </ScrollReveal>

          <hr className="my-12 border-black/5" />

          {/* Section 8 — What's Next */}
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
              Looking Ahead
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              Production Ramps in 2026
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              The Semi has been a slow burn. Low-volume production started in late
              2022, limited to a handful of PepsiCo trucks. Since then, Walmart,
              DHL, Saia, ArcBest, RoadOne, and Mone Transport have all gotten
              their units. But 2026 is where the story changes.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              In February 2026, Elon Musk confirmed on X:{" "}
              <strong className="text-text-primary">
                &ldquo;Tesla Semi starts high volume production this year.&rdquo;
              </strong>
              <Ref n={3} /> Tesla&rsquo;s updated Semi webpage reads
              &ldquo;Deliveries start in 2026,&rdquo; and the truck received a
              design facelift in November 2025 that aligns it with Tesla&rsquo;s
              current design language.<Ref n={3} /> Both variants are described as
              &ldquo;designed for autonomy.&rdquo;<Ref n={9} /> As of March 2026,
              the dedicated Tesla Semi factory is nearing completion, with mass
              production ramp targeted for mid-2026 and eventual capacity of up to
              50,000 units per year.<Ref n={13} />
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <figure className="my-10">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-black/5">
                <Image
                  src="/images/article2.jpg"
                  alt="The dedicated Tesla Semi factory nearing completion"
                  width={1200}
                  height={675}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-2 text-center text-xs text-text-secondary">
                The dedicated Tesla Semi factory nearing completion, March 2026.
              </figcaption>
            </figure>
          </ScrollReveal>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              DHL has publicly stated it plans to{" "}
              <strong className="text-text-primary">add more Semis in 2026</strong>{" "}
              as volume production begins.<Ref n={5} /> RoadOne is scaling from 1
              to up to 10 trucks.<Ref n={6} /> As Dan Priestley, Tesla&rsquo;s
              Director of Semi, put it: &ldquo;Their experience as a trusted
              logistics provider will help us make the product even better for
              future global markets.&rdquo;<Ref n={5} />
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The shift from pilot to production means better pricing, wider
              availability, and a denser Megacharger network. For fleet
              operators still on the fence, the pilot data is in. The numbers
              are clear.
            </p>
          </ScrollReveal>

          {/* ── Download Full Report ── */}
          <ScrollReveal>
            <div className="my-12 flex flex-col items-center gap-3 rounded-md border border-black/5 bg-[#fafafa] px-5 py-6 sm:flex-row sm:justify-between">
              <p className="text-[14px] font-semibold text-text-primary">
                Download the full report as PDF
              </p>
              {!reportSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setReportSubmitted(true);
                  }}
                  className="flex w-full gap-2 sm:w-auto"
                >
                  <input
                    type="email"
                    required
                    value={reportEmail}
                    onChange={(e) => setReportEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-9 w-full min-w-0 rounded border border-black/10 bg-white px-3 text-[13px] text-text-primary placeholder:text-[#aaa] focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green sm:w-56"
                  />
                  <button
                    type="submit"
                    className="h-9 shrink-0 rounded bg-accent-green px-5 text-[13px] font-semibold text-white transition-colors hover:brightness-110"
                  >
                    Send
                  </button>
                </form>
              ) : (
                <p className="text-[13px] font-medium text-accent-green">
                  We&rsquo;ll send it to your inbox shortly.
                </p>
              )}
            </div>
          </ScrollReveal>

          {/* ── Bibliography ── */}
          <ScrollReveal>
            <div className="rounded-lg border border-black/5 bg-white p-6 md:p-8">
              <h3 className="font-heading text-lg font-bold tracking-tight text-text-primary">
                Sources &amp; Bibliography
              </h3>
              <div className="mt-6 flex flex-col divide-y divide-black/5">
                {BIBLIOGRAPHY.map((b) => (
                  <div key={b.n} className="flex gap-3 py-3 text-[13px] leading-relaxed text-text-secondary">
                    <span className="shrink-0 font-bold text-accent-green">
                      [{b.n}]
                    </span>
                    <span id={`ref${b.n}`}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        </article>
      </main>
      <RelatedArticles currentHref="/research/tesla-semi-advantage" />
      <Footer />
    </>
  );
}

/* ─── bibliography data ─── */
const BIBLIOGRAPHY = [
  {
    n: 1,
    text: 'CalStart & San Joaquin Valley Air Pollution Control District. "Frito-Lay Transformative Zero and Near-Zero Emission Freight Facility Project." Published 2024. Monitoring data on 15 Tesla Semis, diesel, and RNG trucks including efficiency, charging, driver experience, solar/storage, and emissions.',
  },
  {
    n: 2,
    text: 'North American Council for Freight Efficiency (NACFE). "Run on Less — Electric" demonstration results, 2023. Real-world testing of Tesla Semi, Freightliner eCascadia, Volvo VNR Electric, and Nikola Tre BEV across commercial fleet operations.',
  },
  {
    n: 3,
    text: 'Mihalascu, Dan. "Tesla Semi Finally Enters Mass Production This Year With Final Specs Revealed." Autoblog, February 10, 2026.',
  },
  {
    n: 4,
    text: 'Klender, Joey. "Tesla Semi expands pilot program to Texas logistics firm: here\'s what they said." Teslarati, March 10, 2026. Includes efficiency data from Mone Transport (1.64 kWh/mi over 4,700 miles), ArcBest (1.55 kWh/mi), PepsiCo, DHL, and Saia pilots.',
  },
  {
    n: 5,
    text: 'DHL. "DHL Supply Chain Accelerates Sustainability With First Tesla Semi Delivery." Press Release, Westerville, Ohio, December 4, 2025.',
  },
  {
    n: 6,
    text: '"First Tesla Semi for RoadOne IntermodaLogistics." Heavy Duty Trucking, January 21, 2026.',
  },
  {
    n: 7,
    text: 'CalStart. "Zeroing in on Zero-Emission Trucks." 2025 report on ZET deployment data, fleet barriers, infrastructure, and regulatory landscape across the United States.',
  },
  {
    n: 8,
    text: 'Nikola Corporation. "Tre BEV" product specifications page. nikolamotor.com; Volvo Trucks. "VNR Electric" specifications, volvotrucks.us.',
  },
  {
    n: 9,
    text: 'Lambert, Fred. "Tesla is quoting $290,000 for its 500-miles electric semi truck." Electrek, February 10, 2026. Includes HVIP voucher program data, CARB pricing, and Uber Freight partnership details.',
  },
  {
    n: 10,
    text: 'Freightliner. "eCascadia" official specifications page. Detroit eAxle powertrain: 425 hp (single motor) / 470 hp (dual motor), 291–438 kWh battery options, 220–230 mile typical range.',
  },
  {
    n: 11,
    text: '"Class 8 EV Trucks See Price Rise." Transport Topics, citing ICCT 2025 study. Median Class 8 BEV tractor price of $411,200 across manufacturers. California HVIP voucher data: californiahvip.org.',
  },
  {
    n: 12,
    text: "Nikola Corporation BEV dealer listings and fleet updates. Nikola restructured in 2025 (hydrogen division impacted); BEV production line continues with software updates and remains incentive-eligible.",
  },
  {
    n: 13,
    text: '"Tesla Semi electric truck factory finally nears completion as mass production looms." The Driven, March 10, 2026. Dedicated Semi factory approaching completion with 50,000 units/year capacity target.',
  },
];
