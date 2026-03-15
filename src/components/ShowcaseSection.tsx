"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function ShowcaseSection() {
  return (
    <>
      {/* RoboTaxi */}
      <section className="relative min-h-[90vh] bg-[#1a1a1a]">
        <div className="grid min-h-[90vh] md:grid-cols-[2fr_3fr]">
          <div className="flex flex-col justify-center px-8 py-20 md:px-14 lg:px-20">
            <ScrollReveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                RoboTaxi
              </p>
              <h2 className="font-heading mt-5 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                Where the ride starts.
              </h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/50">
                Autonomous ride-hailing needs a physical footprint — depots,
                charging, curbside pickup zones. We find the sites that make
                launch possible.
              </p>
            </ScrollReveal>
          </div>

          <div className="relative min-h-[50vh]">
            <Image
              src="/images/cybercab-shot.jpg"
              alt="RoboTaxi cybercab"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Freight */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/images/semi-infra.jpg"
          alt="Freight infrastructure"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />

        <ScrollReveal>
          <div className="absolute bottom-8 right-8 z-10 w-[340px] rounded-xl bg-[#a8d832] p-8 md:bottom-12 md:right-12 md:w-[380px]">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/50">
                Freight
              </p>
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-black/70" />
            </div>
            <h3 className="font-heading mt-5 text-2xl font-bold leading-snug tracking-tight text-black md:text-[1.65rem]">
              Where the cargo moves.
            </h3>
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-3 rounded-lg bg-black/10 px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-black/70 transition-colors hover:bg-black/20"
            >
              Learn More
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
