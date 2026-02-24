"use client";
import { Plus } from "lucide-react";

interface ProdutosProps {
  produtos: any[];
  adicionarAoCarrinho: (p: any) => void;
}

export function SectionProdutos({
  produtos,
  adicionarAoCarrinho,
}: ProdutosProps) {
  return (
    <section className="mb-24">
      <h2 className="text-xl font-light tracking-[2px] uppercase mb-10 text-slate-800">
        Coleção Destaque
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {produtos.map((produto) => (
          <div key={produto.id} className="group cursor-pointer">
            <div className="relative aspect-3/4 overflow-hidden bg-slate-50 mb-4 rounded-sm">
              <img
                src={produto.imagem?.[0]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={produto.nome}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  adicionarAoCarrinho(produto);
                }}
                className="absolute bottom-4 right-4 p-3 bg-blue-200 text-blue-800 rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all hover:bg-blue-300"
              >
                <Plus size={20} />
              </button>
            </div>
            <h3 className="text-sm font-medium text-slate-800 mb-1">
              {produto.nome}
            </h3>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-2">
              {produto.categoria}
            </p>
            <p className="text-sm font-bold text-slate-900">
              R${" "}
              {produto.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
