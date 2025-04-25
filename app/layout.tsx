import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "$uncensored - Ask Me Anything (Literally)",
  description: "Uncensored AI chat. Ask me anything. Literally.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "$uncensored - Ask Me Anything (Literally)",
    description: "Uncensored AI chat. Ask me anything. Literally.",
    type: "website",
    siteName: "$uncensored",
    images: [
      {
        url: "/opengraph-image.png", // You can add a custom OG image here
        width: 1200,
        height: 630,
        alt: "$uncensored logo",
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
        {children}
      </body>
    </html>
  );
}
