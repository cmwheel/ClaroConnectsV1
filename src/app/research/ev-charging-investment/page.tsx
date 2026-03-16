"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import Chart from "chart.js/auto";

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

const chartDefaults = () => {
  Chart.defaults.color = C.body;
  Chart.defaults.borderColor = "rgba(0,0,0,0.05)";
  Chart.defaults.font.family = "var(--font-inter), Inter, system-ui, sans-serif";
  Chart.defaults.font.size = 12;
};

function buildMarketGrowthChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["2025", "2028 (est.)", "2030 (est.)", "2033 (est.)"],
      datasets: [
        { label: "Conservative", data: [31, 52, 75, 113], backgroundColor: C.grey3, borderRadius: 3, borderSkipped: false },
        { label: "Mid-range (Grand View)", data: [40, 78, 125, 239], backgroundColor: C.greenMid, borderRadius: 3, borderSkipped: false },
        { label: "Aggressive (Precedence)", data: [48, 105, 185, 330], backgroundColor: C.green, borderRadius: 3, borderSkipped: false },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { position: "top", labels: { usePointStyle: true, padding: 16, color: C.dark } },
        tooltip: { backgroundColor: C.dark, callbacks: { label: (c) => (c.dataset.label || "") + ": $" + c.raw + "B" } },
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: (v) => "$" + v + "B", color: C.muted }, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false }, ticks: { color: C.dark } },
      },
    },
  });
}

function buildNetworkCompChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Tesla Supercharger", "Electrify America", "EVgo", "ChargePoint (DC)", "All Others"],
      datasets: [{
        label: "DC Fast Ports",
        data: [35682, 5100, 5000, 4500, 17634],
        backgroundColor: [C.green, C.greenMid, C.grey1, C.grey2, C.grey3],
        borderRadius: 3,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: C.dark, callbacks: { label: (c) => Number(c.raw).toLocaleString() + " ports" } },
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: (v) => Number(v) / 1000 + "k", color: C.muted }, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { size: 10 } } },
      },
    },
  });
}

function buildUtilizationChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: ["2019", "2020", "2021", "2022", "2023", "2024", "Q4 2025"],
      datasets: [
        { label: "Global Avg Sessions/Stall/Day", data: [3.8, 3.2, 4.0, 5.0, 5.8, 6.8, 7.5], borderColor: C.green, backgroundColor: "rgba(168,216,50,0.1)", fill: true, tension: 0.3, pointRadius: 5, pointBackgroundColor: C.green },
        { label: "North America Avg", data: [null, null, null, null, 7.0, 8.5, 9.5], borderColor: C.greenMid, backgroundColor: "rgba(147,191,46,0.08)", fill: true, tension: 0.3, pointRadius: 5, pointBackgroundColor: C.greenMid, borderDash: [6, 3] },
        { label: "% Drivers Waiting", data: [2.5, 2.2, 2.0, 1.8, 1.5, 1.2, 1.0], borderColor: C.diesel, backgroundColor: "transparent", tension: 0.3, pointRadius: 4, pointBackgroundColor: C.diesel, borderDash: [3, 3], yAxisID: "y2" },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: { legend: { position: "top", labels: { usePointStyle: true, padding: 16, color: C.dark } },
        tooltip: { backgroundColor: C.dark } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Sessions/Stall/Day", color: C.muted }, ticks: { color: C.muted }, grid: { color: "rgba(0,0,0,0.04)" } },
        y2: { position: "right", beginAtZero: true, max: 5, title: { display: true, text: "% Waiting", color: C.muted }, grid: { display: false }, ticks: { callback: (v) => v + "%", color: C.muted } },
        x: { grid: { display: false }, ticks: { color: C.dark } },
      },
    },
  });
}

function buildEnergyDeliveredChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"],
      datasets: [
        { label: "Energy Delivered (TWh)", data: [1.4, 1.6, 1.8, 1.8], backgroundColor: [C.grey3, C.greenMid, C.greenMid, C.green], borderRadius: 3, borderSkipped: false, yAxisID: "y" },
        { type: "line", label: "kWh/Stall/Day", data: [227, 251, 268, 261], borderColor: C.diesel, backgroundColor: "transparent", pointRadius: 5, pointBackgroundColor: C.diesel, tension: 0.3, yAxisID: "y2" },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: { legend: { position: "top", labels: { usePointStyle: true, padding: 16, color: C.dark } },
        tooltip: { backgroundColor: C.dark } },
      scales: {
        y: { beginAtZero: true, ticks: { callback: (v) => v + " TWh", color: C.muted }, grid: { color: "rgba(0,0,0,0.04)" } },
        y2: { position: "right", min: 200, max: 300, ticks: { callback: (v) => v + " kWh", color: C.muted }, grid: { display: false } },
        x: { grid: { display: false }, ticks: { color: C.dark } },
      },
    },
  });
}

function buildEconomicsChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Level 2 (Low)", "Level 2 (High)", "DC Fast (Low)", "DC Fast (High)"],
      datasets: [
        { label: "Installation Cost", data: [3000, 15000, 80000, 250000], backgroundColor: C.diesel, borderRadius: 3, borderSkipped: false },
        { label: "Annual Revenue", data: [2000, 18000, 20000, 144000], backgroundColor: C.green, borderRadius: 3, borderSkipped: false },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { position: "top", labels: { usePointStyle: true, padding: 16, color: C.dark } },
        tooltip: { backgroundColor: C.dark, callbacks: { label: (c) => (c.dataset.label || "") + ": $" + Number(c.raw).toLocaleString() } },
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: (v) => "$" + (Number(v) >= 1000 ? Number(v) / 1000 + "k" : v), color: C.muted }, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { size: 10 } } },
      },
    },
  });
}

function buildReliabilityChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Tesla Supercharger", "ChargePoint", "Electrify America", "EVgo", "Blink"],
      datasets: [{
        label: "% Sessions with Issues",
        data: [4, 21, 35, 28, 32],
        backgroundColor: [C.green, C.grey2, C.diesel, C.diesel, C.diesel],
        borderRadius: 3,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: C.dark, callbacks: { label: (c) => c.raw + "% of sessions had issues" } },
      },
      scales: {
        x: { beginAtZero: true, max: 50, ticks: { callback: (v) => v + "%", color: C.muted }, grid: { display: false } },
        y: { grid: { display: false }, ticks: { color: C.dark, font: { size: 11 } } },
      },
    },
  });
}

function buildPaybackChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["L2 (no incentives)", "L2 (with 30C)", "DC Fast (no incentives)", "DC Fast (with 30C)", "DC Fast (high traffic + credits)"],
      datasets: [{
        label: "Payback (years)",
        data: [5, 3.5, 4, 2.5, 1.5],
        backgroundColor: [C.grey3, C.greenMid, C.grey1, C.greenMid, C.green],
        borderRadius: 3,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: C.dark, callbacks: { label: (c) => c.raw + " years" } },
      },
      scales: {
        x: { beginAtZero: true, max: 7, ticks: { callback: (v) => v + " yrs", color: C.muted }, grid: { display: false } },
        y: { grid: { display: false }, ticks: { color: C.dark, font: { size: 11 } } },
      },
    },
  });
}

