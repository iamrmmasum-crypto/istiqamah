import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Istiqamah — Habit & Discipline Tracker",
  description:
    "Stay steadfast, one check-in at a time. Track habits, keep streaks alive, and walk the straight path with istiqamah.",
  keywords: ["habit tracker", "discipline", "streaks", "productivity", "Istiqamah", "ইস্তিকামাহ"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Istiqamah — Habit & Discipline Tracker",
    description: "Stay steadfast, one check-in at a time.",
    siteName: "Istiqamah",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
