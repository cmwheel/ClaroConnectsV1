"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
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
  teslaBlue: "#3b82f6",
  waymoGreen: "#10b981",
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

function buildFleetChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Waymo (Global)", "Waymo (SF)", "Tesla (Active)", "Tesla (CA Registered)", "Cybercab (Test Units)"],
      datasets: [{
        label: "Vehicles",
        data: [2750, 1000, 400, 1655, 30],
        backgroundColor: [C.waymoGreen, "#6ee7b7", C.teslaBlue, "#93c5fd", "#c4b5fd"],
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => `${Number(c.raw).toLocaleString()} vehicles` },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => Number(v).toLocaleString(), color: C.muted },
          title: { display: true, text: "Active Vehicles" },
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
      labels: ["Uber Robotaxi\nCharging Stations", "Waymo SF\nDepot Buildout", "Tesla Wireless\nCharging (Cybercab)", "Tesla SF Robotic\nCharging (Cancelled)"],
      datasets: [{
        label: "Investment/Activity",
        data: [100, 50, 25, 0],
        backgroundColor: ["#1a1a1a", C.waymoGreen, C.teslaBlue, "#cbd5e1"],
        borderRadius: 6,
        borderSkipped: false,
      }],
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
            label: (c) => {
              if (c.dataIndex === 3) return "Project cancelled";
              if (c.dataIndex === 1 || c.dataIndex === 2) return "Estimated $" + c.raw + "M+";
              return "$" + c.raw + "M committed";
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Investment ($ Millions, estimated)" },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { size: 10 } } },
      },
    },
  });
}

function buildPricingChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Tesla", "Lyft", "Uber", "Waymo"],
      datasets: [{
        label: "Average Price",
        data: [8.17, 15.47, 17.47, 19.69],
        backgroundColor: [C.teslaBlue, "#ff00bf", "#1a1a1a", C.waymoGreen],
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => "$" + Number(c.raw).toFixed(2) + " average" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => "$" + v, color: C.muted },
          title: { display: true, text: "Average Ride Price (USD)" },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark } },
      },
    },
  });
}

function buildPpkChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Tesla", "Lyft", "Uber", "Waymo"],
      datasets: [{
        label: "Avg $/mile",
        data: [3.2, 6.7, 7.47, 9.21],
        backgroundColor: [C.teslaBlue, "#ff00bf", "#1a1a1a", C.waymoGreen],
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => "$" + Number(c.raw).toFixed(2) + " per mile" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => "$" + Number(v).toFixed(2), color: C.muted },
          title: { display: true, text: "Price Per Mile (USD)" },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark } },
      },
    },
  });
}

function buildArkChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Robotaxi Business (60%)", "Electric Vehicles (32%)", "Other (Energy, AI, etc.) (8%)"],
      datasets: [{
        data: [60, 32, 8],
        backgroundColor: ["#7c3aed", C.teslaBlue, "#94a3b8"],
        borderWidth: 2,
        borderColor: "#fff",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: {
          position: "bottom",
          labels: { padding: 16, usePointStyle: true, color: C.dark },
        },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => (c.label || "") + " of expected enterprise value" },
        },
      },
    },
  });
}

function buildMarketChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: ["2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"],
      datasets: [{
        label: "Market Size ($B)",
        data: [0.789, 1.8, 4.2, 9.5, 18.7, 33, 52, 73, 96.9],
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124, 58, 237, 0.08)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#7c3aed",
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 3,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => "$" + Number(c.raw).toFixed(1) + " billion" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => "$" + v + "B", color: C.muted },
          title: { display: true, text: "Market Size (USD Billions)" },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark } },
      },
    },
  });
}

