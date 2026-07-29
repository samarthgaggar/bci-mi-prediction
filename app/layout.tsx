import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  Manrope,
} from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

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
  title: "Signals in Motion · A BCI Research Journey",
  description:
    "Board a playful scientific journey through motor-imagery BCI research, from brain signals and data collection to careful evaluation.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Signals in Motion",
    description:
      "A journey through motor-imagery brain–computer interface research.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Signals in Motion, with a luminous brain crossed by a glowing neural transit route.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Signals in Motion",
    description:
      "A journey through motor-imagery brain–computer interface research.",
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
        className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
