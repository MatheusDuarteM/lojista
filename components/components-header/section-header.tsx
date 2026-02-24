"use client";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

interface HeaderProps {
  carrinho: any[];
  isSacolaAberta: boolean;
  setIsSacolaAberta: (open: boolean) => void;
  adicionarAoCarrinho: (p: any) => void;
  removerOuDiminuir: (id: string) => void;
  excluirDoCarrinho: (id: string) => void;
  valorTotal: number;
  confirmarCompraWhatsApp: () => void;
}

export function SectionHeader({
  carrinho,
  isSacolaAberta,
  setIsSacolaAberta,
  adicionarAoCarrinho,
  removerOuDiminuir,
  excluirDoCarrinho,
  valorTotal,
  confirmarCompraWhatsApp,
}: HeaderProps) {
  return (
    <nav className="border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <span className="text-2xl font-bold tracking-[4px] text-black">
          NAGA
        </span>
        <div className="flex items-center gap-6">
          <Sheet open={isSacolaAberta} onOpenChange={setIsSacolaAberta}>
            <SheetTrigger asChild>
              <div className="relative cursor-pointer group p-2">
                <ShoppingBag
                  size={22}
                  className="group-hover:text-black transition-colors text-slate-700"
                />
                {carrinho.length > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {carrinho.reduce((acc, item) => acc + item.quantidade, 0)}
                  </span>
                )}
              </div>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-xs uppercase tracking-[3px] font-bold">
                  Sua Sacola
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {carrinho.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag
                      size={40}
                      className="mx-auto text-slate-200 mb-4"
                    />
                    <p className="text-slate-400 text-sm italic font-light">
                      Sua sacola está vazia
                    </p>
                  </div>
                ) : (
                  carrinho.map((item) => (
                    <div key={item.id} className="flex gap-3 pl-2 pr-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-sm overflow-hidden shrink-0">
                        <img
                          src={item.imagem?.[0]}
                          className="w-full h-full object-cover"
                          alt={item.nome}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
                            {item.nome}
                          </h4>
                          <p className="text-[10px] text-slate-400 uppercase">
                            {item.categoria}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center border border-slate-100 rounded-full px-2 py-1 gap-3">
                            <button onClick={() => removerOuDiminuir(item.id)}>
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-medium">
                              {item.quantidade}
                            </span>
                            <button onClick={() => adicionarAoCarrinho(item)}>
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => excluirDoCarrinho(item.id)}
                            className="text-slate-300 hover:text-red-400"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-bold">
                        R$: {(item.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
              {carrinho.length > 0 && (
                <SheetFooter className="border-t pt-6 flex-col sm:flex-col space-y-4">
                  <div className="flex justify-between w-full items-end mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      Subtotal
                    </span>
                    <span className="text-lg font-bold tracking-tighter">
                      R$ {valorTotal.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    onClick={confirmarCompraWhatsApp}
                    className="w-full bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-xl h-14 font-bold tracking-wider"
                  >
                    Confirmar Compra no WhatsApp
                  </Button>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
