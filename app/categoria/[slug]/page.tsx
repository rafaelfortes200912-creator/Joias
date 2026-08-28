"use client";
import { useParams } from "next/navigation";
import { useAdmin } from "@/app/contexts/AdminContext";
import Link from "next/link";

const nomesCategorias: Record<string, string> = {
  aneis: "Anéis",
  colares: "Colares",
  brincos: "Brincos",
  pulseiras: "Pulseiras",
  relogios: "Relógios",
  conjuntos: "Conjuntos",
};

export default function CategoriaPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug as string);
  const { produtos } = useAdmin();
  const nomeCategoria = nomesCategorias[slug] || slug;
  const produtosFiltrados = produtos.filter(
    (p) => p.categoria.toLowerCase() === nomeCategoria.toLowerCase()
  );

  return (
    <div className="text-texto">
      <nav className="text-sm text-texto-cinza mb-6 px-4 py-2">
        <Link href="/" className="hover:text-primaria">Início</Link>
        <span className="mx-2">»</span>
        <span className="text-primaria">{nomeCategoria}</span>
      </nav>

      <h1 className="text-2xl font-bold px-4 mb-6 text-primaria tracking-wide">{nomeCategoria}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-4 pb-16">
        {produtosFiltrados.map((produto) => (
          <Link href={`/produto/${produto.id}`} key={produto.id} className="block h-full">
            <div className="bg-card border border-borda rounded-2xl shadow-md overflow-hidden relative hover:border-primaria/50 hover:scale-105 transition-transform flex flex-col h-full">
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
    </div>
  );
}