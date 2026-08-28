"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const { usuario, logout } = useAuth();
  const router = useRouter();

  if (!usuario) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-texto-cinza">Faça login para ver o seu perfil.</p>
        <Link href="/" className="text-primaria hover:underline mt-2 inline-block">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <nav className="text-sm text-texto-cinza mb-6">
        <Link href="/" className="hover:text-primaria">Início</Link>
        <span className="mx-2">»</span>
        <span className="text-primaria">Meu Perfil</span>
      </nav>

      <div className="bg-card border border-borda rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-card-escuro border border-borda rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h1 className="text-xl font-bold text-primaria">{usuario.nome}</h1>
            <p className="text-texto-cinza">{usuario.email}</p>
          </div>
        </div>

        <div className="space-y-3 text-texto">
          <div className="flex justify-between border-b border-borda py-2">
            <span className="text-texto-cinza">Email</span>
            <span>{usuario.email}</span>
          </div>
          <div className="flex justify-between border-b border-borda py-2">
            <span className="text-texto-cinza">Tipo de conta</span>
            <span className={usuario.admin ? "text-primaria font-bold" : ""}>{usuario.admin ? "Administrador" : "Cliente"}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => { logout(); router.push("/"); }}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        Sair da Conta
      </button>
    </div>
  );
}