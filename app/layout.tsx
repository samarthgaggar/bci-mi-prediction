import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@fontsource/fragment-mono/400.css";

import { siteDescription, siteTitle } from "@/lib/site-content";

import "./globals.css";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  authors: [{ name: "The Data Miners" }],
  creator: "The Data Miners",
  applicationName: "BCI Performance Variability Research",
  keywords: [
    "brain-computer interface",
    "motor imagery",
    "EEG",
    "performance variability",
    "research integrity",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    title: siteTitle,
    description: siteDescription,
    siteName: "BCI Performance Variability Research",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
