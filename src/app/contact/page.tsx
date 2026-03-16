import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Claro Connects to discuss autonomous fleet infrastructure, site selection, and research partnerships.",
};

export default function ContactPage() {
  return <ContactClient />;
}
