"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const RESEARCH_ITEMS = [
  {
    id: "research-tesla-semi",
    title: "The Tesla Semi Advantage",
    excerpt:
      "How Tesla's Class 8 electric truck is outperforming every competitor on range, efficiency, and total cost of ownership — backed by real-world fleet data.",
    date: "Mar 2026",
    tag: "Freight",
    href: "/research/tesla-semi-advantage",
    image: "/images/article1.jpg",
  },
  {
    id: "research-charging",
    title: "Who Picks Up the Tab? EV Charging Infrastructure in Industrial Real Estate",
    excerpt:
      "The chargers, transformers, and grid upgrades behind every electric truck fleet can cost as much as the trucks themselves. So who pays?",
    date: "Mar 2026",
    tag: "Freight",
    href: "/research/charging-infrastructure-costs",
    image: "/images/2article1.jpg",
  },
  {
    id: "research-ev-investment",
    title: "Why EV Charging Is the Infrastructure Investment of the Decade",
    excerpt:
      "A $40–48B market today, headed to $200–400B+. Tesla is selling the picks and shovels.",
    date: "Mar 2026",
    tag: "Freight",
    href: "/research/ev-charging-investment",
    image: "/images/ev-charging-article1.jpg",
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
      <circle cx={p.cx1} cy={p.cy1} r="5" fill="#a8d832" opacity="0.7" />
      <circle cx={p.cx2} cy={p.cy2} r="4" fill="#a8d832" opacity="0.5" />
      <circle cx={p.cx3} cy={p.cy3} r="6" fill="#a8d832" opacity="0.6" />
      {/* Connecting line */}
      <line
        x1={p.cx1}
        y1={p.cy1}
        x2={p.cx2}
        y2={p.cy2}
        stroke="#a8d832"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1={p.cx2}
        y1={p.cy2}
        x2={p.cx3}
        y2={p.cy3}
        stroke="#a8d832"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}

export default function ResearchSection() {
  return (
    <section id="research" className="bg-bg-base py-16 md:py-20">
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
              href="/research"
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
                href={item.href}
                className="group flex flex-col overflow-hidden rounded-xl border border-transparent bg-white transition-all duration-300 hover:border-accent-green/15 hover:shadow-xl hover:shadow-accent-green/5"
              >
                <div className="relative h-48 overflow-hidden">
                  {"image" in item && item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <PlaceholderThumbnail index={i} />
                  )}
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
