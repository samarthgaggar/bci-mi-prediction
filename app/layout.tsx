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
  title: "Predicting Motor Imagery from EEG · BCI Research Project",
  description:
    "A visual journey through nine data-science stages, from EEG acquisition to a 60.20% locked motor-imagery result.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Predicting Motor Imagery from EEG",
    description:
      "Travel through a graph-led EEG pipeline from problem formulation to a 60.20% locked result.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Predicting Motor Imagery from EEG, shown with a luminous brain and EEG signal pathway.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Predicting Motor Imagery from EEG",
    description:
      "Nine visual stages from EEG acquisition to honest locked evaluation.",
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
