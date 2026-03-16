import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Tesla Semi Advantage",
  description:
    "Analysis of Tesla's strategic advantage in the electric semi-truck market and its implications for freight infrastructure.",
  openGraph: {
    type: "article",
    title: "The Tesla Semi Advantage",
    description:
      "Analysis of Tesla's strategic advantage in the electric semi-truck market and its implications for freight infrastructure.",
    images: [{ url: "/images/article1.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Tesla Semi Advantage",
    description:
      "Analysis of Tesla's strategic advantage in the electric semi-truck market and its implications for freight infrastructure.",
    images: ["/images/article1.jpg"],
  },
};

export default function TeslaSemiLayout({
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
            headline: "The Tesla Semi Advantage",
            description:
              "Analysis of Tesla's strategic advantage in the electric semi-truck market and its implications for freight infrastructure.",
            datePublished: "2026-03-15",
            author: {
              "@type": "Organization",
              name: "Claro Connects",
            },
            image: "https://claroconnects.com/images/article1.jpg",
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
