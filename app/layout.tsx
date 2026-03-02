import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Fluxify | Library Management Software",
    template: "%s | Fluxify",
  },
  description:
    "Fluxify helps libraries manage students, seats, shifts, attendance, payments, reminders, and analytics from one dashboard.",
  applicationName: "Fluxify",
  keywords: [
    "library management software",
    "student seat management",
    "attendance tracking",
    "library payment tracking",
    "library dashboard",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Fluxify",
    title: "Fluxify | Library Management Software",
    description:
      "Run your library operations with student management, attendance, payment tracking, and smart reminders.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluxify | Library Management Software",
    description:
      "Manage your library with modern student, attendance, payment and analytics workflows.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
