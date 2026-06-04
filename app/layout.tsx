import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Toaster } from "sonner";

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
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}