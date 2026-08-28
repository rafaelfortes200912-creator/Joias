"use client";
import { useHistorico } from "../contexts/HistoricoContext";

export default function ModalHistorico({ onClose }: { onClose: () => void }) {
  const { compras } = useHistorico();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-borda rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primaria">📄 Histórico de Compras</h2>
          <button onClick={onClose} className="text-texto-cinza hover:text-primaria text-xl">✕</button>
        </div>

        {compras.length === 0 ? (
          <p className="text-texto-cinza text-center py-8">Nenhuma compra realizada.</p>
        ) : (
          compras.map((compra) => (
            <div key={compra.id} className="mb-4 p-3 bg-card-escuro rounded-lg border border-borda">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-primaria">{compra.data}</span>
                <span className="text-xs text-texto-cinza">ID: {compra.id}</span>
              </div>
              {compra.itens.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-texto">
                  <span>{item.nome} x{item.quantidade}</span>
                  <span>Kz {(item.preco * item.quantidade).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-borda mt-2 pt-2 text-right font-bold text-primaria">
                Total: Kz {compra.total.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}