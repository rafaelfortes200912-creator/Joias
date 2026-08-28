"use client";
import { useCarrinho } from "../contexts/CarrinhoContext";
import { useHistorico } from "../contexts/HistoricoContext";
import { useAuth } from "../contexts/AuthContext";

export default function ModalCarrinho({ onClose }: { onClose: () => void }) {
  const { itens, remover, total, limpar } = useCarrinho();
  const { adicionarCompra } = useHistorico();
  const { usuario } = useAuth();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-borda rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primaria">🛒 Carrinho</h2>
          <button onClick={onClose} className="text-texto-cinza hover:text-primaria text-xl">✕</button>
        </div>

        {itens.length === 0 ? (
          <p className="text-texto-cinza text-center py-8">Carrinho vazio</p>
        ) : (
          <>
            {itens.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b border-borda">
                <img src={item.imagem} alt={item.nome} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-primaria">{item.nome}</p>
                  <p className="text-xs text-texto-cinza">Kz {item.preco.toFixed(2)} x {item.quantidade}</p>
                </div>
                <button onClick={() => remover(item.id)} className="text-red-500 text-sm hover:underline">Remover</button>
              </div>
            ))}
            <div className="mt-4 text-right">
              <p className="text-lg font-bold text-primaria">Total: Kz {total.toFixed(2)}</p>
            </div>
            {usuario ? (
              <button
                onClick={() => {
                  adicionarCompra({
                    id: Date.now().toString(),
                    data: new Date().toLocaleDateString("pt-PT"),
                    itens: itens.map(i => ({ nome: i.nome, preco: i.preco, quantidade: i.quantidade })),
                    total,
                  });
                  limpar();
                  alert("✅ Compra finalizada com sucesso!");
                }}
                className="mt-4 w-full bg-primaria text-black py-3 rounded-lg font-bold hover:bg-primaria-hover transition-colors"
              >
                Finalizar Compra
              </button>
            ) : (
              <p className="mt-4 text-center text-texto-cinza text-sm">🔒 Faça login para finalizar a compra.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}