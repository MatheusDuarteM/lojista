"use client";
import { useState } from "react";
import { Plus, Ban, X, ShoppingBag } from "lucide-react";

interface ProdutosProps {
  produtos: any[];
  adicionarAoCarrinho: (p: any) => void;
}

export function SectionProdutos({
  produtos,
  adicionarAoCarrinho,
}: ProdutosProps) {
  // Estado para controlar qual produto está sendo visualizado em destaque
  const [produtoSelecionado, setProdutoSelecionado] = useState<any | null>(
    null,
  );

  const fecharModal = () => setProdutoSelecionado(null);

  return (
    <section className="mb-24">
      <h2 className="text-xl font-light tracking-[2px] uppercase mb-10 text-slate-800">
        Coleção Destaque
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {produtos.map((produto) => {
          const isEsgotado = produto.estoque <= 0;

          return (
            <div
              key={produto.id}
              className={`group cursor-pointer ${isEsgotado ? "opacity-60" : ""}`}
              onClick={() => setProdutoSelecionado(produto)} // Abre o destaque ao clicar no card
            >
              <div className="relative aspect-3/4 overflow-hidden bg-slate-50 mb-4 rounded-sm">
                <img
                  src={produto.imagem?.[0]}
                  className={`w-full h-full object-cover transition-transform duration-700 ${!isEsgotado && "group-hover:scale-105"}`}
                  alt={produto.nome}
                />

                {isEsgotado && (
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                    <span className="bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      Esgotado
                    </span>
                  </div>
                )}

                <button
                  disabled={isEsgotado}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita abrir o modal ao clicar no botão de adicionar direto
                    if (!isEsgotado) adicionarAoCarrinho(produto);
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

      {/* --- MODAL DE PRIMEIRO PLANO --- */}
      {produtoSelecionado && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={fecharModal}
        >
          <div
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar dentro do modal
          >
            {/* Botão de Fechar */}
            <button
              onClick={fecharModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-slate-500 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Lado Esquerdo: Imagem */}
            <div className="w-full md:w-1/2 bg-slate-50">
              <img
                src={produtoSelecionado.imagem?.[0]}
                alt={produtoSelecionado.nome}
                className="w-full h-full object-cover max-h-125 md:max-h-full"
              />
            </div>

            {/* Lado Direito: Informações */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[4px] text-blue-400 font-bold mb-2">
                {produtoSelecionado.categoria}
              </span>
              <h2 className="text-3xl font-medium text-slate-900 mb-4 tracking-tight">
                {produtoSelecionado.nome}
              </h2>
              <p className="text-2xl font-light text-slate-800 mb-8">
                R${" "}
                {produtoSelecionado.preco.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>

              <div className="space-y-4 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Descrição
                </h4>
                <p className="text-slate-500 leading-relaxed font-light">
                  {produtoSelecionado.descricao ||
                    "Esta peça exclusiva da NAGA reflete sofisticação e design atemporal. Perfeita para elevar qualquer ocasião com elegância."}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  disabled={produtoSelecionado.estoque <= 0}
                  onClick={() => {
                    adicionarAoCarrinho(produtoSelecionado);
                    fecharModal();
                  }}
                  className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-3 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {produtoSelecionado.estoque <= 0 ? (
                    "Produto Esgotado"
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Adicionar à Sacola
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest">
                  Disponibilidade: {produtoSelecionado.estoque} unidades
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
