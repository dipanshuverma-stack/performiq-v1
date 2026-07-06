import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PerformIQ",
  description: "Performance optimization for your banking exam preparation",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-[#090D16] dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          {children}

          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}