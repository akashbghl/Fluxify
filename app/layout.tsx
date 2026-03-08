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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fluxify.akashbaghel.in"),
  title: {
    default: "Fluxify | Library Management Software",
    template: "%s | Fluxify",
  },
  description:
    "Fluxify helps libraries manage students, seats, shifts, attendance, payments, reminders, and analytics from one dashboard.",
  applicationName: "Fluxify",
  keywords: [
    "Fluxify",
    "Fluxifyio",
    "Fluxify Library Management Software",
    "Akash Baghel",
    "library management software",
    "student seat management",
    "attendance tracking",
    "library payment tracking",
    "library dashboard",
  ],
  alternates: {
    canonical: "https://fluxify.akashbaghel.in",
  },
  openGraph: {
    type: "website",
    url: "https://fluxify.akashbaghel.in",
    siteName: "Fluxify",
    title: "Fluxify | Library Management Software",
    images: ["https://fluxify.akashbaghel.in/NLogo.jpg"
    ],
    description:
      "Fluxify helps libraries manage students, seats, shifts, attendance, payments, reminders, and analytics from one dashboard.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluxify | Library Management Software",
    description:
      "Fluxify helps libraries manage students, seats, shifts, attendance, payments, reminders, and analytics from one dashboard.",
    creator: "@akashbaghel",
    images: ["https://fluxify.akashbaghel.in/NLogo.jpg"],
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
