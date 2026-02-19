"use client";

import {
  PlusCircle,
  Search,
  Filter,
  Image as ImageIcon,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  LogOut,
  Bell,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { cadastrarProduto, excluirProduto } from "./actions";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    async function carregarProdutos() {
      const { data } = await supabase
        .from("produtos")
        .select("*")
        .order("criado_em", { ascending: false });
      if (data) setProdutos(data);
    }
    carregarProdutos();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR ESQUERDA */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white font-bold text-xl">
            N
          </div>
          <span className="text-blue-600 font-bold text-xl tracking-tight">
            Naga{" "}
            <span className="text-[10px] bg-blue-50 px-1 py-0.5 rounded text-blue-400 align-top ml-1">
              ADMIN
            </span>
          </span>
        </div>

        <nav className="space-y-1 flex-1">
          {[{ icon: ShoppingBag, label: "Products", active: true }].map(
            (item) => (
              <button
                key={item.label}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-colors ${item.active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ),
          )}
        </nav>

        <button className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:text-red-500 transition-colors mt-auto font-medium">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER COM AVATAR */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
            Inventory Management
          </h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell size={20} className="text-slate-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700 leading-tight">
                  Isabella V.
                </p>
                <p className="text-[11px] text-slate-400">Head of Operations</p>
              </div>
              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center font-bold text-amber-700">
                IV
              </div>
            </div>
          </div>
        </header>

        {/* FORMULÁRIO DE CADASTRO */}
        <Card className="border-none shadow-[0px_1px_3px_rgba(0,0,0,0.1)] mb-8">
          <CardHeader className="border-b border-slate-50 pb-4">
            <div className="flex items-center gap-2">
              <PlusCircle className="text-blue-600" size={18} />
              <CardTitle className="text-base font-semibold">
                Cadastrar Novo Produto
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form
              action={async (formData) => {
                await cadastrarProduto(formData);
                window.location.reload();
              }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8"
            >
              {/* ÁREA DE IMAGENS */}
              <div className="md:col-span-3 space-y-3">
                <Label className="text-slate-600 font-medium">
                  Product Images
                </Label>
                <label
                  htmlFor="foto"
                  className="cursor-pointer border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50 border-blue-200 hover:bg-blue-50 transition-all h-52 overflow-hidden relative"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center px-4">
                      <div className="bg-blue-500 text-white p-2 rounded-full inline-block mb-3 shadow-lg shadow-blue-200">
                        <PlusCircle size={20} />
                      </div>
                      <p className="text-sm font-semibold text-blue-600 mb-1">
                        Click to upload
                      </p>
                      <p className="text-[10px] text-slate-400">
                        or drag and drop images
                        <br />
                        SVG, PNG, JPG (max. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="foto"
                    name="foto"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* CAMPOS DE DADOS */}
              <div className="md:col-span-9 grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="nome"
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Product Name
                  </Label>
                  <Input
                    name="nome"
                    id="nome"
                    className="bg-white border-slate-200 h-11 rounded-lg"
                    placeholder="e.g. Sapphire Gold Ring"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="categoria"
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Category
                  </Label>
                  <Input
                    name="categoria"
                    id="categoria"
                    className="bg-white border-slate-200 h-11 rounded-lg"
                    placeholder="Select category"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="preco"
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Price (R$)
                  </Label>
                  <Input
                    name="preco"
                    id="preco"
                    type="number"
                    step="0.01"
                    className="bg-white border-slate-200 h-11 rounded-lg"
                    placeholder="R$ 0.00"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="estoque"
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Initial Stock
                  </Label>
                  <Input
                    name="estoque"
                    id="estoque"
                    type="number"
                    className="bg-white border-slate-200 h-11 rounded-lg"
                    placeholder="10"
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label
                    htmlFor="descricao"
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Description
                  </Label>
                  <textarea
                    name="descricao"
                    id="descricao"
                    className="w-full min-h-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Enter product description..."
                  />
                </div>
              </div>

              <div className="md:col-span-12 flex justify-end gap-3 border-t border-slate-100 pt-6 mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-slate-500 font-medium px-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 shadow-lg shadow-blue-100 h-11 rounded-lg"
                >
                  Salvar Produto
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* LISTA DE PRODUTOS */}
        <Card className="border-none shadow-[0px_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-2 font-semibold">
              <ClipboardList className="text-blue-600" size={18} /> Lista de
              Produtos
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  className="pl-9 w-64 h-10 border-slate-200 bg-slate-50 rounded-lg text-sm"
                  placeholder="Search products..."
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-200 h-10 w-10"
              >
                <Filter size={18} className="text-slate-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100">
                  <TableHead className="py-4 font-semibold text-slate-600 pl-6">
                    Product
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Price
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Stock
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow
                    key={produto.id}
                    className="border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Substitua o ícone cinza por este bloco dentro do map da tabela */}
                    <TableCell className="py-5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100">
                          {produto.imagem && produto.imagem[0] ? (
                            <img
                              src={produto.imagem[0]}
                              alt={produto.nome}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={18} className="text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 leading-tight">
                            {produto.nome}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none font-medium px-3"
                      >
                        {produto.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      R$ {produto.preco.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {produto.estoque}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={produto.ativado} />
                        <span
                          className={`text-[11px] font-bold ${produto.ativado ? "text-blue-600" : "text-slate-400"}`}
                        >
                          {produto.ativado ? "Ativo" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={async () => {
                          if (
                            confirm(
                              "Tem certeza que deseja excluir este produto?",
                            )
                          ) {
                            await excluirProduto(
                              produto.id,
                              produto.imagem?.[0],
                            );
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
