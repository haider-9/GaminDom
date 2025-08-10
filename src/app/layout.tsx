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
});

export const metadata: Metadata = {
  title: "GaminDom",
  description: "A platform for gamers to connect and share",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} font-Orbitron`}>
        <ThemeProvider>
          <FavoritesProvider>
            <Toaster />
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
