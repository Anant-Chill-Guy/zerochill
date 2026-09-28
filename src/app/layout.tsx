import type { Metadata } from "next";
import { Archivo_Black, Croissant_One, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

// nav brand only ships at 400
const croissantOne = Croissant_One({
  variable: "--font-croissant",
  weight: "400",
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
      className={`${archivoBlack.variable} ${jetbrainsMono.variable} ${croissantOne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-iron-950">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('void-theme')==='deep')document.documentElement.setAttribute('data-theme','deep')}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
