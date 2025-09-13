import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Android Week Planner",
  description: "A beautiful Android-style weekly planner with todo lists and smooth animations",
  keywords: ["week planner", "todo", "android", "productivity", "calendar"],
  authors: [{ name: "Week Planner App" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1976d2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Week Planner" />
      </head>
      <body 
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}