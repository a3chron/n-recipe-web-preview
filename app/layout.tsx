import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Mono({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "n-recipe Hub",
  description: "Browse and share n-recipe recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="ctp-latte dark:ctp-mocha">
      <body
        className={`${plex.className} bg-ctp-base text-ctp-text transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
