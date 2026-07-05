import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Minima",
  description: "Zero-Knowledge Disclosure Agent — BTL Hackathon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