function Ref({ n }: { n: number }) {
  return (
    <a href={`#ref${n}`} className="ml-0.5 text-[10px] font-bold text-accent-green align-super hover:underline">
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

function Quote({ text, attribution }: { text: string; attribution: React.ReactNode }) {
  return (
    <ScrollReveal>
      <blockquote className="my-8 rounded-r-md border-l-[3px] border-accent-green/50 bg-accent-green-dim/50 px-5 py-4">
        <p className="text-[15px] italic leading-relaxed text-text-primary">&ldquo;{text}&rdquo;</p>
        <cite className="mt-2 block text-xs font-normal not-italic text-text-secondary">{attribution}</cite>
      </blockquote>
    </ScrollReveal>
  );
}

const HERO_STATS = [
  { value: "$40–48B", label: "global EV charging market (2025)" },
  { value: "25% CAGR", label: "projected growth through 2033" },
  { value: "~70,000", label: "US public DC fast ports (early 2026)" },
  { value: "6.7 TWh", label: "energy delivered by Tesla Superchargers in 2025" },
];

export default function EVChargingInvestmentArticle() {
  return (
    <>
      <Navbar />
      <main className="bg-bg-base">
        <header className="relative min-h-[48vh] overflow-hidden bg-bg-base pt-24 pb-8 md:min-h-[44vh] md:pt-28 md:pb-10">
          <div className="absolute inset-y-0 right-0 flex w-[58%] items-end justify-center pt-12 md:w-[55%] md:pt-16">
            <div className="relative h-[92%] w-full">
              <Image
                src="/images/ev-charging-article1.jpg"
                alt="EV charging infrastructure"
                fill
                className="object-cover object-left-top"
                priority
                sizes="58vw"
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: [
                  "linear-gradient(to right, var(--bg-base) 0%, rgba(245,245,245,0.7) 22%, transparent 42%)",
                  "linear-gradient(to left, rgba(245,245,245,0.5) 0%, transparent 8%)",
                  "linear-gradient(to bottom, rgba(245,245,245,0.4) 0%, transparent 6%)",
                  "linear-gradient(to top, rgba(245,245,245,0.4) 0%, transparent 6%)",
                ].join(", "),
              }}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-base to-transparent" />

          <div className="relative z-10 flex items-center py-6 md:py-8">
            <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
              <div className="max-w-lg">
                <motion.p
                  className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                >
                  Investment Deep Dive
                </motion.p>
                <motion.h1
                  className="font-heading mt-2 text-3xl font-bold leading-[1.15] tracking-tight text-text-primary md:text-4xl lg:text-5xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  Why EV Charging Is the Infrastructure Investment of the Decade
                </motion.h1>
                <motion.p
                  className="mt-3 max-w-lg text-[15px] leading-relaxed text-text-secondary md:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  A $40–48B market today, headed to $200–400B+. Tesla is selling the picks and shovels.
                </motion.p>
              </div>
            </div>
          </div>
        </header>

        <div className="border-y border-black/5 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4 md:px-12">
            <motion.div
              className="grid grid-cols-2 gap-3 md:grid-cols-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-black/5 bg-bg-base px-4 py-3 text-center"
                >
                  <div className="text-lg font-bold tracking-tight text-accent-green md:text-xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-text-secondary">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="border-y border-black/5 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3 md:px-12">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-green/15 text-[11px] font-bold text-accent-green">
                CW
              </div>
              <div>
                <p className="text-[13px] font-semibold text-text-primary">Charlie Wheeler</p>
                <p className="text-[11px] text-text-secondary">March 15, 2026</p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-text-secondary">18 min read</span>
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-6 py-14 md:px-12 md:py-20">
          {/* Section 1: The Market */}
          <div id="market">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                The Opportunity
              </p>
              <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                A Multi-Hundred-Billion-Dollar Market Is Being Built Right Now
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                The global EV charging infrastructure market was valued at roughly $40–48 billion in 2025 (Grand View Research estimates $40.2B; Precedence Research puts it at $47.6B). Depending on whose forecast you trust, it&rsquo;s headed to somewhere between $113 billion and $415 billion by the early-to-mid 2030s, with compound annual growth rates consistently in the 22–27% range.<Ref n={1} /><Ref n={2} /> The consensus is clear: this is one of the fastest-growing infrastructure sectors in the world.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                In the US alone, the charging market is growing at over 30% annually. The number of public DC fast-charging ports jumped 33% in 2025, from 51,000 to 67,916 as of January 2026, and has continued growing since.<Ref n={3} /> The federal government has allocated $5 billion through the NEVI program to build out a national charging network along highway corridors, with $3.3 billion distributed to states. Rollout has been slower than planned (the program was briefly paused in early 2025 before being restored through legal action), with roughly 120–150 stations energized by early 2026 and hundreds more funded or under construction.<Ref n={4} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                The drivers are straightforward: EV adoption is surging globally, government incentives are substantial (the federal 30C tax credit covers up to 30% of installation costs, up to $100,000 per commercial property), fleet electrification is accelerating, and policy mandates in states like California are pushing the timeline forward.<Ref n={5} /> Asia Pacific already accounts for 68% of the global market and is growing fastest, but North America is where the infrastructure gap, and therefore the investment opportunity, is widest.<Ref n={1} />
              </p>
            </ScrollReveal>
          </div>

          <ChartCard
            title="Global EV Charging Infrastructure Market Projections"
            subtitle="Estimates from major research firms. All show 22–27% CAGR. [1][2]"
          >
            <AnimatedChart id="marketGrowthChart" build={buildMarketGrowthChart} />
          </ChartCard>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              To put this in context, the historical buildout of gas stations in America took decades. The EV charging network is being built on a compressed timeline, with modern advantages: software-managed pricing, real-time utilization data, and the ability to generate revenue from adjacent services. It&rsquo;s not a perfect analogy, but the parallels are strong enough that major real estate firms, energy companies, and infrastructure funds are all making aggressive bets.
            </p>
          </ScrollReveal>

          <hr className="my-12 border-black/5" />

          {/* Section 2: Tesla's Charging Business */}
          <div id="tesla">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                The Dominant Player
              </p>
              <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                Tesla&rsquo;s Charging Empire: From Network to Platform
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                Tesla doesn&rsquo;t just make electric vehicles. It also operates the largest, most reliable fast-charging network in the world: 8,182 stations and 77,682 connectors globally as of Q4 2025, with over half of all US DC fast-charging ports.<Ref n={6} /><Ref n={3} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                But the bigger story is what Tesla did next: it opened the network to non-Tesla EVs and started selling the hardware to businesses. That shift turns charging from a vehicle perk into a platform business, with massive implications.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Supercharger for Business</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                Launched in late 2025, the Supercharger for Business program lets commercial property owners buy and install Tesla&rsquo;s V4 Supercharger hardware at their own sites (offices, retail centers, hotels, gas stations, convenience stores). The minimum is four stalls per site, with V4 posts rated for up to 500 kW output (current deployments typically deliver up to 325 kW, with higher speeds rolling out as vehicles support them).<Ref n={7} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                Here&rsquo;s what makes it compelling: the business owns the hardware and sets the pricing, but Tesla manages everything else. That includes integration into Tesla&rsquo;s in-car navigation and Trip Planner (so every Tesla driver gets routed to your location), real-time availability updates, over-the-air software updates, preventive maintenance, and driver support. Tesla guarantees 97% uptime, which is the highest in the industry.<Ref n={7} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                The stations can be fully white-labeled, meaning businesses can brand them with their own logos instead of Tesla&rsquo;s. They show up on Tesla&rsquo;s Supercharger map and function identically to Tesla-owned stations from the driver&rsquo;s perspective.<Ref n={8} /> The first third-party-owned Supercharger site went live in November 2025 in Land O&rsquo;Lakes, Florida, operated by Suncoast Charging. It features eight V4 stalls at $0.45/kWh, available 24/7 to all EVs.<Ref n={9} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.16}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Wall Connector for Business</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                For sites that don&rsquo;t need fast charging, Tesla also offers the Wall Connector for Business program. These are Level 2 AC chargers that businesses install (through Tesla Certified Installers), with the option to set pay-per-use pricing anywhere from $0.01 to $0.75 per kWh. Tesla handles all billing and distributes 100% of revenue back to the business quarterly, charging a $0.03/kWh processing fee. If the chargers are offered for free, there&rsquo;s no software fee at all.<Ref n={10} /> This program has scaled rapidly since its November 2025 launch, with hundreds of commercial connector sites now active across the US.<Ref n={10} />
              </p>
            </ScrollReveal>
          </div>

          <ChartCard
            title="US DC Fast-Charging Networks: Port Count (Jan 2026)"
            subtitle="Tesla holds 52.5% of all US public DC fast-charging ports. [3]"
          >
            <AnimatedChart id="networkCompChart" build={buildNetworkCompChart} />
          </ChartCard>

          <Callout>
            <strong className="text-text-primary">Why this matters for investors:</strong> Tesla is essentially creating an &ldquo;App Store&rdquo; model for EV charging. Businesses provide the real estate and capital. Tesla provides the technology, the driver network, and the operational backbone. The host keeps the revenue. Tesla profits from hardware sales, processing fees, and an ever-growing network that makes its vehicles more attractive. Everyone wins.
          </Callout>

          <hr className="my-12 border-black/5" />

          {/* Section 3: Utilization */}
          <div id="utilization">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                The Proof
              </p>
              <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                The Utilization Graph That Proves the Model Works
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                The single most important data point in the entire EV charging investment thesis is Tesla&rsquo;s utilization trend. It answers the question every skeptic asks: &ldquo;If you keep building more chargers, won&rsquo;t each one get used less?&rdquo;
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                The answer, according to Tesla&rsquo;s own data, is no. Average sessions per stall per day have climbed steadily from under 4 in 2019 to about 7.5 globally by Q4 2025 (approaching 8 during peak periods), with North American stalls consistently running higher.<Ref n={11} /> During peak periods like Thanksgiving 2025, US stalls averaged 11.4 sessions per day.<Ref n={12} /> This happened while the network was expanding rapidly. Tesla added roughly 13,500 new stalls in 2025, an 18% increase year-over-year, yet utilization still climbed.<Ref n={6} /> The reason: the number of EVs on the road is growing faster than the number of chargers. And since Tesla opened its network to non-Tesla vehicles (Ford, GM, Rivian, and others), the addressable pool of customers per stall has expanded dramatically.
              </p>
            </ScrollReveal>
          </div>

          <ChartCard
            title="Tesla Supercharger Utilization: Sessions Per Stall Per Day"
            subtitle="Despite massive network expansion, utilization per stall has doubled since 2019. [11]"
          >
            <AnimatedChart id="utilizationChart" build={buildUtilizationChart} height="h-[320px]" />
          </ChartCard>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              The throughput numbers tell the same story from a different angle. In Q4 2025, Tesla&rsquo;s global network averaged 261 kWh delivered per stall per day, up from 227 kWh in Q1 2025.<Ref n={13} /> The network delivered a record 1.8 TWh in Q4 alone, totaling 6.7 TWh for the full year across 52 million sessions in Q4.<Ref n={13} /> Meanwhile, the share of drivers experiencing a wait remained low, dropping from over 2% in earlier years to roughly 1% by late 2025 (about one car waiting per 100 stalls on average).<Ref n={11} /> This combination of rising utilization and low wait times is the hallmark of a network that&rsquo;s scaling efficiently: enough demand to generate strong revenue, but enough capacity to keep the experience smooth.
            </p>
          </ScrollReveal>

          <ChartCard
            title="Tesla Supercharger Energy Delivered (TWh by Quarter, 2025)"
            subtitle="Record 6.7 TWh delivered globally in 2025; Q4 reached 1.8 TWh and 52 million sessions. [13]"
          >
            <AnimatedChart id="energyDeliveredChart" build={buildEnergyDeliveredChart} />
          </ChartCard>

          <Callout>
            <strong className="text-text-primary">What this means in dollars:</strong> At an average session of 34.6 kWh and typical pricing of $0.35–0.45/kWh, each stall generates roughly $100–120 per day in gross revenue. Tesla-hosted sites often hit the upper end faster thanks to built-in navigation routing that sends drivers directly to available stalls.
          </Callout>

          <hr className="my-12 border-black/5" />

          {/* Section 4: The Economics */}
          <div id="economics">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                The Numbers
              </p>
              <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                Charging Station Economics: What the Numbers Actually Look Like
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                For anyone considering EV charging as a business or an investment, the economics break down into three categories: what it costs to install, what it earns, and how long it takes to pay back.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Installation Costs</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                For Level 2 chargers (the kind you&rsquo;d find at hotels, offices, or retail parking lots), the total installed cost runs $3,000 to $15,000 per unit, depending on site conditions and electrical capacity. DC fast chargers, which are what highway stops and high-traffic commercial sites need, range from $80,000 to $250,000+ per port including hardware, installation, and electrical work.<Ref n={14} /> The federal 30C tax credit can knock 30% off the bill (up to $100,000 per property) for installations that meet prevailing wage requirements and are located in eligible census tracts. This credit is available through June 2026. State rebates and utility incentives can stack on top, sometimes covering 50–80% of total costs when combined.<Ref n={5} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Revenue Potential</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                Revenue varies enormously by charger type, location, and utilization. Industry estimates put Level 2 chargers at $2,000–$10,000 per year per unit in moderate-traffic locations. DC fast chargers can generate $20,000–$144,000+ per year per port at high-traffic sites, with monthly revenue of $1,200–$2,500+ being a reasonable expectation for well-placed units.<Ref n={14} /><Ref n={15} />
              </p>
            </ScrollReveal>
          </div>

          <ChartCard
            title="EV Charger Economics: Installation Cost vs. Annual Revenue"
            subtitle="Ranges based on industry data. Actual results depend on location and utilization. [14][15]"
          >
            <AnimatedChart id="economicsChart" build={buildEconomicsChart} />
          </ChartCard>

          <ScrollReveal>
            <h3 className="mt-8 text-[17px] font-bold text-text-primary">Payback and Margins</h3>
            <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
              Net profit margins for charging operations typically run 10–30% once a station is up and running, with energy markups of 20–50% over wholesale electricity costs, plus additional revenue from idle fees, advertising, and retail upsell.<Ref n={14} /> Payback periods for Level 2 installations are typically 3–5 years. DC fast chargers, despite their higher upfront cost, can break even in 2–4 years at high-traffic locations, particularly with federal and state incentives. EVgo, the largest publicly traded pure-play charging company, hit positive EBITDA for the first time in Q4 2025, signaling that the sector as a whole is crossing the profitability threshold.<Ref n={16} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <div className="my-10 overflow-x-auto rounded-lg border border-black/5">
              <table className="w-full min-w-[520px] text-left text-[13px]">
                <thead>
                  <tr className="bg-accent-green text-white">
                    <th className="px-4 py-3 font-semibold">Metric</th>
                    <th className="px-4 py-3 font-semibold">Level 2 (AC)</th>
                    <th className="px-4 py-3 font-semibold">DC Fast Charger</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Installation cost", l2: "$3K–$15K", dc: "$80K–$250K+" },
                    { metric: "Annual revenue (moderate traffic)", l2: "$2K–$10K", dc: "$20K–$60K" },
                    { metric: "Annual revenue (high traffic)", l2: "$6K–$18K", dc: "$60K–$144K+" },
                    { metric: "Net margin (operating)", l2: "10–20%", dc: "15–30%" },
                    { metric: "Typical payback period", l2: "3–5 years", dc: "2–4 years" },
                    { metric: "Federal tax credit (30C)", l2: "Up to 30%", dc: "Up to 30% ($100K max)" },
                  ].map((row, i) => (
                    <tr key={row.metric} className={`border-t border-black/5 ${i % 2 === 1 ? "bg-bg-surface" : ""}`}>
                      <td className="px-4 py-3 text-text-secondary">{row.metric}</td>
                      <td className="px-4 py-3 font-semibold text-accent-green">{row.l2}</td>
                      <td className="px-4 py-3 font-semibold text-accent-green">{row.dc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          <Callout>
            <strong className="text-text-primary">The Tesla advantage for hosts:</strong> Under Tesla&rsquo;s Supercharger for Business model, the host owns the hardware and keeps the charging revenue, while Tesla handles operations, maintenance, and customer acquisition. This is essentially a turnkey business: you provide the parking spaces and the capital, Tesla provides a guaranteed stream of customers through its navigation system and 97% uptime. The closest analogy is buying a franchise where the parent company sends all the foot traffic.
          </Callout>

          <hr className="my-12 border-black/5" />

          {/* Section 5: Real Estate */}
          <div id="realestate">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                Real Estate 2.0
              </p>
              <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                Charging Infrastructure as a Real Estate Play
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                Beyond direct charging revenue, EV chargers are increasingly being viewed as property-value enhancers. A University of Maryland study found that increased EV charging availability raised home values by an average of 3.3% (about $17,000 per home) in California.<Ref n={17} /> A 2024 study published in Nature Communications found that businesses near EV charging stations saw average spending increases of about 1.4%, with the effect strongest within 100 meters, and even higher in lower-income areas.<Ref n={18} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                The mechanism is dwell time. A DC fast charging session takes 20–40 minutes. That&rsquo;s 20–40 minutes a customer is browsing your store, eating at your restaurant, or shopping in your mall instead of pumping gas for 3 minutes and leaving. ChargePoint&rsquo;s own case studies show EV chargers can increase dwell time by up to 50 minutes at retail locations.<Ref n={17} />
              </p>
            </ScrollReveal>
          </div>

          <ChartCard
            title="Charging Network Reliability: Sessions with Issues Reported"
            subtitle="Tesla leads with 4% of sessions encountering problems vs. 21–35% at competitors. [19]"
          >
            <AnimatedChart id="reliabilityChart" build={buildReliabilityChart} height="h-[280px]" />
          </ChartCard>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              For commercial real estate owners, the math is increasingly clear. Parking lots and rooftops, two of the least productive assets in a typical property portfolio, can be turned into revenue-generating infrastructure. REITs can structure charging revenue as &ldquo;rents from real property&rdquo; under IRS guidelines, enabling portfolio-wide monetization of parking assets without jeopardizing REIT status.<Ref n={20} /> Terawatt Infrastructure argues that charging hubs are creating &ldquo;a new class of commercial real estate asset&rdquo; where the value comes not from the building but from the electrical capacity and location.<Ref n={20} /> CBRE research shows that EV-ready properties attract higher-quality tenants and command rent premiums, particularly in markets where electrification mandates are tightening.<Ref n={21} />
            </p>
          </ScrollReveal>

          <ChartCard
            title="Payback Period by Charger Type and Incentive Level"
            subtitle="Federal and state incentives can cut payback by 1–2 years. High-traffic DC fast sites can break even in under 2 years."
          >
            <AnimatedChart id="paybackChart" build={buildPaybackChart} height="h-[260px]" />
          </ChartCard>

          <Quote
            text="EV charging is not just a sustainability play. It's a revenue and tenant-retention strategy that's becoming table stakes for Class A commercial properties."
            attribution={<>CBRE, &ldquo;How Leasing EV Charging Infrastructure Can Improve Asset Value,&rdquo; 2025<Ref n={21} /></>}
          />

          <hr className="my-12 border-black/5" />

          {/* Section 6: Looking Ahead */}
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
              Looking Ahead
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              Why 2026 Is an Inflection Point
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              Several trends are converging to make 2026 a pivotal year for charging infrastructure investment.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              First, <strong className="text-text-primary">the federal 30C tax credit expires on June 30, 2026</strong>, creating a natural rush to install before the incentive disappears. After that date, the economics still work in high-traffic locations, but the payback periods lengthen noticeably. For anyone on the fence, the clock is ticking.<Ref n={5} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Second, <strong className="text-text-primary">Tesla&rsquo;s business programs are creating a new class of charging entrepreneur.</strong> The Supercharger for Business model lowers the barrier to entry by handling everything from software integration to maintenance, while giving the host full revenue control. As more third-party sites go live (Suncoast Charging in Florida was the first, with more in the pipeline), expect a wave of gas station operators, convenience store chains, and commercial landlords adding fast charging to their properties.<Ref n={9} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Third, <strong className="text-text-primary">Charging-as-a-Service (CaaS) models are gaining traction.</strong> These let property owners skip the capital investment entirely by having a third party install, own, and operate the chargers, with the host receiving a revenue share or monthly fee. Fourth, <strong className="text-text-primary">fleet electrification is creating guaranteed demand.</strong> When Amazon, PepsiCo, FedEx, and UPS commit to electric delivery fleets, they need guaranteed charging capacity. Fleet charging contracts provide the kind of predictable, recurring revenue that makes infrastructure investors comfortable.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The numbers support the thesis from every angle: the market is growing 25%+ annually, utilization is rising even as capacity expands, Tesla has productized the entire operating model into a turnkey business, and the regulatory tailwinds are strong. Charging infrastructure isn&rsquo;t just keeping up with the transition to electric vehicles. It&rsquo;s becoming one of the most attractive infrastructure asset classes of the decade.
            </p>
          </ScrollReveal>

          {/* Bibliography */}
          <ScrollReveal>
            <div id="bibliography" className="mt-16 rounded-lg border border-black/5 bg-white p-6 md:p-8">
              <h3 className="font-heading text-lg font-bold tracking-tight text-text-primary">
                Sources &amp; Bibliography
              </h3>
              <div className="mt-6 flex flex-col divide-y divide-black/5">
                {BIBLIOGRAPHY.map((b) => (
                  <div key={b.n} className="flex gap-3 py-3 text-[13px] leading-relaxed text-text-secondary">
                    <span className="shrink-0 font-bold text-accent-green">[{b.n}]</span>
                    <span id={`ref${b.n}`}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </article>
      </main>
      <Footer />
    </>
  );
}

const BIBLIOGRAPHY = [
  { n: 1, text: 'Grand View Research, "Electric Vehicle Charging Infrastructure Market Report, 2033." $40.22B in 2025, projected $238.82B by 2033, CAGR 25.0%. grandviewresearch.com' },
  { n: 2, text: 'Precedence Research, "Electric Vehicle Charging Infrastructure Market Size to Hit USD 415.58 Bn by 2034." $47.61B in 2025, CAGR 27%. precedenceresearch.com' },
  { n: 3, text: 'EV Charging Stations, "Largest DC Fast-Charging Networks in the US: January 2026." 67,916 public DC fast ports; Tesla: 35,682 stalls (52.5%). evchargingstations.com' },
  { n: 4, text: 'InsideEVs, "Our Bruised Federal EV Charger Program Just Had A Comeback Year," 2025. NEVI: $5B allocated, $3.3B distributed. insideevs.com' },
  { n: 5, text: 'Kiplinger, "The Federal EV Charger Tax Credit: What to Know for 2025 and 2026." Section 30C: up to 30%, max $100K per property. Expires June 30, 2026. kiplinger.com' },
  { n: 6, text: 'Zecar, "Tesla Expands Global Supercharger Network by 18% in 2025." 8,182 stations, 77,682 connectors globally, Q4 2025. zecar.com' },
  { n: 7, text: 'Tesla, "Supercharger for Business." V4 hardware, 500 kW, 97% uptime guarantee, full-service management. tesla.com' },
  { n: 8, text: 'Not a Tesla App, "Tesla Begins Selling Superchargers to Businesses," September 2025. White-label and revenue model. notateslaapp.com' },
  { n: 9, text: 'Electrek, "Tesla deploys first Superchargers owned by 3rd-party in the US," November 2025. Suncoast Charging, Land O\'Lakes, FL. electrek.co' },
  { n: 10, text: 'TeslaNorth, "Tesla Adds 1,250+ Business Chargers Worldwide in Weeks," December 2025. Wall Connector for Business, $0.03/kWh fee. teslanorth.com' },
  { n: 11, text: 'EV Charging Stations, "Utilization of Tesla Superchargers Climbs to New High." Sessions per stall, 2019–2025; driver wait %. evchargingstations.com' },
  { n: 12, text: 'EV Charging Stations, "US Supercharger Usage Hits New Records During Thanksgiving 2025." 11.4 sessions per stall peak. evchargingstations.com' },
  { n: 13, text: 'EV Charging Stations, "Tesla Supercharging Network Delivered Record 6.7 TWh of Energy in 2025." Quarterly breakdown, 261 kWh/stall/day Q4, 52M sessions. evchargingstations.com' },
  { n: 14, text: 'Solidstudio, "EV Charging Station Profit Margin: How Much Can You Earn in 2025?" ROI, installation costs, margins. solidstudio.io' },
  { n: 15, text: 'EV Connect, "Are EV Charging Stations Profitable?" Revenue ranges, payback periods. evconnect.com' },
  { n: 16, text: 'FinancialContent/MarketMinute, "EVgo Hits Profitability Milestone: Q4 2025 Earnings," March 2026. financialcontent.com' },
  { n: 17, text: 'University of Maryland Center for Global Sustainability, "Home values increase with the rise in EV charging stations." 3.3% value increase in CA. umd.edu' },
  { n: 18, text: 'Pani, A. et al., "Impact of EV charging stations on spending at nearby businesses," Nature Communications, 2024. ~1.4% spending uplift within 100m. hypercharge.com' },
  { n: 19, text: 'InsideEVs, "America\'s Best And Worst EV Charging Networks." Tesla 4% issues, ChargePoint 21%, Electrify America 35%. insideevs.com' },
  { n: 20, text: 'Terawatt Infrastructure, "How the Real Estate Sector Can Capitalize on EV Charging." Fleet hubs, REIT opportunities. terawattinfrastructure.com' },
  { n: 21, text: 'CBRE, "How Leasing EV Charging Infrastructure Can Improve Asset Value and the Bottom Line," 2025. cbre.com' },
];
