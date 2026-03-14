"use client";

import ScrollReveal from "./ScrollReveal";

const CAPABILITIES = [
  {
    title: "Spatial Analysis",
    description:
      "We map corridors, zones, and sites where autonomous fleets will operate — turning geospatial data into investment-grade insight.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
        />
      </svg>
    ),
  },
  {
    title: "Fleet Optimization",
    description:
      "Our models identify optimal infrastructure placement — charging depots, maintenance hubs, staging areas — for maximum fleet efficiency.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
        />
      </svg>
    ),
  },
  {
    title: "Infrastructure Advisory",
    description:
      "We advise RE investors and fleet operators on where to build, buy, and position assets as the autonomous transition accelerates.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
  },
];

export default function WhatWeDoSection() {
  return (
    <section id="about" className="bg-white py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <ScrollReveal>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-text-secondary">
            What We Do
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Where autonomous technology meets physical infrastructure.
          </h2>
        </ScrollReveal>

        <div className="md-grid-3 mt-16 grid gap-8 md:grid-cols-3">
          {CAPABILITIES.map((cap, i) => (
            <ScrollReveal key={cap.title} delay={i * 0.12}>
              <div className="group relative rounded-xl border border-transparent bg-bg-base p-8 transition-all duration-300 hover:border-accent-green/20 hover:shadow-lg hover:shadow-accent-green/5">
                <div className="mb-5 inline-flex rounded-lg bg-bg-surface p-3 text-text-secondary transition-colors duration-300 group-hover:text-accent-green">
                  {cap.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-text-primary">
                  {cap.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                  {cap.description}
                </p>
                <div className="absolute bottom-0 left-8 right-8 h-px scale-x-0 bg-accent-green/30 transition-transform duration-300 group-hover:scale-x-100" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
