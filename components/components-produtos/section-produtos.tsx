"use client";
import { Plus, Ban } from "lucide-react"; // Importei o ícone Ban para o estado esgotado

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
        {produtos.map((produto) => {
          // 1. Verificamos se o produto está esgotado
          const isEsgotado = produto.estoque <= 0;

          return (
            <div
              key={produto.id}
              className={`group cursor-pointer ${isEsgotado ? "opacity-60" : ""}`}
            >
              <div className="relative aspect-3/4 overflow-hidden bg-slate-50 mb-4 rounded-sm">
                <img
                  src={produto.imagem?.[0]}
                  className={`w-full h-full object-cover transition-transform duration-700 ${!isEsgotado && "group-hover:scale-105"}`}
                  alt={produto.nome}
                />

                {/* Overlay de Esgotado */}
                {isEsgotado && (
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                    <span className="bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      Esgotado
                    </span>
                  </div>
                )}

                {/* Botão condicional */}
                <button
                  disabled={isEsgotado} // Impede o clique no HTML
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isEsgotado) {
                      adicionarAoCarrinho(produto);
                    }
                  }}
                  className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transform transition-all 
  ${
    isEsgotado
      ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-100"
      : "bg-blue-200 text-blue-800 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 hover:bg-blue-300"
  }`}
                >
                  {isEsgotado ? <Ban size={20} /> : <Plus size={20} />}
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

              {/* Texto de estoque com cor condicional */}
              <p
                className={`text-[12px] font-bold mt-1 ${isEsgotado ? "text-red-400" : "text-slate-400"}`}
              >
                {isEsgotado
                  ? "Sem unidades disponíveis"
                  : `${produto.estoque} em estoque`}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
