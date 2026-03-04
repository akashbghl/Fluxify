import type { Metadata } from "next";
import HomePageClient from "@/components/landing/HomePageClient";

export const metadata: Metadata = {
  title: "Fluxify | Library Management Platform",
  description:
    "Fluxify is a modern library management platform to handle student enrollments, seat and shift allocations, attendance, fee tracking, reminders, and reports.",
  alternates: {
    canonical: "/",
  },
};

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Fluxify",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Fluxify is a modern library management platform to handle student enrollments, seat and shift allocations, attendance, fee tracking, reminders, and reports.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <HomePageClient />
    </>
  );
}
