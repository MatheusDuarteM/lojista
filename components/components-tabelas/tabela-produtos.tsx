"use client";

import { useState, useMemo } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { excluirProduto, alternarStatusProduto } from "@/app/produtos/actions";

interface TabelaProdutosProps {
  produtos: any[];
  onRefresh: () => Promise<void>;
  onEdit: (produto: any) => void;
}

export function TabelaProdutos({
  produtos,
  onRefresh,
  onEdit,
}: TabelaProdutosProps) {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  // Lógica de Filtro e Busca
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const matchesBusca = produto.nome
        .toLowerCase()
        .includes(busca.toLowerCase());
      const matchesCategoria =
        categoriaFiltro === "Todas" || produto.categoria === categoriaFiltro;
      return matchesBusca && matchesCategoria;
    });
  }, [produtos, busca, categoriaFiltro]);

  // Extração de categorias únicas para o select
  const categoriasUnicas = useMemo(() => {
    return ["Todas", ...Array.from(new Set(produtos.map((p) => p.categoria)))];
  }, [produtos]);

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
        <div className="flex gap-3 items-center w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9 h-10 border-slate-200 bg-slate-50 rounded-lg text-sm"
              placeholder="Buscar pelo nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <select
            className="h-10 border border-slate-200 bg-slate-50 rounded-lg text-sm px-3"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="py-4 pl-6">Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right pr-6">Ações</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtosFiltrados.map((produto) => (
              <TableRow key={produto.id} className="hover:bg-slate-50/50">
                <TableCell className="py-4 pl-6 font-semibold text-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded border overflow-hidden">
                      <img
                        src={produto.imagem?.[0]}
                        className="h-full w-full object-cover"
                        alt={produto.nome}
                      />
                    </div>
                    {produto.nome}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-600 border-none"
                  >
                    {produto.categoria}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  R$ {Number(produto.preco).toFixed(2)}
                </TableCell>
                <TableCell>{produto.estoque}</TableCell>

                {/* Coluna de Ações */}
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-blue-600"
                      onClick={() => onEdit(produto)}
                    >
                      <Pencil size={18} />
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-48 p-3 shadow-xl"
                        side="top"
                        align="end"
                      >
                        <div className="space-y-3">
                          <p className="text-xs font-medium text-center">
                            Excluir item?
                          </p>
                          <div className="flex gap-2">
                            <PopoverClose asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-[11px]"
                              >
                                Voltar
                              </Button>
                            </PopoverClose>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex-1 text-[11px]"
                              onClick={async () => {
                                await excluirProduto(
                                  produto.id,
                                  produto.imagem?.[0],
                                );
                                await onRefresh();
                              }}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>

                {/* Coluna de Status */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={produto.ativado}
                      onCheckedChange={async () => {
                        await alternarStatusProduto(
                          produto.id,
                          produto.ativado,
                        );
                        await onRefresh();
                      }}
                    />
                    <span
                      className={`text-xs font-medium ${produto.ativado ? "text-green-600" : "text-slate-400"}`}
                    >
                      {produto.ativado ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
