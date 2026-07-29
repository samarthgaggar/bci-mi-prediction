import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bci-performance-variability.ucd-cosmos-a-8231.chatgpt.site"),
  title: "Can Computers Read Minds? · BCI Signal Journey",
  description:
    "Travel through a brain and discover how motor-imagery BCI research turns measurable signals into carefully tested predictions.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Can Computers Read Minds?",
    description:
      "A playful, evidence-first journey through motor-imagery brain–computer interface research.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Can Computers Read Minds? A coral and blue brain crossed by glowing signal paths.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Can Computers Read Minds?",
    description:
      "A playful, evidence-first journey through motor-imagery brain–computer interface research.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
