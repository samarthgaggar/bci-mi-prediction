import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/newsreader";
import { headers } from "next/headers";

import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { BciPageRevealProvider } from "@/components/ui/bci-page-reveal";
import { siteTitle } from "@/lib/research-content";

import "./globals.css";

const description =
  "A working research record for motor-imagery brain-computer interface performance variability. Cleaning is in progress; analysis and results are pending.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const socialImage = new URL("/og.png", `${protocol}://${host}`).toString();

  return {
    title: {
      default: siteTitle,
      template: `%s · ${siteTitle}`,
    },
    description,
    authors: [{ name: "The Data Miners" }],
    creator: "The Data Miners",
    applicationName: "BCI Performance Variability Research",
    keywords: [
      "brain-computer interface",
      "motor imagery",
      "EEG",
      "performance variability",
      "research",
    ],
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      type: "website",
      title: siteTitle,
      description,
      siteName: "BCI Performance Variability Research",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "BCI Performance Variability research cover",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <BciPageRevealProvider>
            <a className="skip-link" href="#main-content">
              Skip to content
            </a>
            <SiteHeader />
            {children}
          </BciPageRevealProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
