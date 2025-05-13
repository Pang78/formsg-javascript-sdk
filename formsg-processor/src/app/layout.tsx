import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FileText, Database, FileUp, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: "FormSG Processor",
  description: "Consolidate, decrypt, and transform your FormSG submissions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="container flex h-16 items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold text-xl">FormSG Processor</span>
              </Link>
              <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
                <Link href="/" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
                <Link href="/forms" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                  <FileText className="mr-2 h-4 w-4" />
                  Forms
                </Link>
                <Link href="/submissions" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                  <Database className="mr-2 h-4 w-4" />
                  Submissions
                </Link>
                <Link href="/export" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                  <FileUp className="mr-2 h-4 w-4" />
                  Export
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
