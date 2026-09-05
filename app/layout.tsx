import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { withBasePath } from "./site-path";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REVOLUTION | Club",
  description: "작은 움직임이 세상을 바꿉니다.",
  icons: {
    icon: [
      { url: withBasePath("/favicon-32.png"), sizes: "32x32", type: "image/png" },
      { url: withBasePath("/icon-192.png"), sizes: "192x192", type: "image/png" },
      { url: withBasePath("/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
    shortcut: withBasePath("/favicon-32.png"),
    apple: withBasePath("/apple-touch-icon.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
