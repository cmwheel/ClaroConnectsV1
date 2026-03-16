import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Charging Investment Landscape",
  description:
    "Research on the investment landscape for EV charging infrastructure and opportunities in fleet electrification.",
  openGraph: {
    type: "article",
    title: "Why EV Charging Is the Infrastructure Investment of the Decade",
    description:
      "Research on the investment landscape for EV charging infrastructure and opportunities in fleet electrification.",
    images: [
      { url: "/images/ev-charging-article1.jpg", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why EV Charging Is the Infrastructure Investment of the Decade",
    description:
      "Research on the investment landscape for EV charging infrastructure and opportunities in fleet electrification.",
    images: ["/images/ev-charging-article1.jpg"],
  },
};

export default function EVChargingLayout({
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
              "Why EV Charging Is the Infrastructure Investment of the Decade",
            description:
              "Research on the investment landscape for EV charging infrastructure and opportunities in fleet electrification.",
            datePublished: "2026-03-15",
            author: {
              "@type": "Organization",
              name: "Claro Connects",
            },
            image:
              "https://claroconnects.com/images/ev-charging-article1.jpg",
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
