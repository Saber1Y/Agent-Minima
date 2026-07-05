import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Minima — Zero-Knowledge Disclosure Agent",
  description:
    "Prove just enough. Reveal nothing else. Minima decides the minimum data a request needs, proves it with ZK, and acts on your behalf.",
  openGraph: {
    title: "Minima — ZK Disclosure Agent",
    description:
      "Prove just enough. Reveal nothing else. Minima decides the minimum data a request needs, proves it with ZK, and acts on your behalf.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-surface text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
