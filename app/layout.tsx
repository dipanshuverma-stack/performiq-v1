import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "PerformIQ",
  description: "Performance optimization for your studies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-[#090D16] dark:text-slate-100 transition-colors duration-300"
        suppressHydrationWarning
      >
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