import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Manrope,
} from "next/font/google";
import "./globals.css";

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bci-performance-variability.ucd-cosmos-a-8231.chatgpt.site"),
  title: "Can Computers Read Minds? · Motor Imagery BCI",
  description:
    "See how EEG and machine learning can distinguish imagined hand movements across different participants.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Can Computers Read Minds?",
    description:
      "This site shows our EEG dataset, models, graphs, and final test results.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Predicting motor imagery from EEG with a brain graphic and EEG line.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Can Computers Read Minds?",
    description:
      "How EEG and machine learning can recognize imagined movement patterns across different people.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${body.variable} ${mono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
