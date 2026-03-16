import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://claroconnects.com"),
  title: {
    default: "Claro Connects | Mapping the Physical Future of Autonomy",
    template: "%s | Claro Connects",
  },
  description:
    "Research and analysis on how autonomous technology is reshaping physical infrastructure, from site selection to fleet corridors.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Claro Connects",
    title: "Claro Connects | Mapping the Physical Future of Autonomy",
    description:
      "Research and analysis on how autonomous technology is reshaping physical infrastructure, from site selection to fleet corridors.",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claro Connects | Mapping the Physical Future of Autonomy",
    description:
      "Research and analysis on how autonomous technology is reshaping physical infrastructure, from site selection to fleet corridors.",
    images: ["/images/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Claro Connects",
              url: "https://claroconnects.com",
              description:
                "Research and analysis on how autonomous technology is reshaping physical infrastructure, from site selection to fleet corridors.",
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
