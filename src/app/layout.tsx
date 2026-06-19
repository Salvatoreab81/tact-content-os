import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TACT Content OS | Next Content Digital Labs",
  description:
    "AI-powered content management system for brands. Plan, create, and schedule content across all platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-[#050505] text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
