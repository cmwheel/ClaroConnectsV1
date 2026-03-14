"use client";

import ScrollReveal from "./ScrollReveal";

const RESEARCH_ITEMS = [
  {
    id: "research-robotaxi",
    title: "RoboTaxi Infrastructure: Corridor Readiness in the Sun Belt",
    excerpt:
      "Mapping AV-ready urban corridors across Texas, Arizona, and Florida to identify where curb, charging, and dispatch infrastructure creates the strongest launch conditions.",
    date: "Mar 2026",
    tag: "RoboTaxi",
  },
  {
    id: "research-freight",
    title: "Freight Infrastructure: Where Autonomous Trucking Scales Next",
    excerpt:
      "Our routing and demand models surface the top freight lanes where depot, charging, and transfer-node placement can unlock the next wave of autonomous trucking deployment.",
    date: "Feb 2026",
    tag: "Freight",
  },
  {
    id: "research-optimization",
    title: "Charging Depot Siting: A Geospatial Framework",
    excerpt:
      "A new model for identifying optimal charging depot locations by overlaying fleet route density, grid capacity, and land cost data.",
    date: "Jan 2026",
    tag: "Optimization",
  },
];

function PlaceholderThumbnail({ index }: { index: number }) {
  const patterns = [
    { cx1: "30%", cy1: "40%", cx2: "65%", cy2: "55%", cx3: "50%", cy3: "70%" },
    { cx1: "25%", cy1: "35%", cx2: "55%", cy2: "60%", cx3: "75%", cy3: "45%" },
    { cx1: "40%", cy1: "30%", cx2: "70%", cy2: "50%", cx3: "35%", cy3: "65%" },
  ];
  const p = patterns[index % 3];

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="220" fill="#EBEBEB" />
      {/* Grid lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 30 + 10}
          x2="400"
          y2={i * 30 + 10}
          stroke="#d8d8d8"
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 35 + 10}
          y1="0"
          x2={i * 35 + 10}
          y2="220"
          stroke="#d8d8d8"
          strokeWidth="0.5"
        />
      ))}
      {/* Data nodes */}
      {Array.from({ length: 15 }).map((_, i) => (
        <circle
          key={`dot-${i}`}
          cx={20 + (i * 27) % 370}
          cy={15 + (i * 19) % 195}
          r="2"
          fill="#aaa"
        />
      ))}
      {/* Green accent nodes */}
      <circle cx={p.cx1} cy={p.cy1} r="5" fill="#2ECC71" opacity="0.7" />
      <circle cx={p.cx2} cy={p.cy2} r="4" fill="#2ECC71" opacity="0.5" />
      <circle cx={p.cx3} cy={p.cy3} r="6" fill="#2ECC71" opacity="0.6" />
      {/* Connecting line */}
      <line
        x1={p.cx1}
        y1={p.cy1}
        x2={p.cx2}
        y2={p.cy2}
        stroke="#2ECC71"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1={p.cx2}
        y1={p.cy2}
        x2={p.cx3}
        y2={p.cy3}
        stroke="#2ECC71"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}

export default function ResearchSection() {
  return (
    <section id="research" className="bg-bg-base py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <ScrollReveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-text-secondary">
                Latest Research
              </p>
              <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                Published findings.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary">
                Our work is organized across two core lanes:{" "}
                <span className="font-medium text-text-primary">
                  RoboTaxi infrastructure
                </span>{" "}
                and{" "}
                <span className="font-medium text-text-primary">
                  freight infrastructure
                </span>
                .
              </p>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-accent-green"
            >
              View All &rarr;
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-accent-green/25 bg-white px-3 py-1 text-xs font-medium text-text-primary">
              RoboTaxi lane
            </span>
            <span className="rounded-full border border-accent-green/25 bg-white px-3 py-1 text-xs font-medium text-text-primary">
              Freight lane
            </span>
          </div>
        </ScrollReveal>

        <div className="md-grid-3 mt-14 grid gap-8 md:grid-cols-3">
          {RESEARCH_ITEMS.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.12}>
              <a
                id={item.id}
                href="#"
                className="group flex flex-col overflow-hidden rounded-xl border border-transparent bg-white transition-all duration-300 hover:border-accent-green/15 hover:shadow-xl hover:shadow-accent-green/5"
              >
                <div className="relative h-48 overflow-hidden">
                  <PlaceholderThumbnail index={i} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <span className="rounded-full bg-bg-surface px-2.5 py-1 font-medium">
                      {item.tag}
                    </span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-heading mt-3 text-base font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent-green">
                    {item.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                    {item.excerpt}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-text-secondary transition-colors group-hover:text-accent-green">
                    Read more
                    <svg
                      className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
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
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
