import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BangRajan Muaythai Boxing Camp",
  description:
    "Latih mental, bentuk fisik, jadi petarung. Bergabunglah dengan BangRajan Muaythai Boxing Camp — tempat terbaik untuk latihan Muaythai profesional.",
  keywords: ["muaythai", "boxing", "gym", "camp", "latihan", "BangRajan"],
  openGraph: {
    title: "BangRajan Muaythai Boxing Camp",
    description: "Latih mental, bentuk fisik, jadi petarung.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-body)" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
