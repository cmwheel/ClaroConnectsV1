import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tesla vs Waymo",
  description:
    "Comparative analysis of Tesla and Waymo's autonomous vehicle strategies and their infrastructure implications.",
  openGraph: {
    type: "article",
    title: "Tesla vs. Waymo: Two Roads to Scaling Autonomous Fleets",
    description:
      "Comparative analysis of Tesla and Waymo's autonomous vehicle strategies and their infrastructure implications.",
    images: [{ url: "/images/waymo-depot.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tesla vs. Waymo: Two Roads to Scaling Autonomous Fleets",
    description:
      "Comparative analysis of Tesla and Waymo's autonomous vehicle strategies and their infrastructure implications.",
    images: ["/images/waymo-depot.jpg"],
  },
};

export default function TeslaWaymoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Tesla vs. Waymo: Two Roads to Scaling Autonomous Fleets",
            description:
              "Comparative analysis of Tesla and Waymo's autonomous vehicle strategies and their infrastructure implications.",
            datePublished: "2026-03-15",
            author: {
              "@type": "Organization",
              name: "Claro Connects",
            },
            image: "https://claroconnects.com/images/waymo-depot.jpg",
            publisher: {
              "@type": "Organization",
              name: "Claro Connects",
              url: "https://claroconnects.com",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
