"use client";
import { useState } from "react";
import Link from "next/link";
import BannerCarrossel from "./components/BannerCarrossel";
import { banners } from "@/src/data/banners";
import BotaoAdmin from "./components/BotaoAdmin";
import ModalAdmin from "./components/ModalAdmin";
import { useAdmin } from "./contexts/AdminContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HomeContent() {
  const { produtos } = useAdmin();
  const searchParams = useSearchParams();
  const buscaUrl = searchParams.get("busca") || "";
  const [adminAberto, setAdminAberto] = useState(false);

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(buscaUrl.toLowerCase())
  );

  return (
    <div>
      <BannerCarrossel banners={banners} />

      <div id="produtos" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-4 pb-16">
        {produtosFiltrados.map((produto) => (
          <Link href={`/categoria/${produto.categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
            <div className="bg-card border border-borda rounded-2xl shadow-md overflow-hidden relative hover:border-primaria/50 hover:scale-105 transition-transform flex flex-col">
              <div className="aspect-square bg-card-escuro">
                <img src={produto.imagem || "/placeholder.png"} alt={produto.nome} className="w-full h-full object-cover" />
              </div>
              {produto.precoOriginal && (
                <span className="bg-primaria text-black text-xs px-2 py-0.5 rounded-full absolute top-2 left-2 font-bold">
                  -{Math.round(((produto.precoOriginal - produto.preco) / produto.precoOriginal) * 100)}%
                </span>
              )}
              <div className="p-3 flex flex-col gap-1">
                <h3 className="font-semibold text-base truncate w-full text-primaria" title={produto.nome}>{produto.nome}</h3>
                {produto.precoOriginal && (
                  <p className="text-texto-cinza text-xs line-through">Kz {produto.precoOriginal.toFixed(2)}</p>
                )}
                <p className="text-primaria font-bold text-lg">Kz {produto.preco.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <BotaoAdmin onAbrir={() => setAdminAberto(true)} />
      {adminAberto && <ModalAdmin onClose={() => setAdminAberto(false)} />}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-texto text-center py-20">Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}