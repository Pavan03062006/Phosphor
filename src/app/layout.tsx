import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Navbar } from "@/components/layout/Navbar";
import { VideoBackground } from "@/components/layout/VideoBackground";
import { config } from "@/lib/wagmi";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-terminal-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "phosphor — On-Chain Cyber Forensics Toolkit",
  description:
    "phosphor ingests mempool activity, tracks contract events, and simulates exploit paths for Monad threat researchers.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Reads wagmi's cookie on the server, so the first paint already knows the
  // user is connected — no connect-button flicker on reload.
  const initialState = cookieToInitialState(config, (await headers()).get("cookie"));

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[--color-void] text-[--color-fg]">
        <VideoBackground />
        <Providers initialState={initialState}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
