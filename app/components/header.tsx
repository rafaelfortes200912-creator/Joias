"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCarrinho } from "../contexts/CarrinhoContext";
import { useAuth } from "../contexts/AuthContext";
import ModalCarrinho from "./ModalCarrinho";
import ModalHistorico from "./ModalHistorico";
import ModalLogin from "./ModalLogin";
import { objetivoLoja } from "@/src/data/banners";

const categorias = [
  { nome: "Anéis", href: "/categoria/aneis" },
  { nome: "Colares", href: "/categoria/colares" },
  { nome: "Brincos", href: "/categoria/brincos" },
  { nome: "Pulseiras", href: "/categoria/pulseiras" },
  { nome: "Relógios", href: "/categoria/relogios" },
  { nome: "Conjuntos", href: "/categoria/conjuntos" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const { quantidadeTotal } = useCarrinho();
  const { usuario } = useAuth();
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [loginAberto, setLoginAberto] = useState(false);
  const [busca, setBusca] = useState("");

  const irParaBusca = () => {
    if (busca.trim()) {
      router.push(`/?busca=${encodeURIComponent(busca)}`);
    }
  };

  return (
    <>
      <header className="bg-card text-texto px-4 py-3 flex flex-col gap-2 border-b border-borda">
        <div className="flex items-center justify-between mb-3 gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-widest uppercase text-primaria">Glamour</h1>
          </div>

          <div className="flex-1 overflow-hidden mx-4 hidden sm:block bg-card-escuro rounded-full border border-borda">
            <div className="animate-marquee whitespace-nowrap py-1">
              <p className="text-primaria/80 text-xs inline-block">{objetivoLoja} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {objetivoLoja}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => usuario ? router.push("/perfil") : setLoginAberto(true)}
              className="flex items-center gap-1 hover:text-primaria transition-colors text-xl"
              title={usuario ? `Perfil (${usuario.nome})` : "Entrar"}>
              👤
            </button>
            {usuario && <span className="text-xs text-texto-cinza hidden sm:block">{usuario.nome}</span>}
            <button onClick={() => setHistoricoAberto(!historicoAberto)} className="hover:text-primaria transition-colors text-2xl">
              📄
            </button>
            <div className="relative">
              <button onClick={() => setCarrinhoAberto(!carrinhoAberto)} className="hover:text-primaria transition-colors text-2xl">
                🛒
              </button>
              {quantidadeTotal > 0 && (
                <span className="absolute -top-2 -right-2 bg-primaria text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {quantidadeTotal}
                </span>
              )}
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/" className={`hover:text-primaria transition-colors ${pathname === "/" ? "text-primaria font-bold" : ""}`}>
            Início
          </Link>

          <div className="relative">
            <button onClick={() => setMenuAberto(!menuAberto)} className="hover:text-primaria transition-colors flex items-center gap-1">
              Categorias ▾
            </button>
            {menuAberto && (
              <div className="absolute top-full left-0 mt-2 bg-card text-texto rounded-lg shadow-lg py-2 w-48 z-50 border border-borda">
                {categorias.map((cat) => (
                  <Link key={cat.href} href={cat.href} onClick={() => setMenuAberto(false)}
                    className="block px-4 py-2 hover:bg-card-escuro hover:text-primaria transition-colors text-sm">
                    {cat.nome}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setBuscaAberta(!buscaAberta)}
          className={`hover:text-primaria transition-all duration-300 text-xl ${buscaAberta ? "rotate-90 text-primaria" : ""}`}
          title="Buscar">
          🔍
        </button>
        
        </nav>

        <div className={`transition-all duration-300 overflow-hidden ${buscaAberta ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>
  <div className="flex items-center gap-2 px-2 py-2">
    <input
      type="text"
      placeholder="Buscar joia..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && irParaBusca()}
      className="flex-1 p-2 rounded-lg border border-borda bg-card-escuro text-texto placeholder-texto-cinza focus:outline-none focus:ring-2 focus:ring-primaria"
      autoFocus
    />
    <button onClick={irParaBusca}
      className="bg-primaria text-black px-4 py-2 rounded-lg hover:bg-primaria-hover font-bold">
      Buscar
    </button>
  </div>
</div>

      </header>
      {carrinhoAberto && <ModalCarrinho onClose={() => setCarrinhoAberto(false)} />}
      {historicoAberto && <ModalHistorico onClose={() => setHistoricoAberto(false)} />}
      {loginAberto && <ModalLogin onClose={() => setLoginAberto(false)} />}
    </>
  );
}