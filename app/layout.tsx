import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Configuração das Fontes
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-serif", // Vamos usar esta variavel no CSS
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Elinara Labs | Economic Venture Studio",
  description: "Da Teoria Económica à Solução de Software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans bg-[#0a0a0a] antialiased`}>
        {children}
      </body>
    </html>
  );
}