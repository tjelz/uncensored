import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "$ama - Ask Me Anything (Literally)",
  description: "Uncensored AI chat. Ask me anything. Literally.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "$ama - Ask Me Anything (Literally)",
    description: "Uncensored AI chat. Ask me anything. Literally.",
    type: "website",
    siteName: "$ama",
    images: [
      {
        url: "/opengraph-image.png", // You can add a custom OG image here
        width: 1200,
        height: 630,
        alt: "$ama logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body
        className={`${leagueSpartan.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-league-spartan), sans-serif' }}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
