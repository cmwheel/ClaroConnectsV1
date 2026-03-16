import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Charging Infrastructure Costs",
  description:
    "Detailed cost analysis of EV charging infrastructure deployment for autonomous and electric fleet operations.",
  openGraph: {
    type: "article",
    title: "Who Picks Up the Tab? EV Charging Infrastructure in Industrial Real Estate",
    description:
      "Detailed cost analysis of EV charging infrastructure deployment for autonomous and electric fleet operations.",
    images: [{ url: "/images/2article1.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Who Picks Up the Tab? EV Charging Infrastructure in Industrial Real Estate",
    description:
      "Detailed cost analysis of EV charging infrastructure deployment for autonomous and electric fleet operations.",
    images: ["/images/2article1.jpg"],
  },
};

export default function ChargingCostsLayout({
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
              "Who Picks Up the Tab? EV Charging Infrastructure in Industrial Real Estate",
            description:
              "Detailed cost analysis of EV charging infrastructure deployment for autonomous and electric fleet operations.",
            datePublished: "2026-03-15",
            author: {
              "@type": "Organization",
              name: "Claro Connects",
            },
            image: "https://claroconnects.com/images/2article1.jpg",
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
