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
  title: "WhatsStats Pro — WhatsApp Chat Analytics & Wrapped",
  description: "Discover who texts first, response time dynamics, late night chats, chat chemistry, awards, and export your WhatsApp Wrapped story.",
  keywords: ["whatsapp analytics", "whatsapp stats", "whatsapp wrapped", "who texts first", "response time stats"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#080C14] text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
