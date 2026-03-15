import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import ResearchSection from "@/components/ResearchSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WhatWeDoSection />
        <ResearchSection />
        <ShowcaseSection />
      </main>
      <Footer />
    </>
  );
}
