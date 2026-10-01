import type { Metadata } from "next";
import { Archivo_Black, JetBrains_Mono, Lora } from "next/font/google";
import "./globals.css";

import { VisitBeacon } from "@/components/visit-beacon";

// wordmark face used only for the mark
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// nav brand only — a plain classical serif, variable across the weights the
// wordmark and its 700 mark need
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VOID CTF",
  description:
    "A 24-hour offensive security gauntlet carved into the dunes. 42 vaults, one wasteland, no hints.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // data-theme / data-intro are set pre-paint by the inline script below
      suppressHydrationWarning
      className={`${archivoBlack.variable} ${jetbrainsMono.variable} ${lora.variable} h-full antialiased`}
    >
      <head>
        {/* the preloader clip is the first thing on screen and the largest
            asset on the page; without this the browser only discovers it when
            the video element mounts, which delays the whole intro */}
        <link
          rel="preload"
          as="video"
          href="/media/preloader-facility.mp4"
          type="video/mp4"
          media="(prefers-reduced-motion: no-preference)"
        />
      </head>
      <body className="flex min-h-full flex-col bg-iron-950">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('void-theme')==='deep')document.documentElement.setAttribute('data-theme','deep')}catch(e){}try{if(/(?:^|; )void-intro=1/.test(document.cookie))document.documentElement.setAttribute('data-intro','seen')}catch(e){}`,
          }}
        />
        {children}
        <VisitBeacon />
      </body>
    </html>
  );
}
