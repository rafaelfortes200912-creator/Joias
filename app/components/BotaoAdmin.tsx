"use client";
import { useAuth } from "../contexts/AuthContext";

export default function BotaoAdmin({ onAbrir }: { onAbrir: () => void }) {
  const { usuario } = useAuth();

  if (!usuario?.admin) return null;

  return (
    <button
      onClick={onAbrir}
      className="fixed bottom-6 right-6 z-40 bg-card text-primaria p-3 rounded-full shadow-lg border border-borda hover:bg-card-escuro transition-colors text-2xl"
      title="Gerir Stock"
    >
      ⚙️
    </button>
  );
}