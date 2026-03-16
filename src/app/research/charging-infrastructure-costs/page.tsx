"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ResearchArticleByline,
  ResearchArticleHero,
  RelatedArticles,
} from "@/components/research/ResearchArticleShell";
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

function buildChargerCostChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["50 kW DCFC", "150 kW DCFC", "350 kW DCFC"],
      datasets: [
        {
          label: "Hardware Cost",
          data: [30000, 81000, 140000],
          backgroundColor: [C.grey3, C.greenMid, C.green],
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
        x: { grid: { display: false }, ticks: { color: C.dark } },
      },
    },
  });
}

function buildGridUpgradeChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Utility Service\nExtension",
        "Transformer\n(150-300 kVA)",
        "Transformer\n(500-750 kVA)",
        "Transformer\n(1000+ kVA)",
        "Secondary\nDistribution",
        "Primary\nDistribution",
        "Substation\nUpgrade",
      ],
      datasets: [
        {
          label: "Cost",
          data: [17500, 44000, 56800, 119500, 150000, 6000000, 5000000],
          backgroundColor: [C.grey3, C.greenMid, C.greenMid, C.green, C.grey1, C.diesel, C.diesel],
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
            label: (c) => "$" + Number(c.raw).toLocaleString(),
          },
        },
      },
      scales: {
        y: {
          type: "logarithmic",
          ticks: {
            color: C.muted,
            callback(v) {
              const n = Number(v);
              if (n >= 1000000) return "$" + n / 1000000 + "M";
              if (n >= 1000) return "$" + n / 1000 + "k";
              return "$" + n;
            },
          },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { size: 10 } } },
      },
    },
  });
}

function buildEnergyRateChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Off-Peak", "Super Off-Peak", "On-Peak"],
      datasets: [
        { label: "Time-of-Day Rate", data: [0.105, 0.074, 0.156], backgroundColor: C.green, borderRadius: 3, borderSkipped: false },
        { label: "General Service Rate", data: [0.108, 0.108, 0.108], backgroundColor: C.grey1, borderRadius: 3, borderSkipped: false },
        { label: "Commercial EV Rate", data: [0.061, 0.061, 0.061], backgroundColor: C.greenMid, borderRadius: 3, borderSkipped: false },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { position: "top", labels: { usePointStyle: true, padding: 16, color: C.dark } },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => "$" + Number(c.raw).toFixed(3) + "/kWh" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => "$" + Number(v).toFixed(3), color: C.muted },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark } },
      },
    },
  });
}

function buildDemandChargeChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "5 trucks\n(150 kW)",
        "10 trucks\n(150 kW)",
        "20 trucks\n(150 kW)",
        "5 trucks\n(350 kW)",
        "10 trucks\n(350 kW)",
        "20 trucks\n(350 kW)",
      ],
      datasets: [
        {
          label: "Monthly Demand Charge",
          data: [6375, 12750, 25500, 14875, 29750, 59500],
          backgroundColor: [C.grey3, C.grey3, C.grey3, C.greenMid, C.greenMid, C.greenMid],
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
          callbacks: { label: (c) => "$" + Number(c.raw).toLocaleString() + "/month" },
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

function buildScaleChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: ["1", "5", "10", "20", "50", "100"],
      datasets: [
        { label: "MD Trucks (50% utilization)", data: [63000, 32000, 21000, 16000, 12000, 10000], borderColor: C.green, backgroundColor: "rgba(168,216,50,0.1)", fill: true, tension: 0.3, pointRadius: 4 },
        { label: "MD Trucks (25% utilization)", data: [85000, 50000, 43000, 34000, 26000, 22000], borderColor: C.grey1, backgroundColor: "rgba(136,136,136,0.1)", fill: true, tension: 0.3, pointRadius: 4 },
        { label: "MD Trucks (10% utilization)", data: [130000, 95000, 90000, 75000, 55000, 48000], borderColor: C.diesel, backgroundColor: "rgba(102,102,102,0.1)", fill: true, tension: 0.3, pointRadius: 4 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { position: "top", labels: { usePointStyle: true, padding: 16, color: C.dark } },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => c.dataset.label + ": $" + Number(c.raw).toLocaleString() },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => "$" + Number(v) / 1000 + "k", color: C.muted },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { title: { display: true, text: "Fleet Size (vehicles)", color: C.muted }, grid: { display: false }, ticks: { color: C.dark } },
      },
    },
  });
}

function buildSolutionsChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Managed Charging\n(off-peak scheduling)",
        "On-Site Solar\n(rooftop)",
        "Battery Storage\n(peak shaving)",
        "Commercial EV\nRate Enrollment",
        "Federal Tax\nCredits (§30C)",
      ],
      datasets: [
        {
          label: "Estimated Annual Savings",
          data: [36000, 28000, 24000, 18000, 10000],
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
          callbacks: { label: (c) => "$" + Number(c.raw).toLocaleString() + "/year" },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { callback: (v) => "$" + Number(v) / 1000 + "k", color: C.muted },
          grid: { display: false },
        },
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

export default function ChargingInfrastructureArticle() {
  const [reportEmail, setReportEmail] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  return (
    <>
      <Navbar />
      <main className="bg-bg-base">
        <ResearchArticleHero
          eyebrow="Infrastructure Deep Dive"
          title="Who Picks Up the Tab? EV Charging Infrastructure in Industrial Real Estate"
          description="The chargers, transformers, and grid upgrades behind every electric truck fleet can cost as much as the trucks themselves. So who pays?"
          imageSrc="/images/2article1.jpg"
          imageAlt="EV charging infrastructure at industrial depot"
          imageClassName="object-cover object-left-top"
        />

        <ResearchArticleByline
          authorName="Charlie Wheeler"
          date="March 15, 2026"
          readTime="15 min read"
        />

        <article className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-14 md:px-12 md:py-20">
          {/* Section 1: The Bill Nobody Talks About */}
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              The Bill Nobody Talks About
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              Charging infrastructure can cost as much as the trucks. And nobody&rsquo;s figured out who pays for it yet.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The conversation around electric trucks centers on the vehicle: range, efficiency, sticker price. But there&rsquo;s a second cost that gets ignored — the infrastructure required to actually charge them. Chargers, electrical work, transformer upgrades, utility service extensions, and ongoing energy and demand charges. The NACFE puts it plainly: &ldquo;charging infrastructure is just one part of a system integrating your vehicle needs, electricity rate structure, and the timing and cost of bringing additional electricity to your site.&rdquo;<Ref n={3} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              For a small pilot, the costs are manageable. But as fleets scale from 5 trucks to 50, the math changes fast. And that&rsquo;s where this gets interesting for real estate: charging infrastructure is becoming a lease-negotiation issue.
            </p>
          </ScrollReveal>

          <hr className="my-12 border-black/5" />

          {/* Section 2: What Charging Infrastructure Actually Costs */}
          <div id="costs">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              What Charging Infrastructure Actually Costs
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              The Drive Electric Minnesota coalition breaks total cost into four categories: upfront hardware, electricity upgrades, energy charges, and demand charges.<Ref n={1} /> Each one scales differently, and each one hits a different party&rsquo;s balance sheet.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <h3 className="mt-8 text-[17px] font-bold text-text-primary">1. Charger Hardware</h3>
            <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
              The charger is the most visible cost, but it varies wildly by power level. Level 2 (AC) chargers work for lighter vehicles returning to base overnight: $2,700–$24,000 per unit.<Ref n={1} /> Class 7 and 8 trucks need DC fast chargers (DCFCs), which run $28,000–$150,000 per charger plus $18,000–$138,000 in installation.<Ref n={1} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              UC Davis modeled specific hardware costs at three power tiers: $30,000 for 50 kW, $81,000 for 150 kW, and $140,000 for 350 kW (in ~2018 dollars; current pricing is likely 20–30% higher).<Ref n={4} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Even more powerful Megawatt Charging Systems (MCS) are hitting the market now. Tesla&rsquo;s Megacharger network, ChargePoint&rsquo;s MCS launch, and Kempower&rsquo;s 1.2 MW units all went live in 2026. These are purpose-built for heavy-duty long-haul trucks like the Tesla Semi and Daimler eActros 600.
            </p>
          </ScrollReveal>
          </div>

          <ChartCard
            title="DC Fast Charger Costs by Power Level"
            subtitle="Hardware cost per unit. Installation, trenching, and electrical work are additional. [4]"
          >
            <AnimatedChart id="chargerCostChart" build={buildChargerCostChart} />
          </ChartCard>

          <ScrollReveal>
            <h3 className="mt-8 text-[17px] font-bold text-text-primary">2. Electrical Upgrades</h3>
            <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
              This is where costs escalate. Adding high-power chargers to a building&rsquo;s electrical system often means panel upgrades, new conduits, trenching, and transformer replacements. The scope depends on what the facility already has and how much load you&rsquo;re adding.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Worst case, the California Electric Transportation Coalition estimates grid-side upgrades at a large site could run $150,000 up to $6–9 million.<Ref n={1} /> But real-world deployments come in much lower. NACFE&rsquo;s Run on Less study tracked fleets like Schneider (92 trucks) and NFI (50 trucks) deploying at scale without hitting those extremes.<Ref n={3} /> ICCT&rsquo;s 2025 analysis found total utility-side costs of $2.5–$2.9 million across sites, but with utility incentive programs and cost-sharing, fleets typically pay $150,000–$500,000.<Ref n={10} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              UC Davis found transformer costs range from $44,000 for smaller units to $119,500 for larger ones (~2018 dollars; adjusted for inflation, $53,000–$143,000 in 2026).<Ref n={4} /> Utility service extension adds $17,500 as a base cost plus $3,500 per charger beyond five.<Ref n={4} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The good news: many utilities now offer &ldquo;make-ready&rdquo; programs covering 50–100% of the infrastructure work on the building&rsquo;s side. That shifts a huge chunk of the burden off building owners and tenants.
            </p>
          </ScrollReveal>

          <ChartCard
            title="Potential Grid Upgrade Costs"
            subtitle="Theoretical maximum costs at a high-demand CA site. Utility make-ready programs often cover 50–100% of distribution/substation upgrades. [1][4]"
          >
            <AnimatedChart id="gridUpgradeChart" build={buildGridUpgradeChart} />
          </ChartCard>

          <ScrollReveal>
            <h3 className="mt-8 text-[17px] font-bold text-text-primary">3. Energy Charges</h3>
            <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
              Electricity costs vary by region, utility, and time of day. UC Davis uses a California commercial rate of $0.20/kWh as its baseline.<Ref n={4} /> But time-of-use (TOU) and EV-specific commercial rates create real savings. Minnesota Power&rsquo;s commercial EV rate drops to $0.061/kWh off-peak vs. $0.156/kWh on-peak — a 2.5x differential.<Ref n={1} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Smart charging software schedules vehicles to charge during off-peak windows automatically. NACFE says managed charging &ldquo;should be used to control electricity costs&rdquo; and can pay for itself through energy savings alone.<Ref n={3} />
            </p>
          </ScrollReveal>

          <ChartCard
            title="Electricity Rates: Time-of-Use vs. Standard (Minnesota Power)"
            subtitle="Choosing the right rate structure can cut charging costs by more than half. [1]"
          >
            <AnimatedChart id="energyRateChart" build={buildEnergyRateChart} />
          </ChartCard>

          <ScrollReveal>
            <h3 className="mt-8 text-[17px] font-bold text-text-primary">4. Maintenance & Networking</h3>
            <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
              Chargers need upkeep. Basic maintenance runs up to $400/year for L2 and over $800 for DCFCs.<Ref n={1} /> But the realistic number for commercial fleet operations is $2,500–$3,000+ per year per DCFC, including networking fees, software subscriptions, and service contracts.<Ref n={4} />
            </p>
          </ScrollReveal>

          <hr className="my-12 border-black/5" />

          {/* Section 3: Demand Charges */}
          <div id="demand">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              Demand Charges: The Biggest Surprise on the Bill
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              Of all charging costs, demand charges are the one that catches operators off guard.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Unlike energy charges (based on total electricity consumed), demand charges are based on the highest power draw during any 15-minute window in a billing cycle. One peak sets the demand charge for the entire month. Rates run $10–$20+/kW, and without management, they can become the largest line item on a fleet&rsquo;s electricity bill.<Ref n={1} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Here&rsquo;s how it works: say your utility has a 500 kW demand threshold and charges $20/kW for overages. Two trucks charge at 300 kW simultaneously. The combined 600 kW draw exceeds the threshold by 100 kW, setting a demand charge of $2,000 for the entire month. The key word is &ldquo;sets.&rdquo; One overlapping session spikes the bill. Staggered or managed charging can eliminate this almost entirely.<Ref n={1} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              In California, commercial demand charges historically averaged around $17/kW per month, though the landscape is changing fast.<Ref n={4} /> Many California utilities have moved to subscription-based EV rates that replace traditional demand charges: PG&E&rsquo;s BEV2 rate offers roughly $6.60/kW equivalent for loads above 150 kW, and SCE&rsquo;s EV-TOU rates eliminated demand charges through at least 2029.<Ref n={11} /> Outside California, traditional $10–$20+/kW charges remain common.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              For a depot running 10 heavy-duty trucks on 350 kW chargers without management, peak demand could hit 1,500–2,000 kW. That translates to $25,000–$34,000 per month under legacy rate structures. But real-world fleets using managed charging and staggered scheduling keep peaks at 50–70% of theoretical max. PepsiCo&rsquo;s Sacramento site (21 Semis, 3 MW service) uses managed charging and reports roughly 40% demand-charge reduction. Real fleets consistently report 40–80% savings through active load management.<Ref n={3} />
            </p>
          </ScrollReveal>
          </div>

          <ChartCard
            title="How Demand Charges Scale with Fleet Size"
            subtitle="Unmanaged worst-case demand charges at $17/kW (CA avg). Managed charging can reduce these by 50–80%. [4]"
          >
            <AnimatedChart id="demandChargeChart" build={buildDemandChargeChart} />
          </ChartCard>

          <Callout>
            <strong className="text-text-primary">Why this matters for leases:</strong> Demand charges are billed to whoever holds the utility account — usually the building owner or landlord. If a tenant installs EV chargers and creates high peak-demand events, demand charges spike for the entire facility, including loads unrelated to EV charging. That makes demand management a shared problem between landlords and tenants, and it&rsquo;s one of the main reasons charging infrastructure is becoming a lease-negotiation issue.
          </Callout>

          <hr className="my-12 border-black/5" />

          {/* Section 4: Who Pays */}
          <div id="whopays">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              Who Pays: Landlords, Tenants, or Someone Else?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              This is the question at the center of every new industrial lease negotiation involving electric fleets. The answer depends on the cost type, the lease structure, and whether third parties are involved.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The NACFE&rsquo;s implementation roadmap lists &ldquo;consult with key stakeholders early and often&rdquo; as step two, and specifically includes the landlord alongside the utility and truck manufacturer.<Ref n={3} /> Their guidance is direct: &ldquo;If you do not own your facility, talk with your landlord early.&rdquo;<Ref n={3} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              EV charging infrastructure doesn&rsquo;t fit neatly into traditional real estate cost categories:
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <div className="my-10 overflow-x-auto rounded-lg border border-black/5">
              <table className="w-full min-w-[640px] text-left text-[13px]">
                <thead>
                  <tr className="bg-accent-green text-white">
                    <th className="px-4 py-3 font-semibold">Cost Component</th>
                    <th className="px-4 py-3 font-semibold">Typical Range</th>
                    <th className="px-4 py-3 font-semibold">Who Typically Pays</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { component: "Charger hardware", range: "$28K–$150K per unit", who: "Tenant (portable, leaves with fleet)" },
                    { component: "Installation (trenching, conduit, panels)", range: "$18K–$138K per unit", who: "Negotiated (often TI allowance)" },
                    { component: "Transformer upgrade", range: "$53K–$143K (2026 est.)", who: "Landlord via TI allowance or amortized into rent (stays with building)" },
                    { component: "Utility service extension", range: "$17.5K–$35K+", who: "Utility make-ready program (50–100% covered) or landlord" },
                    { component: "Grid distribution upgrade", range: "$150K–$500K typical", who: "Utility (often 50%+ via make-ready/incentive programs)" },
                    { component: "Energy charges", range: "$0.06–$0.20/kWh", who: "Tenant (operational cost, passed through in NNN leases)" },
                    { component: "Demand charges", range: "$10–$20+/kW/mo", who: "Tenant via pass-through (NNN lease) or landlord (gross lease)" },
                    { component: "Annual maintenance", range: "$800–$2,500/unit", who: "Tenant or CaaS provider" },
                  ].map((r, i) => (
                    <tr key={r.component} className={`border-t border-black/5 ${i % 2 === 1 ? "bg-bg-surface" : ""}`}>
                      <td className="px-4 py-3 text-text-secondary">{r.component}</td>
                      <td className="px-4 py-3 font-semibold text-accent-green">{r.range}</td>
                      <td className="px-4 py-3 text-text-secondary">{r.who}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              Most industrial leases are triple-net (NNN), so demand charges and energy costs pass directly to the tenant. Permanent electrical upgrades (transformers, panels, wiring) are trickier: TI allowances typically cover 50–100%, and landlords increasingly fold the rest into higher rent (5–10% premiums for EV-ready sites).
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The real question is whether these upgrades add value or become dead weight. A $140,000 transformer upgrade makes sense if the next tenant also needs high-power capacity. If they don&rsquo;t, it&rsquo;s stranded capital. Prologis is making a clear bet: the company is building new facilities with &ldquo;solar-ready roofs, electric vehicle-ready wiring, and microgrid-ready electrical switchgear&rdquo; as standard features — not tenant-specific upgrades.<Ref n={6} /> Their view is that power-ready buildings will command premium rents as electrification accelerates, and EV-ready capacity will be as expected as loading docks.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              There&rsquo;s also a growing role for third-party models. Charging as a Service (CaaS) providers invest in all the charging assets — hardware, installation, energy management — and charge the fleet operator a per-kWh or monthly fee. This removes the capital expense from both the landlord and the tenant.<Ref n={3} /> Trucking as a Service (TaaS) takes it further by bundling the vehicle and the charging together, so the fleet operator simply reserves a charged truck at a specified time.<Ref n={3} />
            </p>
          </ScrollReveal>

          <Quote
            text="You want to try to future proof that infrastructure as much as possible while at the same time right sizing it."
            attribution={
              <>
                Ramiro Lepe, Medium & Heavy Duty Transportation Electrification Sr. Advisor, Southern California Edison<Ref n={3} />
              </>
            }
          />
          </div>

          <hr className="my-12 border-black/5" />

          {/* Section 5: How Costs Change as Fleets Grow */}
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              How Costs Change as Fleets Grow
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              Per-vehicle infrastructure costs drop as fleet size increases — but only to a point.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              For medium-duty delivery trucks using 150 kW chargers at 50% utilization, per-vehicle infrastructure costs fall from roughly $90,000 (at 10% utilization) to $28,000 (at 50% utilization) for a 20-truck fleet.<Ref n={4} /> The cost curve flattens after about 50 vehicles for medium-duty and 10 vehicles for heavy-duty fleets. The biggest savings come from the first wave of scaling.<Ref n={4} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Real-world fleets are also reducing charger counts through higher utilization. NACFE data shows operators achieving 3:1 to 5:1 truck-to-charger ratios — US Foods runs 30 trucks on 6 chargers — pushing per-vehicle costs to $15,000–$20,000 at scale.
            </p>
          </ScrollReveal>

          <ChartCard
            title="Per-Vehicle Infrastructure Cost by Fleet Size (150 kW Chargers)"
            subtitle="Costs decline sharply with scale, but depend heavily on charger utilization rates. [4]"
          >
            <AnimatedChart id="scaleChart" build={buildScaleChart} />
          </ChartCard>

          <ScrollReveal>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              Utilization is the leverage point. Public fast chargers averaged just 1.8 hours of use per day in 2020, but that number doesn&rsquo;t matter for fleet depots where operators control the schedule.<Ref n={4} /> By 2026, well-managed depots run their chargers 6–12 hours per day (25–50% utilization), with smart charging software pushing some operations above 60%.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              UC Davis found that while infrastructure costs are real up front, they&rsquo;re ultimately dwarfed by ongoing electricity costs. For a fleet of 10 medium-duty delivery trucks, yearly per-vehicle cost (infrastructure + energy + maintenance) drops from $63,000 (1 truck) to $21,000 (10 trucks), with electricity making up the biggest share at scale.<Ref n={4} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The takeaway: for 20 medium-duty trucks using 150 kW chargers, improving utilization from 10% to 50% cuts per-vehicle infrastructure costs from $90,000 to $28,000. Managed charging software that optimizes vehicle scheduling is one of the highest-ROI investments a fleet can make.<Ref n={4} />
            </p>
          </ScrollReveal>

          <hr className="my-12 border-black/5" />

          {/* Section 6: How Smart Operators Are Cutting Costs */}
          <div id="solutions">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              How Smart Operators Are Cutting Costs
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              The costs are real, but they&rsquo;re not fixed. Here&rsquo;s what&rsquo;s actually working:
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              <strong className="text-text-primary">Managed charging</strong> is the easiest win. Smart chargers connected to energy management software stagger vehicle charging to avoid simultaneous draws, cutting peak demand and the associated charges. They also shift charging to off-peak hours. Minnesota Power&rsquo;s data shows this alone cuts energy costs by more than half.<Ref n={1} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              <strong className="text-text-primary">On-site solar and battery storage</strong> hit both energy costs and demand charges. Solar generates power during the day when rates are high; battery storage captures it for overnight charging or shaves peak demand during simultaneous charging events. Prologis reports that in several U.S. regions, their warehouse rooftop solar arrays generate more electricity than the building consumes, with excess sold back to the grid.<Ref n={6} /> The company passed 1 GW of deployed solar and battery storage capacity in early 2026, making it one of the largest commercial solar operators in the country.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              <strong className="text-text-primary">Utility engagement</strong> shows up in every source as essential. The NACFE report: &ldquo;It is essential that you meet in person with your utility as soon as you begin thinking about electric trucks.&rdquo;<Ref n={3} /> Utilities often share upgrade costs, and many offer commercial EV rates or demand charge waivers during early adoption. As Oncor&rsquo;s Jennifer Deaton put it: &ldquo;The more information we have from the customers on what their 5-10-15 year electrification plans are, the more equipped that utility is to have those proactive conversations and try to make good EV rates.&rdquo;<Ref n={3} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              <strong className="text-text-primary">Federal and state incentives</strong> cover real money. The IRS Alternative Fuel Vehicle Refueling Property Tax Credit provides rebates up to $100,000 per qualified property for fleets installing EV charging equipment in eligible census tracts.<Ref n={1} /> State programs like California&rsquo;s HVIP and CORE vouchers stack on top.
            </p>
          </ScrollReveal>

          <ChartCard
            title="Cost Reduction Strategies and Estimated Impact"
            subtitle="Estimated annual savings for a 20-truck depot. Strategies are cumulative."
          >
            <AnimatedChart id="solutionsChart" build={buildSolutionsChart} />
          </ChartCard>
          </div>

          <hr className="my-12 border-black/5" />

          {/* Section 7: The Infrastructure Is the Investment */}
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
              The Infrastructure Is the Investment
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
              California alone will need an estimated 151,000–156,000 chargers (depot and public) by 2030, rising to 434,000–460,000 by 2035 according to ICCT and CEC projections.<Ref n={5} /> Roughly 85–90% will be depot chargers at private facilities — most of which are leased industrial properties. The remaining 10–15% will be en-route and public corridor hubs, growing as the National Zero-Emission Freight Corridor Strategy adds new sites through 2027.<Ref n={5} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              For building owners, the question is shifting from &ldquo;should I invest in electrical capacity&rdquo; to &ldquo;can I afford not to.&rdquo; Prologis research shows automation, electrification, and AI are pushing warehouse power requirements 3–5x higher than traditional facilities, with 76% of supply chain leaders expecting a 10–50% rise in energy needs over the next five years.<Ref n={9} /> They&rsquo;re already building new warehouses with EV-ready wiring, solar-ready roofs, and advanced electrical systems as standard. &ldquo;Customers and communities,&rdquo; they note, &ldquo;are interested in industrial properties that are future-proof.&rdquo;<Ref n={6} />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              For fleet operators, the playbook is clear: start with a utility conversation, invest in managed charging software, design for higher charger utilization, and look at CaaS models that reduce upfront capital. The costs are real, but with the right planning, they&rsquo;re manageable.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              The bigger picture is this: electrical capacity is becoming one of the defining features of industrial real estate. The landlords and developers building that capacity now aren&rsquo;t just accommodating today&rsquo;s tenants. They&rsquo;re positioning for a market where every logistics tenant will need serious power, and the buildings that have it will win.
            </p>
          </ScrollReveal>

          {/* Download Full Report */}
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

          {/* Bibliography */}
          <ScrollReveal>
            <div className="rounded-lg border border-black/5 bg-white p-6 md:p-8">
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
      <RelatedArticles currentHref="/research/charging-infrastructure-costs" />
      <Footer />
    </>
  );
}

const BIBLIOGRAPHY = [
  { n: 1, text: 'Drive Electric Minnesota (Great Plains Institute), "Four Infrastructure Costs to Consider When Electrifying Medium and Heavy-Duty Fleets." driveelectricmn.org' },
  { n: 2, text: 'International Council on Clean Transportation (ICCT), "Charging Solutions for Battery-Electric Trucks," December 2022. theicct.org' },
  { n: 3, text: 'North American Council for Freight Efficiency (NACFE) and Rocky Mountain Institute (RMI), "Charging Forward with Electric Trucks: Guidance Report," 2023. nacfe.org' },
  { n: 4, text: 'Wang, G., Miller, M.R., and Fulton, L.M., "The Infrastructure Cost for Depot Charging of Battery Electric Trucks," UC Davis Institute of Transportation Studies, October 26, 2023. Reference No. UCD-ITS-RR-23-63.' },
  { n: 5, text: 'Powell, B., Johnson, C., Yip, A., and Snelling, A., "Electric Medium- and Heavy-Duty Vehicle Charging Infrastructure Attributes and Development," National Renewable Energy Laboratory (NREL), November 2024. NREL/TP-5R00-91571. nrel.gov' },
  { n: 6, text: 'Prologis Energy, "The Energy Transformation in Logistics Real Estate," August 2025. prologis.com' },
  { n: 7, text: 'Rocky Mountain Institute (RMI), "How Electric Truck Fleets Can Save Money with Smarter Charging, Solar Power, and Batteries." rmi.org' },
  { n: 8, text: 'California Electric Transportation Coalition (CalETC), "The Infrastructure Needs and Costs for 5 Million Light-Duty Electric Vehicles in California by 2030," June 2020. caletc.com' },
  { n: 9, text: 'Prologis Research, "Supply Chain 3.0: New Strides in Risk Readiness," January 8, 2026. prologis.com/insights-news/research/supply-chain-30-new-strides-risk-readiness' },
  { n: 10, text: 'International Council on Clean Transportation (ICCT), "The Cost of Energizing Medium- and Heavy-Duty Truck Charging Facilities in the US," October 31, 2025. theicct.org' },
  { n: 11, text: 'Pacific Gas and Electric Company (PG&E), "Business Electric Vehicle Rate Schedule BEV," 2026; Southern California Edison (SCE), "Electric Vehicle Rate Plans," 2026. pge.com, sce.com' },
];
