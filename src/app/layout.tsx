import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Convergence } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const convergence = Convergence({
  weight: "400",
  variable: "--font-convergence",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ricardo Tocha | Automatização para Marketing e Vendas",
  description: "Ajudo profissionais de marketing e vendas a entregar mais resultados, com menos esforço. Automatizando as tarefas que consomem tempo e agregam pouco aos resultados.",
  keywords: [
    "automatização de marketing", 
    "qualificação automática de leads", 
    "geração de conteúdo", 
    "fluxos inteligentes", 
    "integração de plataformas", 
    "apuração de resultados",
    "marketing digital",
    "Ricardo Tocha"
  ],
  authors: [{ name: "Ricardo Tocha" }],
  creator: "Ricardo Tocha",
  publisher: "Ricardo Tocha",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'apple-touch-icon',
      url: '/favicon.ico',
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://ricardotocha.com.br",
    title: "Ricardo Tocha | Automatização para Marketing e Vendas",
    description: "Automatização inteligente para profissionais de marketing e vendas",
    siteName: "Ricardo Tocha",
    images: [
      {
        url: "/images/tocha_concentrado_trabalhando_em_um_mac_em_um_ambiente_moderno_e_bem_iluminado_4iok5b6eh8zw79pwchsc_0.webp",
        width: 1200,
        height: 630,
        alt: "Ricardo Tocha"
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${convergence.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