function buildComfortChart(ctx: CanvasRenderingContext2D) {
  chartDefaults();
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Very\nComfortable", "Somewhat\nComfortable", "Neutral", "Somewhat\nUncomfortable", "Very\nUncomfortable"],
      datasets: [
        {
          label: "2026 Survey",
          data: [35.4, 27.6, 20.6, 9.7, 6.7],
          backgroundColor: C.waymoGreen,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: "2025 Survey",
          data: [14, 21, 30, 18, 17],
          backgroundColor: "#94a3b8",
          borderRadius: 6,
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
          labels: { usePointStyle: true, padding: 16, color: C.dark },
        },
        tooltip: {
          backgroundColor: C.dark,
          callbacks: { label: (c) => (c.dataset.label || "") + ": " + c.raw + "%" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => v + "%", color: C.muted },
          title: { display: true, text: "% of Respondents" },
          grid: { color: "rgba(0,0,0,0.04)" },
        },
        x: { grid: { display: false }, ticks: { color: C.dark, font: { size: 10 } } },
      },
    },
  });
}

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
  source,
  children,
}: {
  title: string;
  subtitle?: string;
  source?: string;
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
          {source && (
            <p className="mt-3 text-right text-[11px] text-text-secondary">{source}</p>
          )}
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

function ComparisonCard({
  variant,
  title,
  children,
}: {
  variant: "waymo" | "tesla";
  title: string;
  children: React.ReactNode;
}) {
  const borderColor = variant === "waymo" ? "border-[#10b981]" : "border-[#3b82f6]";
  const bgClass = variant === "waymo"
    ? "bg-gradient-to-br from-[#ecfdf5] to-[#f0fdf4]"
    : "bg-gradient-to-br from-[#eff6ff] to-[#f0f9ff]";
  const titleColor = variant === "waymo" ? "text-[#059669]" : "text-[#3b82f6]";
  return (
    <div className={`rounded-lg border-l-4 ${borderColor} ${bgClass} border border-black/5 p-5`}>
      <h4 className={`font-heading text-sm font-bold ${titleColor}`}>{title}</h4>
      <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-text-secondary">
        {children}
      </div>
    </div>
  );
}

const TOC_LINKS = [
  { href: "#fleet-scale", label: "Fleet Scale & Deployment: A Reality Check" },
  { href: "#depot", label: "The Depot Question: Physical Infrastructure Behind Autonomous Fleets" },
  { href: "#charging", label: "Charging Infrastructure: Who's Actually Building It" },
  { href: "#scaling", label: "Scaling Strategies: Geo-Fenced Expansion vs. Software-First" },
  { href: "#pricing", label: "Pricing & the Economics of Autonomy" },
  { href: "#market", label: "Market Projections & the Infrastructure Investment Thesis" },
  { href: "#academic", label: "Lessons from Academic Research on Scaling" },
];

export default function TeslaVsWaymoArticle() {
  return (
    <>
      <Navbar />
      <main className="bg-bg-base">
        <ResearchArticleHero
          eyebrow="RoboTaxi Infrastructure"
          title="Tesla vs. Waymo: Two Roads to Scaling Autonomous Fleets"
          description="An infrastructure-focused analysis of how two fundamentally different approaches to autonomy are shaping the future of fleet charging, servicing, and real estate."
          imageSrc="/images/waymo-depot.jpg"
          imageAlt="Waymo depot and autonomous fleet infrastructure"
          imageClassName="object-cover object-center"
        />

        <ResearchArticleByline
          authorName="Charlie Wheeler"
          date="March 2026"
          readTime="25 min read"
        />

        <article className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-14 md:px-12 md:py-20">
          <ScrollReveal>
            <nav className="my-10 rounded-lg border border-black/5 bg-bg-surface px-6 py-5 md:px-8">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
                In This Article
              </h3>
              <ol className="mt-4 list-none space-y-2 pl-0">
                {TOC_LINKS.map((link, i) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-baseline gap-3 text-[15px] text-text-primary no-underline hover:text-accent-green"
                    >
                      <span className="text-[11px] font-bold text-accent-green">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="text-[15px] leading-[1.8] text-text-secondary">
              The autonomous vehicle industry has reached an inflection point. Two companies &mdash; Waymo and Tesla &mdash; are pursuing radically different strategies to put self-driving cars on public roads at scale. But while most coverage focuses on the software and sensor debates, a less visible battle is playing out beneath the surface: the fight to build the physical infrastructure that autonomous fleets require to operate.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
              Depots, charging stations, maintenance bays, remote operations centers &mdash; these are the &ldquo;real estate&rdquo; of autonomy. Waymo&rsquo;s depot-heavy expansion contrasts with Tesla&rsquo;s in-house fleet scaling (now transitioning from existing Superchargers and Service Centers to purpose-built &ldquo;Mothership&rdquo; hubs as the Cybercab enters production). Both paths create real infrastructure demands. This article examines both through a data-driven, infrastructure-first lens, drawing on Obi&rsquo;s pricing data, Waymo&rsquo;s public filings, academic literature, and industry reporting.
            </p>
          </ScrollReveal>

          <hr className="my-12 border-black/5" />

          {/* Section 1: Fleet Scale */}
          <section id="fleet-scale">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                Section 01
              </p>
              <h2 className="font-heading mt-2 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                Fleet Scale & Deployment: A Reality Check
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                The gap between Waymo and Tesla in terms of actual fleet deployment is significant. Waymo currently operates approximately 2,500&ndash;3,000 autonomous vehicles across multiple U.S. cities (sources vary), completing an estimated 400,000&ndash;450,000 weekly paid rides as of late 2025/early 2026 data, and is on track for over 1 million weekly rides by end of 2026.<Ref n={1} /> These are fully driverless trips &mdash; no safety driver behind the wheel &mdash; running 24 hours a day in complex urban environments including San Francisco, Phoenix, Los Angeles, Austin, and Atlanta.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                Tesla, by comparison, launched its supervised robotaxi service (with safety monitors) in Austin in June 2025 and expanded to the San Francisco Bay Area shortly after.<Ref n={2} /> As of March 2026, community trackers show approximately 400 active Tesla robotaxis &mdash; roughly 355 in the Bay Area and 45 in Austin<Ref n={14} /> &mdash; though Tesla&rsquo;s own CPUC filings indicate 1,655 vehicles registered for supervised operation in California alone, suggesting substantial capacity that hasn&rsquo;t yet been activated.<Ref n={15} /> The gap between registered and active vehicles is a recurring point of debate. The current active fleet primarily consists of company-owned modified Model Ys, with unsupervised operation still limited to a handful of vehicles in Austin (as few as 4&ndash;8 active unsupervised units as of mid-March 2026).<Ref n={16} /> Meanwhile, over 25&ndash;30 Cybercab test units have been spotted at Giga Texas, with the first production unit rolling off the line in February 2026 and mass production targeting April 2026.<Ref n={17} />
              </p>
            </ScrollReveal>

            <ChartCard
              title="Fleet Deployment Comparison: Waymo vs. Tesla"
              subtitle="Active vehicles in service, early 2026"
              source="Sources: Waymo public statements; Basenor Robotaxi Tracker (Mar 2026); Tesla CPUC filings; Teslarati/drone footage"
            >
              <AnimatedChart id="fleetChart" build={buildFleetChart} height="h-[320px]" />
            </ChartCard>

            <Callout>
              Waymo: ~2,500&ndash;3,000 vehicles, 400K&ndash;450K rides/week, fully driverless. Tesla: ~400 active (1,655 registered in CA), supervised, with Cybercab mass production launching April 2026. Waymo&rsquo;s fleet is 6&ndash;7x larger &mdash; and fully autonomous, driving fundamentally different infrastructure requirements.
            </Callout>

            <ScrollReveal delay={0.1}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Where Each Company Operates</h3>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <div className="my-6 grid gap-4 md:grid-cols-2">
                <ComparisonCard variant="waymo" title="Waymo">
                  <p>San Francisco, Phoenix/Tempe, Los Angeles, Austin, Atlanta &mdash; with Miami, Washington D.C., and additional cities in the pipeline.<Ref n={4} /></p>
                  <p>Fully driverless (SAE Level 4) in all operating cities. 24/7 service availability.</p>
                </ComparisonCard>
                <ComparisonCard variant="tesla" title="Tesla">
                  <p>Austin and San Francisco Bay Area as of early 2026, with Elon Musk&rsquo;s stated target to expand to 25&ndash;50% of the U.S. by end of 2026, pending regulatory approvals for unsupervised operation.<Ref n={3} /></p>
                  <p>Safety monitors present in nearly all vehicles. FSD (Supervised) designation &mdash; limited unsupervised trials in Austin; full autonomous approval not yet granted in most markets.</p>
                </ComparisonCard>
              </div>
            </ScrollReveal>
          </section>

          <hr className="my-12 border-black/5" />

          {/* Section 2: The Depot Question */}
          <section id="depot">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                Section 02
              </p>
              <h2 className="font-heading mt-2 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                The Depot Question: Physical Infrastructure Behind Autonomous Fleets
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                When a Waymo vehicle finishes its shift, it doesn&rsquo;t park in someone&rsquo;s garage. It returns to a depot &mdash; a purpose-built facility where vehicles are charged, cleaned, inspected, and maintained. In December 2025, Business Insider published a detailed look inside Waymo&rsquo;s largest depot in San Francisco, offering one of the first public glimpses into what the operational backbone of an autonomous fleet actually looks like.<Ref n={5} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Inside Waymo&rsquo;s San Francisco Depot</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                The facility houses hundreds of Jaguar I-PACE vehicles and operates around the clock. Key functions include vehicle charging (a mix of Level 2 and DC fast chargers), automated and manual cleaning, sensor calibration and hardware inspection, tire and brake servicing, software updates, and remote assistance operations. Staff work in shifts to ensure vehicles are turned around and back on the road within hours.<Ref n={5} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                This is the part of autonomy that most investors and analysts overlook. Every city Waymo enters requires a comparable facility &mdash; real estate that must be leased or purchased, outfitted with high-amperage electrical service, and staffed with trained technicians. The Skogsmo-Beiker 2025 academic paper on robotaxi deployment explicitly calls out depot infrastructure as one of the most underestimated cost centers in the industry.<Ref n={6} />
              </p>
            </ScrollReveal>

            <Callout>
              Every new city Waymo enters requires a depot facility with charging infrastructure, maintenance bays, cleaning stations, sensor calibration equipment, and 24/7 staffing. This is the &ldquo;real estate&rdquo; layer of autonomy &mdash; and it doesn&rsquo;t exist yet in most markets.
            </Callout>

            <ScrollReveal delay={0.12}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Tesla&rsquo;s &ldquo;Mothership&rdquo; Hubs: A Different Kind of Depot</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                Tesla is building its own version of depot infrastructure &mdash; different in form from Waymo&rsquo;s, but increasingly substantial. While the current Model Y fleet uses existing Service Centers and Superchargers, the Cybercab is driving a new infrastructure buildout. At Giga Texas, drone footage shows a growing staging operation where Cybercabs are charged, cleaned, and prepared for deployment. Tesla calls these &ldquo;Mothership&rdquo; hubs &mdash; centralized facilities handling charging, automated cleaning (robotic camera washer systems with zero human labor), maintenance, dispatch, and teleoperations.<Ref n={18} /><Ref n={19} /><Ref n={20} /> Tesla has also partnered with Ultrium, an AI-driven predictive maintenance company, to develop autonomous diagnosis and repair capabilities, with Detroit being explored as a pilot hub location.<Ref n={21} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                Functionally, this is converging with Waymo&rsquo;s depot model &mdash; centralized facilities with charging, cleaning, and remote ops &mdash; though Tesla is designing for lower labor intensity through automation and wireless charging. The longer-term vision of private Tesla owners opting their cars into the network is planned for later in 2026, but the Cybercab (no steering wheel, no pedals, wireless charging only) cannot function in that distributed model at all. It requires dedicated hub infrastructure by design.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.16}>
              <div className="my-10 overflow-x-auto rounded-lg border border-black/5">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <thead>
                    <tr className="bg-accent-green text-white">
                      <th className="px-4 py-3 font-semibold">Infrastructure Element</th>
                      <th className="px-4 py-3 font-semibold">Waymo (Centralized Depot)</th>
                      <th className="px-4 py-3 font-semibold">Tesla (&ldquo;Mothership&rdquo; Hubs + Existing Network)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { el: "Charging", waymo: "On-site L2 + DCFC at depot", tesla: "Supercharger network (Model Y fleet); FCC-approved wireless charging pads at hubs (Cybercab); dedicated charging at Giga Texas staging area" },
                      { el: "Cleaning", waymo: "Automated + manual at depot", tesla: "Robotic automated cleaning at Mothership hubs (camera washers, no-labor turnaround); owner responsibility in future distributed model" },
                      { el: "Maintenance", waymo: "In-house technicians at depot", tesla: "Tesla Service Centers + Ultrium AI-powered predictive maintenance; specialized bays for Cybercab (no steering column/pedals)" },
                      { el: "Sensor Calibration", waymo: "Specialized bay at depot (LiDAR, cameras, radar)", tesla: "Camera-only system; OTA software updates; robotic camera washer systems at hubs" },
                      { el: "Remote Operations", waymo: "Dedicated ops center staffed 24/7", tesla: "Teleoperations center at Giga Texas; transitioning from in-car safety monitors to remote ops as unsupervised scales" },
                      { el: "Real Estate Requirement", waymo: "Large industrial facility per city", tesla: "\"Mothership\" network hubs (smaller than Waymo depots, higher automation); Giga Texas as central hub; expanding to additional cities as Cybercab deploys" },
                    ].map((row, i) => (
                      <tr key={row.el} className={`border-t border-black/5 ${i % 2 === 1 ? "bg-bg-surface" : ""}`}>
                        <td className="px-4 py-3 font-medium text-text-primary">{row.el}</td>
                        <td className="px-4 py-3 text-text-secondary">{row.waymo}</td>
                        <td className="px-4 py-3 text-text-secondary">{row.tesla}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </section>

          <hr className="my-12 border-black/5" />

          {/* Section 3: Charging Infrastructure */}
          <section id="charging">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                Section 03
              </p>
              <h2 className="font-heading mt-2 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                Charging Infrastructure: Who&rsquo;s Actually Building It
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                Charging is the single most critical infrastructure bottleneck for autonomous fleets. Every robotaxi must be charged, and unlike human-driven rideshare vehicles that can refuel anywhere, autonomous vehicles need purpose-built, predictable charging infrastructure integrated into their operational workflow.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Uber&rsquo;s $100 Million Bet</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                In early 2026, Uber announced a $100 million investment specifically earmarked for building robotaxi charging stations.<Ref n={7} /> This is arguably the strongest market signal yet that the infrastructure layer for autonomous fleets is becoming a distinct, investable asset class. Uber isn&rsquo;t building the robotaxis themselves &mdash; they&rsquo;re building the infrastructure that any robotaxi operator will need to use. It&rsquo;s a platform play for the physical layer.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Tesla&rsquo;s Wireless Charging Pivot</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                In February 2026, Tesla received an FCC waiver for a wireless charging system designed specifically for the Cybercab.<Ref n={8} /> This is a significant technical development: wireless charging eliminates the need for a human (or robotic arm) to plug in a cable, which is critical for a vehicle with no human driver. The waiver suggests Tesla is serious about deploying Cybercab at scale, and that the charging infrastructure for that vehicle will look fundamentally different from today&rsquo;s Supercharger network. For the current company-owned Model Y fleet, Tesla continues leveraging the existing Supercharger network; wireless charging rollout is prioritized for the Cybercab to enable depot-free or low-labor charging operations.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Tesla Abandons SF Charging Site</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                In a revealing counterpoint, Tesla dropped plans for a robotic charging site in San Francisco that was intended to serve its robotaxi fleet.<Ref n={9} /> The reasons aren&rsquo;t entirely clear, but the timing is notable &mdash; Tesla pulled back from building dedicated charging infrastructure in a city where it had just launched robotaxi service. This suggests either a strategic pivot toward wireless/distributed charging, or a recognition that purpose-built charging depots are more expensive and complex than anticipated.
              </p>
            </ScrollReveal>

            <ChartCard
              title="Charging Infrastructure Investments in the Autonomous Fleet Ecosystem"
              subtitle="Notable commitments and developments, 2025–2026"
              source="Sources: TechCrunch; CleanTechnica; industry reporting"
            >
              <AnimatedChart id="chargingChart" build={buildChargingChart} height="h-[320px]" />
            </ChartCard>

            <Callout>
              Uber&rsquo;s $100 million commitment to robotaxi charging stations is a clear market signal: the infrastructure layer for autonomous fleets is becoming a standalone investment opportunity, separate from the vehicles themselves.
            </Callout>

            <ScrollReveal delay={0.14}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">The Charger-to-Vehicle Ratio Challenge</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                The Skogsmo-Beiker 2025 paper highlights a critical operational detail: the charger-to-vehicle ratio.<Ref n={6} /> A fleet running 24/7 cannot have every vehicle charging at once &mdash; get the ratio wrong, and you either waste capital on unused chargers or create bottlenecks that take vehicles off the road. For a 1,000-vehicle fleet, even small ratio differences translate to millions in infrastructure cost. This challenge applies equally to Tesla&rsquo;s wireless charging approach as it scales, and it&rsquo;s the kind of operational detail that separates infrastructure operators from vehicle manufacturers.
              </p>
            </ScrollReveal>
          </section>

          <hr className="my-12 border-black/5" />

          {/* Section 4: Scaling Strategies */}
          <section id="scaling">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                Section 04
              </p>
              <h2 className="font-heading mt-2 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                Scaling Strategies: Geo-Fenced Expansion vs. Software-First
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                The fundamental strategic divergence between Waymo and Tesla can be distilled to a single question: do you map the world first, or do you teach the car to drive anywhere?
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Waymo: City by City, Block by Block</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                Waymo&rsquo;s expansion strategy is methodical and infrastructure-intensive. Before launching in any new city, Waymo spends months mapping the area in granular detail, testing vehicles on local roads, engaging with city officials and regulators, and building or leasing a local depot facility.<Ref n={4} /> Their February 2025 announcement, &ldquo;Safe, Routine, Ready: Autonomous driving in five new cities,&rdquo; outlined their expansion roadmap into Austin, Atlanta, Miami, and beyond &mdash; each requiring the same rigorous preparation process.<Ref n={4} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                Waymo is also investing in U.S. manufacturing to support this scaling. Their partnership with Hyundai and contract manufacturer Magna will produce the next generation of Waymo vehicles domestically, enabling faster fleet growth without supply chain dependencies on overseas manufacturing.<Ref n={10} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <div className="my-6 grid gap-4 md:grid-cols-2">
                <ComparisonCard variant="waymo" title="Waymo's Scaling Approach">
                  <p><strong className="text-text-primary">Sensor stack:</strong> LiDAR + cameras + radar (sensor fusion)</p>
                  <p><strong className="text-text-primary">Mapping:</strong> Pre-mapped HD maps required for each city</p>
                  <p><strong className="text-text-primary">Expansion pace:</strong> ~2&ndash;3 new cities per year</p>
                  <p><strong className="text-text-primary">Infrastructure per city:</strong> Depot + charging + remote ops</p>
                  <p><strong className="text-text-primary">Manufacturing:</strong> Purpose-built vehicles via Hyundai/Magna<Ref n={10} /></p>
                </ComparisonCard>
                <ComparisonCard variant="tesla" title="Tesla's Scaling Approach">
                  <p><strong className="text-text-primary">Sensor stack:</strong> Vision-only (cameras, no LiDAR)</p>
                  <p><strong className="text-text-primary">Mapping:</strong> Real-time neural network; no pre-mapping required</p>
                  <p><strong className="text-text-primary">Expansion pace:</strong> Musk&rsquo;s stated target: 25&ndash;50% of U.S. by end of 2026, pending regulatory approvals<Ref n={3} /></p>
                  <p><strong className="text-text-primary">Infrastructure per city:</strong> Leverages existing Superchargers + Service Centers; growing as Cybercab ramps</p>
                  <p><strong className="text-text-primary">Manufacturing:</strong> Existing factories + Cybercab line at Giga Texas (first unit Feb 2026; mass production April 2026, targeting hundreds/week)<Ref n={17} /></p>
                </ComparisonCard>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Tesla: Faster Geographic Reach, Growing Infrastructure Needs</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                Tesla&rsquo;s vision-only system aims to generalize without city-specific HD maps, enabling faster geographic expansion. But &ldquo;faster&rdquo; doesn&rsquo;t mean &ldquo;infrastructure-free.&rdquo; The Cybercab rollout is generating its own buildout: Mothership hubs, a teleoperations center at Giga Texas, and Ultrium&rsquo;s predictive maintenance partnership.<Ref n={20} /><Ref n={21} /> Waymo requires large, staffed depots per city; Tesla is building smaller, more automated hubs with robotic cleaning and wireless charging. Both models require real estate, electrical capacity, and capital in every market. As Cybercab production ramps to hundreds per week, Tesla&rsquo;s infrastructure footprint will grow toward Waymo&rsquo;s &mdash; even if the facilities look different.
              </p>
            </ScrollReveal>
          </section>

          <hr className="my-12 border-black/5" />

          {/* Section 5: Pricing & Economics */}
          <section id="pricing">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                Section 05
              </p>
              <h2 className="font-heading mt-2 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                Pricing & the Economics of Autonomy
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                The Obi Report (January 2026) provides the most comprehensive side-by-side pricing analysis of autonomous and traditional rideshare services ever published, based on 94,348 rides tracked across the San Francisco Bay Area from November 27, 2025 to January 1, 2026.<Ref n={2} /> The data reveals fundamentally different pricing strategies that have direct implications for infrastructure investment.
              </p>
            </ScrollReveal>

            <ChartCard
              title="Average Ride Prices by Provider"
              subtitle="San Francisco Bay Area, Nov 2025 – Jan 2026 (n = 94,348 rides)"
              source={'Source: Obi, "The Cost of Autonomy" Report, January 2026'}
            >
              <AnimatedChart id="pricingChart" build={buildPricingChart} height="h-[300px]" />
            </ChartCard>

            <ScrollReveal delay={0.08}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Tesla: Undercutting the Market</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                Tesla&rsquo;s average ride price of $8.17 is 53&ndash;59% cheaper than every competitor: Lyft ($15.47), Uber ($17.47), and Waymo ($19.69).<Ref n={2} /> At roughly $3.20 per mile (~$1.99/km in Obi&rsquo;s data), Tesla is less than half the per-mile cost of any rival. Uniquely, Tesla shows no surge pricing &mdash; consistent rates across peak/off-peak hours, weekdays, and weekends. This pricing applies to the current supervised service; since March 2026, Tesla has begun shifting to a per-mile structure (~$1&ndash;$1.40/mile + base fare).
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                Current pricing is almost certainly not sustainable. Analysts estimate Tesla&rsquo;s long-term target is $0.20&ndash;$0.40 per mile &mdash; roughly 10x lower than current rates.<Ref n={2} /> At those levels, every dollar of infrastructure cost (charging, cleaning, maintenance) eats directly into per-ride margins.
              </p>
            </ScrollReveal>

            <ChartCard
              title="Price Per Mile by Provider"
              subtitle="Converted from Obi's $/km data (1 km ≈ 0.621 mi)"
              source={'Source: Obi, "The Cost of Autonomy" Report, January 2026 (original data in $/km)'}
            >
              <AnimatedChart id="ppkChart" build={buildPpkChart} height="h-[300px]" />
            </ChartCard>

            <ScrollReveal delay={0.12}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Waymo: Converging with Incumbents</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                Waymo&rsquo;s pricing premium over traditional rideshare has narrowed sharply &mdash; now just 12.7% above Uber and 27.3% above Lyft, down from 30&ndash;40% in mid-2025.<Ref n={2} /> This convergence, combined with improving ETAs (5.74 min average vs. Uber&rsquo;s 3.28 min), suggests Waymo&rsquo;s unit economics are strengthening as fleet density increases &mdash; justifying continued infrastructure investment.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">The ARK Invest View: Cathie Wood&rsquo;s Robotaxi Thesis</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                ARK Invest, led by Cathie Wood, has published the most bullish analyst model for Tesla&rsquo;s robotaxi business &mdash; $4,600 per share expected value in 2026 ($5,800 bull / $2,900 bear), with robotaxis contributing 60% of Tesla&rsquo;s expected enterprise value.<Ref n={11} /> ARK&rsquo;s broader market sizing projects $34.8 trillion in global robotaxi enterprise value by 2030, though fleet owners capture only ~$500 billion of that.<Ref n={12} /> Under bull-case assumptions, Tesla alone could generate $486 billion in annual robotaxi revenue &mdash; though the bear case is just $51 million, underscoring the enormous uncertainty range.<Ref n={11} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.16}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                These are explicitly optimistic projections. But even if only a fraction materializes, the infrastructure demand &mdash; charging, maintenance, depot operations &mdash; will be substantial regardless of which company leads.
              </p>
            </ScrollReveal>

            <ChartCard
              title="ARK Invest: Tesla Enterprise Value Breakdown (2026 Expected Case)"
              subtitle="Robotaxi business projected to contribute 60% of total value"
              source={"Source: ARK Invest, \"ARK's Expected Value For Tesla In 2026: $4,600 per Share\""}
            >
              <AnimatedChart id="arkChart" build={buildArkChart} height="h-[280px]" />
            </ChartCard>

            <Callout>
              ARK Invest projects the global robotaxi ecosystem at $34.8 trillion in enterprise value by 2030 &mdash; but fleet owners capture only $500 billion of that. The real value accrues to technology providers. The infrastructure layer sits in between.
            </Callout>

            <ScrollReveal delay={0.18}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">What the Pricing Data Means for Infrastructure</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                Tesla&rsquo;s ultra-low pricing strategy implies a future where per-ride infrastructure costs must be driven to near zero. That means wireless charging (no manual plug-in labor), automated cleaning systems, and predictive maintenance that minimizes depot time. Waymo&rsquo;s converging pricing, by contrast, suggests there&rsquo;s enough margin in the current model to support full depot operations &mdash; as long as fleet utilization stays high.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                Both models point to the same conclusion for infrastructure providers: the autonomous fleet that operates most efficiently &mdash; with the highest uptime, lowest per-vehicle charging cost, and fastest maintenance turnaround &mdash; will have a decisive competitive advantage. The infrastructure operator who enables that efficiency captures value regardless of which technology stack wins.
              </p>
            </ScrollReveal>
          </section>

          <hr className="my-12 border-black/5" />

          {/* Section 6: Market Projections */}
          <section id="market">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                Section 06
              </p>
              <h2 className="font-heading mt-2 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                Market Projections & the Infrastructure Investment Thesis
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                According to industry projections (which should be treated as directional estimates, not certainties), the robotaxi market is forecast to grow from $789 million in 2024 to $96.9 billion by 2032, representing a compound annual growth rate of over 80%.<Ref n={13} /> This is one of the fastest-growing market segments in the entire transportation sector, and every dollar of robotaxi revenue requires supporting infrastructure to deliver.
              </p>
            </ScrollReveal>

            <ChartCard
              title="Global Robotaxi Market Size Projection"
              subtitle="Market value in billions USD, 2024–2032"
              source="Source: The Robot Report 2026 Outlook; industry market research"
            >
              <AnimatedChart id="marketChart" build={buildMarketChart} height="h-[320px]" />
            </ChartCard>

            <ScrollReveal delay={0.08}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">The Infrastructure Multiplier</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                For every robotaxi on the road, there is an associated infrastructure cost that includes charging (hardware, electrical service, land), maintenance (facility, equipment, labor), cleaning (equipment, water, supplies), remote operations (connectivity, staffing, software), and parking/staging (real estate for idle vehicles between rides). Industry estimates suggest that infrastructure costs represent 15&ndash;25% of the total cost of operating a robotaxi fleet.<Ref n={6} /> Applied to ARK&rsquo;s $4 trillion net revenue forecast for robotaxi platforms in 2030, that implies a $600 billion to $1 trillion annual infrastructure services market.<Ref n={12} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">Consumer Readiness Is Accelerating</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                The demand side is moving fast. Obi&rsquo;s January 2026 survey of 2,002 consumers across California, Arizona, Texas, and Nevada found that 63% are now comfortable or somewhat comfortable riding in autonomous vehicles &mdash; up dramatically from just 35% in Obi&rsquo;s 2025 survey.<Ref n={2} /> Nearly 48% expect autonomous vehicles to become their primary rideshare option, up from 24% just months earlier.
              </p>
            </ScrollReveal>

            <ChartCard
              title="Consumer Comfort with Autonomous Rideshare"
              subtitle="Survey of 2,002 consumers in AV-available states, January 2026"
              source="Source: Obi Autonomous Ride Survey 2026 (n = 2,002)"
            >
              <AnimatedChart id="comfortChart" build={buildComfortChart} height="h-[320px]" />
            </ChartCard>

            <ScrollReveal delay={0.12}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                Notably, 52% would pay more for an autonomous ride (25% up to $10 more per trip), suggesting the market can support differentiated pricing tiers based on service quality and availability &mdash; both influenced by infrastructure quality.<Ref n={2} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">The Picks-and-Shovels Opportunity</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                Whether Tesla&rsquo;s Mothership hubs or Waymo&rsquo;s full depots prevail, both require physical plant to operate at scale. The question isn&rsquo;t whether this infrastructure will be built &mdash; it&rsquo;s who will build it, who will own it, and how it will be financed. That&rsquo;s the investment thesis for autonomous fleet infrastructure.
              </p>
            </ScrollReveal>
          </section>

          <hr className="my-12 border-black/5" />

          {/* Section 7: Academic Research */}
          <section id="academic">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green">
                Section 07
              </p>
              <h2 className="font-heading mt-2 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl">
                Lessons from Academic Research on Scaling
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <p className="mt-6 text-[15px] leading-[1.8] text-text-secondary">
                The Skogsmo-Beiker 2025 paper, &ldquo;Learning for deployment of robotaxi at scale,&rdquo; provides one of the most rigorous academic analyses of the operational challenges involved in scaling autonomous fleets from pilot programs to full commercial deployment.<Ref n={6} /> Several of its findings have direct implications for infrastructure planning.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                Three key findings from the paper carry direct infrastructure implications:<Ref n={6} />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                <strong className="text-text-primary">Non-linear complexity.</strong> Fleet management complexity grows non-linearly with fleet size. A 1,000-vehicle fleet across multiple zones faces entirely new categories of problems (scheduling, routing, charging optimization) that a 100-vehicle pilot never encounters.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                <strong className="text-text-primary">Maintenance is the hidden bottleneck.</strong> Autonomous vehicles accumulate wear differently &mdash; more daily miles, more stop-and-go cycles, sensor arrays needing calibration that consumer cars don&rsquo;t. Maintenance facility design (bay count, equipment mix, parts inventory, technician scheduling) is the most critical infrastructure decision a fleet operator makes. This applies equally to Tesla&rsquo;s Cybercab, which will require entirely new maintenance workflows that existing Service Centers aren&rsquo;t configured to handle.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <p className="mt-5 text-[15px] leading-[1.8] text-text-secondary">
                <strong className="text-text-primary">Urban integration is a real estate problem.</strong> Depots too far from the service zone waste energy on deadheading; depots in dense urban cores are expensive and hard to permit. The sweet spot: mid-distance industrial sites with adequate electrical capacity and good road access &mdash; a specific, investable real estate niche.
              </p>
            </ScrollReveal>

            <Callout>
              Academic research confirms that depot location, charging ratios, and maintenance throughput &mdash; not the driving software &mdash; are the binding constraints on fleet scale.
            </Callout>

            <ScrollReveal delay={0.16}>
              <h3 className="mt-8 text-[17px] font-bold text-text-primary">The Blackout Lesson</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                The December 2025 San Francisco power outage provided a real-world stress test. When traffic signals went dark, Waymo vehicles stalled at unlit intersections for 18 hours &mdash; the company ran out of remote operators to assist stranded cars. Tesla, with human safety monitors, was unaffected.<Ref n={2} /> The lesson for infrastructure operators: fully autonomous fleets depend on functioning city infrastructure (traffic signals, cellular connectivity, power). Resilience &mdash; backup power, redundant connectivity &mdash; is a premium feature and a competitive moat that software alone cannot provide.
              </p>
            </ScrollReveal>
          </section>

          {/* Bibliography */}
          <ScrollReveal>
            <div className="mt-16 rounded-lg border border-black/5 bg-white p-6 md:p-8">
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
      <RelatedArticles currentHref="/research/tesla-vs-waymo" />
      <Footer />
    </>
  );
}

const BIBLIOGRAPHY = [
  { n: 1, text: 'Waymo, "Safe, Routine, Ready: Autonomous driving in five new cities," February 2025. Publicly available via Waymo blog. Weekly ride estimates (~400,000–450,000) based on Waymo co-CEO statements and multiple reporting sources, late 2025/early 2026.' },
  { n: 2, text: 'Obi, "The Cost of Autonomy: Tesla, Waymo, and the New Rideshare Battleground," January 2026. Based on 94,348 rides tracked from Nov 27, 2025 to Jan 1, 2026, plus Autonomous Ride Survey 2026 (n = 2,002). Available at rideobi.com/research.' },
  { n: 3, text: 'ARK Invest, "Tesla Has Launched Its Robotaxi…Now What?" 2025. Details on Tesla fleet deployment. Available at ark-invest.com.' },
  { n: 4, text: 'Waymo, "Safe, Routine, Ready: Autonomous driving in five new cities," 2025. Details on city-by-city expansion strategy including Austin, Atlanta, Miami, and Washington D.C. pipeline.' },
  { n: 5, text: 'Business Insider, "Inside Waymo\'s Largest Robotaxi Depot in San Francisco," December 2025. Detailed reporting on depot operations, charging infrastructure, and maintenance workflows.' },
  { n: 6, text: 'Skogsmo, I. & Beiker, S., "Learning for deployment of robotaxi at scale," 2025. Academic paper on operational challenges of scaling autonomous fleets, including depot design, maintenance logistics, and charger-to-vehicle ratios.' },
  { n: 7, text: 'TechTransit / industry reporting, "Uber Will Spend $100M to Build Robotaxi Charging Stations," 2026. Details on Uber\'s investment commitment to charging infrastructure for autonomous fleet partners.' },
  { n: 8, text: 'CleanTechnica, "Tesla Receives FCC Waiver for Cybercab Wireless Charging System," February 2026. Coverage of Tesla\'s FCC wireless charging approval for the purpose-built Cybercab robotaxi.' },
  { n: 9, text: 'Mission Local / Electrek / media reporting, "Tesla drops plans for robo-charging site for the SF robotaxis it doesn\'t have," February 2026. Coverage of Tesla\'s decision to abandon a dedicated robotic charging facility in San Francisco.' },
  { n: 10, text: 'Waymo, "Scaling our fleet through U.S. manufacturing," 2025. Details on Waymo\'s partnership with Hyundai and Magna for domestic manufacturing of next-generation autonomous vehicles.' },
  { n: 11, text: 'ARK Invest, "ARK\'s Expected Value For Tesla In 2026: $4,600 per Share," 2026. Monte Carlo valuation model with robotaxi contributing 60% of expected value. Available at ark-invest.com.' },
  { n: 12, text: 'ARK Invest / Securities.io, "Robotaxis: Capturing $34 Trillion in Market Value," 2025. Projects $34.8 trillion global robotaxi enterprise value by 2030, with fleet owners at ~$500 billion. See also securities.io.' },
  { n: 13, text: 'The Robot Report, "2026 Outlook," 2026. Market sizing data: robotaxi market at $789 million (2024), projected $96.9 billion by 2032.' },
  { n: 14, text: 'Basenor, "Tesla Robotaxi Fleet Hits 400 Active Vehicles: Bay Area Leads," March 10, 2026. Breakdown: 355 Bay Area, 45 Austin. Available at basenor.com.' },
  { n: 15, text: 'NextBigFuture, "Tesla Robotaxi – the Real Fleet Size is Likely 1000+," February 2026. Discusses Tesla CPUC filings showing 1,655 registered vehicles in California vs. ~330–400 active. Available at nextbigfuture.com.' },
  { n: 16, text: 'Austin Today / National Today, "Tesla\'s Unsupervised Robotaxi Fleet in Texas Shrinks to Just 4 Cars," March 13, 2026. Reports only 4 unsupervised vehicles spotted in Austin in the last 30 days. Available at nationaltoday.com.' },
  { n: 17, text: 'Teslarati, "Tesla Cybercab production line is targeting hundreds of vehicles weekly: report," March 2026. First production unit Feb 17, 2026; mass production April 2026; 25+ units spotted at Giga Texas. Available at teslarati.com.' },
  { n: 18, text: 'Tesery.com, "Tesla Gathers Growing Cybercab Fleet at Gigafactory Texas as Mass Production Nears," January 2026. Describes "Mothership" hub concept for centralized fleet staging, charging, and cleaning. Available at tesery.com.' },
  { n: 19, text: 'TeslaNorth, "Tesla Cybercab Camera Washers Caught in Action at Giga Texas," March 10, 2026. Drone footage (Joe Tegtmeyer) showing robotic camera cleaning systems on Cybercabs. Available at teslanorth.com.' },
  { n: 20, text: 'Not a Tesla App, "Tesla\'s Blueprint for Autonomy: Redundancy, Teleoperators, Hubs," 2025. Details on network hubs (charging + cleaning), teleoperations center at Giga Texas, intelligent dispatch, and fleet management infrastructure. Available at notateslaapp.com.' },
  { n: 21, text: 'Michigan Chronicle, "Ultrium Partners with Tesla to Pioneer Autonomous Maintenance for Robotaxi Fleet, Eyes Detroit for Innovation Hub," February 2025. Details on AI-powered predictive maintenance hubs. Available at michiganchronicle.com.' },
];
