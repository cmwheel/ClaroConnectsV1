"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type ResearchArticleHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
  children?: ReactNode;
};

type ResearchArticleBylineProps = {
  authorInitials?: string;
  authorName: string;
  date: string;
  readTime: string;
};

export function ResearchArticleHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  imageClassName = "object-cover object-center",
  children,
}: ResearchArticleHeroProps) {
  return (
    <header className="relative overflow-hidden bg-bg-base pt-24 pb-8 md:min-h-[44vh] md:pt-28 md:pb-10">
      <div className="absolute inset-y-0 right-0 hidden w-[58%] items-end justify-center pt-12 md:flex md:w-[55%] md:pt-16">
        <div className="relative h-[92%] w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={imageClassName}
            priority
            sizes="(max-width: 767px) 100vw, 58vw"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
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
      <div className="absolute inset-x-0 bottom-0 hidden h-24 bg-gradient-to-t from-bg-base to-transparent md:block" />

      <div className="relative z-10 flex items-center py-6 md:py-8">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-12">
          <div className="max-w-lg">
            {eyebrow ? (
              <motion.p
                className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-green"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
              >
                {eyebrow}
              </motion.p>
            ) : null}

            <motion.h1
              className={`font-heading text-3xl font-bold leading-[1.15] tracking-tight text-text-primary md:text-4xl lg:text-5xl ${eyebrow ? "mt-2" : ""}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="mt-3 max-w-lg text-[15px] leading-relaxed text-text-secondary md:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {description}
            </motion.p>

            {children}

            <div className="mt-8 md:hidden">
              <div className="relative h-56 overflow-hidden rounded-2xl border border-black/5 bg-white/70 shadow-sm sm:h-64">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className={imageClassName}
                  priority
                  sizes="100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-base/20 via-transparent to-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function ResearchArticleByline({
  authorInitials = "CW",
  authorName,
  date,
  readTime,
}: ResearchArticleBylineProps) {
  return (
    <div className="border-y border-black/5 bg-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-5 py-3 sm:px-6 sm:flex-row sm:items-center sm:justify-between md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-green/15 text-[11px] font-bold text-accent-green">
            {authorInitials}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-text-primary">{authorName}</p>
            <p className="text-[11px] text-text-secondary">{date}</p>
          </div>
        </div>
        <span className="pl-11 text-[11px] font-medium text-text-secondary sm:pl-0">
          {readTime}
        </span>
      </div>
    </div>
  );
}

const ALL_ARTICLES = [
  {
    title: "The Tesla Semi Advantage",
    href: "/research/tesla-semi-advantage",
    tag: "Freight",
    image: "/images/article1.jpg",
    imageAlt: "Tesla Semi electric truck at a charging depot",
  },
  {
    title: "Who Picks Up the Tab? EV Charging Infrastructure in Industrial Real Estate",
    href: "/research/charging-infrastructure-costs",
    tag: "Freight",
    image: "/images/2article1.jpg",
    imageAlt: "EV charging infrastructure at an industrial real estate site",
  },
  {
    title: "Why EV Charging Is the Infrastructure Investment of the Decade",
    href: "/research/ev-charging-investment",
    tag: "Freight",
    image: "/images/ev-charging-article1.jpg",
    imageAlt: "Electric vehicle charging station network",
  },
  {
    title: "Tesla vs. Waymo: Two Roads to Scaling Autonomous Fleets",
    href: "/research/tesla-vs-waymo",
    tag: "RoboTaxi",
    image: "/images/waymo-depot.jpg",
    imageAlt: "Waymo autonomous vehicle depot and infrastructure",
  },
];

type RelatedArticlesProps = {
  currentHref: string;
};

export function RelatedArticles({ currentHref }: RelatedArticlesProps) {
  const related = ALL_ARTICLES.filter((a) => a.href !== currentHref).slice(0, 3);

  return (
    <section className="border-t border-black/5 bg-bg-base py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-12">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          More Research
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {related.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-transparent bg-white transition-all duration-300 hover:border-accent-green/15 hover:shadow-xl hover:shadow-accent-green/5"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="mb-2 w-fit rounded-full bg-bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary">
                  {article.tag}
                </span>
                <h3 className="font-heading text-base font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent-green">
                  {article.title}
                </h3>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-text-secondary transition-colors group-hover:text-accent-green">
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
          ))}
        </div>
      </div>
    </section>
  );
}
