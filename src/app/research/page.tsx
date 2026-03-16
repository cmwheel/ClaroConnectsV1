import type { Metadata } from "next";
import ResearchClient from "./ResearchClient";

export const metadata: Metadata = {
  title: "Research",
  description:
    "In-depth research and analysis on autonomous vehicle infrastructure, EV charging networks, and fleet corridor development.",
};

export default function ResearchPage() {
  return <ResearchClient />;
}
