import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import CircularFloatingMenu from "@/components/CircularFloatingMenu";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import RightSidebar from "@/components/RightSideBar";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-Orbitron",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gamindom.vercel.app'),
  title: {
    default: "GaminDom | Discover & Explore Video Games",
    template: "%s | GaminDom"
  },
  description: "Your ultimate destination for everything gaming! Discover trending games, browse by genre and platform, read reviews, and stay updated with the latest gaming news powered by RAWG API.",
  keywords: [
    "gaming",
    "video games",
    "game discovery",
    "game reviews",
    "gaming news",
    "RAWG API",
    "game database",
    "PC games",
    "console games",
    "game genres",
    "game platforms",
    "gaming community",
    "latest games",
    "trending games",
    "game search"
  ],
  authors: [{ name: "Haider Ahmad" }],
  creator: "Haider Ahmad",
  publisher: "GaminDom",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamindom.vercel.app",
    title: "GaminDom | Discover & Explore Video Games",
    description: "Your ultimate destination for everything gaming! Discover trending games, browse by genre and platform, and stay updated with the latest gaming news.",
    siteName: "GaminDom",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GaminDom - Gaming Discovery Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GaminDom | Discover & Explore Video Games",
    description: "Your ultimate destination for everything gaming! Discover trending games and stay updated with gaming news.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/Logo.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://gamindom.vercel.app",
  },
  category: "gaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.rawg.io" />
        <link rel="dns-prefetch" href="https://api.rawg.io" />
        <meta name="theme-color" content="#361518" />
      </head>
      <body className={`${orbitron.variable} font-Orbitron`}>
        <ThemeProvider>
          <FavoritesProvider>
            <Toaster position="top-right" />
            <Header />
            <CircularFloatingMenu />
            <RightSidebar />
            {children}
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
