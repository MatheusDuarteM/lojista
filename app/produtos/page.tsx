"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FormProduto } from "@/components/components-formulario/form-produto";
import { TabelaProdutos } from "@/components/components-tabelas/tabela-produtos";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [editando, setEditando] = useState<any | null>(null);

  async function carregarProdutos() {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .order("criado_em", { ascending: false });
    if (data) setProdutos(data);
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  const prepararEdicao = (produto: any) => {
    setEditando(produto);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicao = () => {
    setEditando(null);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Poderia ser um componente global depois */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <span className="text-blue-600 font-bold text-xl tracking-tight">
            Naga
          </span>
        </div>
        <nav className="space-y-1 flex-1">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium bg-blue-50 text-blue-600">
            <ShoppingBag size={20} />
            Produtos
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-slate-800">
            Inventário de Produtos
          </h1>
        </header>

        {/* Componente de Formulário */}
        <FormProduto
          editando={editando}
          onSuccess={carregarProdutos}
          onCancel={cancelarEdicao}
        />

        {/* Componente de Tabela */}
        <TabelaProdutos
          produtos={produtos}
          onRefresh={carregarProdutos}
          onEdit={prepararEdicao}
        />
      </main>
    </div>
  );
}
