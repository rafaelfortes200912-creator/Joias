"use client";
import { useState, useRef, useEffect } from "react";
import { useAdmin } from "../contexts/AdminContext";

const categorias = ["Anéis", "Colares", "Brincos", "Pulseiras", "Relógios", "Conjuntos"];

type UserData = {
  id: string;
  email: string;
  nome: string;
  criado_em: string;
};

export default function ModalAdmin({ onClose }: { onClose: () => void }) {
  const { produtos, editar, remover, adicionar } = useAdmin();
  const [modo, setModo] = useState<"lista" | "editar" | "criar" | "usuarios">("lista");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [usuarios, setUsuarios] = useState<UserData[]>([]);

  const [nome, setNome] = useState("");
  const [precoNormal, setPrecoNormal] = useState(0);
  const [precoDesconto, setPrecoDesconto] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [categoria, setCategoria] = useState(categorias[0]);
  const [estoque, setEstoque] = useState(0);

  useEffect(() => {
    if (modo === "usuarios") {
      fetch("/api/usuarios").then(r => r.json()).then(setUsuarios);
    }
  }, [modo]);

  const abrirEdicao = (id: number) => {
    const p = produtos.find(prod => prod.id === id);
    if (!p) return;
    setEditandoId(id);
    setNome(p.nome);
    setPrecoNormal(p.precoOriginal || p.preco);
    setPrecoDesconto(p.precoOriginal ? p.preco : 0);
    setDescricao(p.descricao);
    setImagem(p.imagem);
    setCategoria(p.categoria);
    setEstoque(p.estoque);
    setModo("editar");
  };

  const abrirCriacao = () => {
    setEditandoId(null);
    setNome("");
    setPrecoNormal(0);
    setPrecoDesconto(0);
    setDescricao("");
    setImagem("");
    setCategoria(categorias[0]);
    setEstoque(0);
    setModo("criar");
  };

  const handleImagemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagem(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const salvar = () => {
    const dados = {
      nome,
      preco: precoDesconto || precoNormal,
      precoOriginal: precoDesconto ? precoNormal : undefined,
      descricao,
      imagem,
      categoria,
      estoque,
    };

    if (modo === "editar" && editandoId) {
      editar(editandoId, dados);
    } else if (modo === "criar") {
      adicionar(dados);
    }
    setModo("lista");
  };

  const titulo = modo === "lista" ? "⚙️ Gerir Produtos" : modo === "editar" ? "✏️ Editar Produto" : modo === "criar" ? "➕ Novo Produto" : "👥 Usuários";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-borda rounded-xl p-6 w-[700px] max-h-[85vh] overflow-y-auto shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primaria">{titulo}</h2>
          <button onClick={onClose} className="text-texto-cinza hover:text-primaria text-xl">✕</button>
        </div>

        {modo === "lista" && (
          <>
            <div className="flex gap-2 mb-4">
              <button onClick={abrirCriacao} className="bg-primaria text-black px-4 py-2 rounded-lg hover:bg-primaria-hover transition-colors font-bold">
                + Novo Produto
              </button>
              <button onClick={() => setModo("usuarios")} className="bg-card-escuro text-texto px-4 py-2 rounded-lg hover:bg-card transition-colors border border-borda">
                👥 Usuários
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-borda text-texto-cinza">
                  <th className="text-left py-2">Produto</th>
                  <th className="text-center py-2">Preço</th>
                  <th className="text-center py-2">Estoque</th>
                  <th className="text-center py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.id} className="border-b border-borda text-texto">
                    <td className="py-2">{produto.nome}</td>
                    <td className="text-center text-primaria">Kz {produto.preco.toFixed(2)}</td>
                    <td className={`text-center ${produto.estoque === 0 ? "text-red-500 font-bold" : ""}`}>{produto.estoque}</td>
                    <td className="text-center flex gap-2 justify-center">
                      <button onClick={() => abrirEdicao(produto.id)} className="text-primaria hover:underline text-xs">Editar</button>
                      <button onClick={() => remover(produto.id)} className="text-red-500 hover:underline text-xs">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {modo === "usuarios" && (
          <>
            <button onClick={() => setModo("lista")} className="mb-4 text-primaria hover:underline text-sm">← Voltar</button>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-borda text-texto-cinza">
                  <th className="text-left py-2">Nome</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id} className="border-b border-borda text-texto">
                    <td className="py-2">{u.nome}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{u.criado_em}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {(modo === "editar" || modo === "criar") && (
          <form onSubmit={(e) => { e.preventDefault(); salvar(); }} className="flex flex-col gap-3">
            <input placeholder="Nome do produto" value={nome} onChange={e => setNome(e.target.value)} className="p-2 border border-borda rounded bg-card-escuro text-texto" required />
            <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} className="p-2 border border-borda rounded bg-card-escuro text-texto" rows={2} required />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-texto-cinza">Preço do Produto (Kz)</label>
                <input type="number" placeholder="Ex: 15000" value={precoNormal} onChange={e => setPrecoNormal(Number(e.target.value))} className="w-full p-2 border border-borda rounded bg-card-escuro text-texto" required />
              </div>
              <div className="flex-1">
                <label className="text-xs text-texto-cinza">Preço com Desconto (opcional)</label>
                <input type="number" placeholder="Ex: 12000" value={precoDesconto || ""} onChange={e => setPrecoDesconto(Number(e.target.value))} className="w-full p-2 border border-borda rounded bg-card-escuro text-texto" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-texto-cinza">Estoque</label>
                <input type="number" value={estoque} onChange={e => setEstoque(Math.max(0, Number(e.target.value)))} className="w-full p-2 border border-borda rounded bg-card-escuro text-texto" required />
              </div>
            </div>
            <div>
              <label className="text-xs text-texto-cinza">Categoria</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full p-2 border border-borda rounded bg-card-escuro text-texto">
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-texto-cinza">Imagem</label>
              <div className="flex gap-2 items-center">
                <input type="text" placeholder="URL ou escolha um arquivo" value={imagem} onChange={e => setImagem(e.target.value)} className="flex-1 p-2 border border-borda rounded bg-card-escuro text-texto" />
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImagemUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-card-escuro border border-borda px-3 py-2 rounded text-sm">📁</button>
              </div>
              {imagem && <img src={imagem} className="mt-2 w-20 h-20 object-cover rounded" />}
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-primaria text-black px-4 py-2 rounded-lg hover:bg-primaria-hover font-bold">Salvar</button>
              <button type="button" onClick={() => setModo("lista")} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}