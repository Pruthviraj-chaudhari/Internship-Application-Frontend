import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { facultyNavItems } from "@/constants/data";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IIT Bombay",
  description: "Generated by create next app",
  icons: "vercel.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/nexticon.svg" sizes="any" />
      </head>
      <body className={`${inter.className} overflow-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header navItems={facultyNavItems} />
          <div className="flex h-screen overflow-hidden">
            <Sidebar navItems={facultyNavItems} />
            <main className="w-full pt-16">{children}</main>
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
