import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import LenisProvider from "../components/ui/lenis-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Podóloga em São José dos Campos | Suellen Mello | Especialista em Unhas Infeccionadas e Laser",
  description: "Podóloga Suellen Mello, desde 2006 em São José dos Campos. Especialista em unhas infeccionadas e tratamento a laser. Agende sua avaliação pelo WhatsApp.",
  keywords: "podologia, podologa, são josé dos campos, sjc, unha encravada, unha infeccionada, laserterapia podologia, tratamento a laser, micose de unha, calosidades",
  authors: [{ name: "Suellen A. de Mello" }],
  openGraph: {
    type: "website",
    url: "https://suellenpodologa.com.br/",
    title: "Podóloga em São José dos Campos | Suellen Mello | Especialista em Unhas Infeccionadas e Laser",
    description: "Podóloga Suellen Mello, desde 2006 em São José dos Campos. Especialista em unhas infeccionadas e tratamento a laser. Agende sua avaliação pelo WhatsApp.",
    images: [{ url: "/assets/image/clinica 1.jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Podóloga em São José dos Campos | Suellen Mello | Especialista em Unhas Infeccionadas e Laser",
    description: "Podóloga Suellen Mello, desde 2006 em São José dos Campos. Especialista em unhas infeccionadas e tratamento a laser. Agende sua avaliação pelo WhatsApp.",
    images: ["/assets/image/clinica 1.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦶</text></svg>" />
      </head>
      <body>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
