"use client";
import { useParams } from "next/navigation";
import { useAdmin } from "@/app/contexts/AdminContext";
import Link from "next/link";
import { useState, useRef } from "react";
import { useCarrinho } from "@/app/contexts/CarrinhoContext";
import { useAvaliacao } from "@/app/contexts/AvaliacaoContext";
import { useAuth } from "@/app/contexts/AuthContext";
import VisualizadorImagens from "../../components/VisualizadorImagens";

export default function ProdutoPage() {
  const params = useParams();
  const { produtos } = useAdmin();
  const produto = produtos.find((p) => p.id === Number(params.id));
  const { adicionar } = useCarrinho();
  const [noCarrinho, setNoCarrinho] = useState(false);
  const [quantidade, setQuantidade] = useState(1);

  const { usuario } = useAuth();
  const { getAvaliacoes, adicionarComentario, getMedia } = useAvaliacao();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [texto, setTexto] = useState("");
  const [nota, setNota] = useState(0);
  const [imagens, setImagens] = useState<string[]>([]);
  const [visualizarImagens, setVisualizarImagens] = useState<string[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!produto) return <p className="text-texto">Produto não encontrado</p>;

  const estoque = produto.estoque || 0;
  const avaliacoes = getAvaliacoes(produto.id);
  const media = getMedia(produto.id);
  const jaAvaliou = avaliacoes.avaliadores.includes(usuario?.email || "");

  const handleAdicionar = () => {
    for (let i = 0; i < quantidade; i++) {
      adicionar({ id: produto.id, nome: produto.nome, preco: produto.preco, imagem: produto.imagem });
    }
    setNoCarrinho(true);
    setTimeout(() => setNoCarrinho(false), 2000);
  };

  const handleImagensUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const novasImagens: string[] = [];
    let carregadas = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        novasImagens.push(reader.result as string);
        carregadas++;
        if (carregadas === files.length) {
          setImagens((prev) => [...prev, ...novasImagens]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removerImagem = (index: number) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="text-texto">
      <nav className="text-sm text-texto-cinza mb-6 px-4 py-2">
        <Link href="/" className="hover:text-primaria">Início</Link>
        <span className="mx-2">»</span>
        <Link href={`/categoria/${produto.categoria.toLowerCase()}`} className="hover:text-primaria">{produto.categoria}</Link>
        <span className="mx-2">»</span>
        <span className="text-primaria">{produto.nome}</span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <img src={produto.imagem} alt={produto.nome} className="w-80 h-80 object-cover rounded-xl border border-borda" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-primaria">{produto.nome}</h1>
          <p className="text-texto-cinza mt-2">{produto.descricao}</p>
          {produto.precoOriginal && (
            <p className="text-texto-cinza line-through mt-4">Kz {produto.precoOriginal.toFixed(2)}</p>
          )}
          <p className="text-primaria font-bold text-2xl">Kz {produto.preco.toFixed(2)}</p>
          <p className="text-sm text-texto-cinza mt-1">{estoque} unidades disponíveis</p>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-borda rounded-lg">
              <button onClick={() => setQuantidade(q => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-card-escuro transition-colors text-primaria">−</button>
              <input type="number" value={quantidade}
                onChange={(e) => setQuantidade(Math.min(estoque, Math.max(1, Number(e.target.value))))}
                className="w-14 text-center py-2 bg-transparent text-texto outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
              <button onClick={() => setQuantidade(q => Math.min(estoque, q + 1))}
                className="px-3 py-2 hover:bg-card-escuro transition-colors text-primaria">+</button>
            </div>
            {estoque > 0 ? (
              <button onClick={handleAdicionar}
                className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                  noCarrinho ? "bg-primaria-hover text-black" : "bg-primaria text-black hover:bg-primaria-hover"
                }`}>
                {noCarrinho ? "✓ Adicionado" : "Adicionar ao Carrinho"}
              </button>
            ) : (
              <p className="px-6 py-3 rounded-lg font-bold text-white bg-red-500 text-center">Fora de Estoque</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 border-t border-borda">
        <h2 className="text-xl font-bold mb-4 text-primaria">Avaliações</h2>

        <div className="flex items-center gap-2 mb-4">
          <div className="text-primaria text-2xl">
            {[1, 2, 3, 4, 5].map((e) => (<span key={e}>{e <= Math.round(media) ? "⭐" : "☆"}</span>))}
          </div>
          <span className="text-texto-cinza">({avaliacoes.comentarios.length} comentários)</span>
        </div>

        {!mostrarForm && usuario && (
          <button onClick={() => setMostrarForm(true)}
            className="bg-primaria text-black px-4 py-2 rounded-lg hover:bg-primaria-hover transition-colors mb-4 font-bold">
            {jaAvaliou ? "Comentar" : "Avaliar Produto"}
          </button>
        )}
        {!mostrarForm && !usuario && (
          <p className="text-texto-cinza text-sm mb-4">🔒 Faça login para deixar uma avaliação.</p>
        )}

        {mostrarForm && (
          <form onSubmit={(e) => {
            e.preventDefault();
            adicionarComentario(produto.id, texto, nota, imagens);
            setMostrarForm(false);
            setTexto("");
            setNota(0);
            setImagens([]);
          }} className="bg-card-escuro p-4 rounded-lg mb-6 border border-borda">
            <p className="text-sm text-texto-cinza mb-2">Comentando como <strong className="text-primaria">{usuario?.nome}</strong></p>
            <textarea placeholder="Seu comentário" value={texto} onChange={(e) => setTexto(e.target.value)}
              className="w-full p-2 rounded border border-borda bg-card text-texto mb-2" rows={3} required />

            {!jaAvaliou && (
              <div className="flex gap-1 mb-2 text-2xl">
                {[1, 2, 3, 4, 5].map((e) => (
                  <button type="button" key={e} onClick={() => setNota(e)}>
                    {e <= nota ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            )}

            <div className="mb-2">
              <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleImagensUpload} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="text-sm text-primaria hover:underline">📷 Adicionar fotos</button>
              {imagens.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {imagens.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} className="w-16 h-16 object-cover rounded" />
                      <button type="button" onClick={() => removerImagem(i)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-primaria text-black px-4 py-2 rounded-lg hover:bg-primaria-hover font-bold">Enviar</button>
              <button type="button" onClick={() => { setMostrarForm(false); setImagens([]); }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
            </div>
          </form>
        )}

        {avaliacoes.comentarios.length === 0 ? (
          <p className="text-texto-cinza">Nenhum comentário ainda.</p>
        ) : (
          <div className="space-y-3">
            {avaliacoes.comentarios.map((c) => (
              <div key={c.id} className="bg-card-escuro p-3 rounded-lg border border-borda">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primaria">{c.nome}</span>
                  {c.nota > 0 && <span className="text-primaria text-sm">{"⭐".repeat(c.nota)}</span>}
                  <span className="text-texto-cinza text-xs">{c.data}</span>
                </div>
                <p className="text-texto mt-1">{c.texto}</p>
                {c.imagens && c.imagens.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {c.imagens.map((img, i) => (
                      <img key={i} src={img} className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => setVisualizarImagens(c.imagens)} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {visualizarImagens && <VisualizadorImagens imagens={visualizarImagens} onClose={() => setVisualizarImagens(null)} />}
    </div>
  );
}