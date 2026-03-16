"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const ARTICLES = [
  {
    title: "The Tesla Semi Advantage",
    excerpt:
      "How Tesla's Class 8 electric truck is outperforming every competitor on range, efficiency, and total cost of ownership, backed by real-world fleet data.",
    date: "Mar 15, 2026",
    readTime: "20 min read",
    tag: "Freight",
    href: "/research/tesla-semi-advantage",
    image: "/images/article1.jpg",
    imageAlt: "Tesla Semi electric truck at a charging depot",
  },
  {
    title:
      "Who Picks Up the Tab? EV Charging Infrastructure in Industrial Real Estate",
    excerpt:
      "The chargers, transformers, and grid upgrades behind every electric truck fleet can cost as much as the trucks themselves. So who pays?",
    date: "Mar 15, 2026",
    readTime: "15 min read",
    tag: "Freight",
    href: "/research/charging-infrastructure-costs",
    image: "/images/2article1.jpg",
    imageAlt: "EV charging infrastructure at an industrial real estate site",
  },
  {
    title: "Why EV Charging Is the Infrastructure Investment of the Decade",
    excerpt:
      "A $40–48B market today, headed to $200–400B+. Tesla is selling the picks and shovels.",
    date: "Mar 15, 2026",
    readTime: "18 min read",
    tag: "Freight",
    href: "/research/ev-charging-investment",
    image: "/images/ev-charging-article1.jpg",
    imageAlt: "Electric vehicle charging station network",
  },
  {
    title: "Tesla vs. Waymo: Two Roads to Scaling Autonomous Fleets",
    excerpt:
      "An infrastructure-focused analysis of how two fundamentally different approaches to autonomy are shaping fleet charging, servicing, and real estate.",
    date: "Mar 2026",
    readTime: "25 min read",
    tag: "RoboTaxi",
    href: "/research/tesla-vs-waymo",
    image: "/images/waymo-depot.jpg",
    imageAlt: "Waymo autonomous vehicle depot and infrastructure",
  },
];

const TAGS = ["All", ...Array.from(new Set(ARTICLES.map((a) => a.tag)))];

function PlaceholderThumbnail() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 600 340"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="600" height="340" fill="#EBEBEB" />
      {Array.from({ length: 10 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 35 + 15}
          x2="600"
          y2={i * 35 + 15}
          stroke="#d8d8d8"
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 40 + 10}
          y1="0"
          x2={i * 40 + 10}
          y2="340"
          stroke="#d8d8d8"
          strokeWidth="0.5"
        />
      ))}
      <circle cx="30%" cy="45%" r="6" fill="#a8d832" opacity="0.7" />
      <circle cx="55%" cy="35%" r="4" fill="#a8d832" opacity="0.5" />
      <circle cx="70%" cy="55%" r="5" fill="#a8d832" opacity="0.6" />
      <line
        x1="30%"
        y1="45%"
        x2="55%"
        y2="35%"
        stroke="#a8d832"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="55%"
        y1="35%"
        x2="70%"
        y2="55%"
        stroke="#a8d832"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}

export default function ResearchClient() {
  return (
    <>
      <Navbar />
      <main className="bg-bg-base">
        <header className="pt-32 pb-14 md:pt-36 md:pb-16">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <motion.h1
              className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              Research
            </motion.h1>
            <motion.p
              className="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary md:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              Deep dives into the infrastructure, economics, and technology
              shaping autonomous and electric fleets.
            </motion.p>
          </div>
        </header>

        <div className="border-y border-black/5 bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3 md:px-12">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  tag === "All"
                    ? "border-accent-green/40 bg-accent-green/10 text-accent-green"
                    : "border-black/5 bg-white text-text-secondary hover:border-accent-green/25 hover:text-text-primary"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article, i) => (
              <ScrollReveal key={article.title} delay={i * 0.1}>
                <Link
                  href={article.href}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-transparent bg-white transition-all duration-300 hover:border-accent-green/15 hover:shadow-xl hover:shadow-accent-green/5"
                >
                  <div className="relative h-52 overflow-hidden">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <PlaceholderThumbnail />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span className="rounded-full bg-bg-surface px-2.5 py-1 font-medium">
                        {article.tag}
                      </span>
                      <span>{article.date}</span>
                      {article.readTime && (
                        <>
                          <span className="text-black/15">·</span>
                          <span>{article.readTime}</span>
                        </>
                      )}
                    </div>

                    <h2 className="font-heading mt-3 text-lg font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent-green">
                      {article.title}
                    </h2>

                    <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                      {article.excerpt}
                    </p>

                    <div className="mt-5 flex items-center gap-1 text-xs font-medium text-text-secondary transition-colors group-hover:text-accent-green">
                      Read article
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
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
