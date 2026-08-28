import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import ParticulasFundo from "./components/ParticulasFundo";
import { CarrinhoProvider } from "./contexts/CarrinhoContext";
import { AvaliacaoProvider } from "./contexts/AvaliacaoContext";
import { HistoricoProvider } from "./contexts/HistoricoContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glamour",
  description: "Joias finas e semijoias para todos os momentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-pt" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-fundo text-texto">
        <AuthProvider>
        <AdminProvider>
        <CarrinhoProvider>
        <HistoricoProvider>
        <AvaliacaoProvider>
        <Header />
        {children}
        <footer className="bg-card text-texto-cinza py-8 mt-auto border-t border-borda">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm">
            <p className="text-primaria font-bold tracking-widest uppercase">Glamour</p>
            <p className="mt-2">© 2026 Glamour. Todos os direitos reservados.</p>
          </div>
        </footer>
        </AvaliacaoProvider>
        </HistoricoProvider>
        </CarrinhoProvider>
        </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}