"use client";

import { useState, useEffect, useRef } from "react";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cadastrarProduto, atualizarProduto } from "@/app/produtos/actions";

interface FormProdutoProps {
  editando: any | null;
  onSuccess: () => Promise<void>;
  onCancel: () => void;
}

export function FormProduto({
  editando,
  onSuccess,
  onCancel,
}: FormProdutoProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Sincroniza o preview da imagem quando entra em modo de edição
  useEffect(() => {
    if (editando) {
      setPreview(editando.imagem?.[0] || null);
    } else {
      setPreview(null);
    }
  }, [editando]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (formData: FormData) => {
    if (editando) {
      await atualizarProduto(editando.id, formData);
    } else {
      await cadastrarProduto(formData);
    }

    // Limpa o formulário e avisa o componente pai para atualizar a lista
    setPreview(null);
    formRef.current?.reset();
    onCancel(); // Reseta o estado de edição no pai
    await onSuccess(); // Recarrega os produtos
  };

  return (
    <Card
      className={`border-none shadow-sm mb-8 transition-all ${editando ? "ring-2 ring-blue-500" : ""}`}
    >
      <CardHeader className="border-b border-slate-50 pb-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <PlusCircle
            className={editando ? "text-blue-500" : "text-blue-600"}
            size={18}
          />
          <CardTitle className="text-base font-semibold">
            {editando ? `Editando: ${editando.nome}` : "Cadastrar Novo Produto"}
          </CardTitle>
        </div>
        {editando && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-slate-400"
          >
            <X size={16} className="mr-1" /> Cancelar
          </Button>
        )}
      </CardHeader>

      <CardContent className="pt-6">
        <form
          ref={formRef}
          action={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          {/* Seção da Imagem */}
          <div className="md:col-span-3 space-y-3">
            <Label className="text-slate-600 font-medium">
              Imagem do Produto
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
                  <PlusCircle
                    size={24}
                    className="mx-auto mb-2 text-blue-500"
                  />
                  <p className="text-xs font-semibold text-blue-600">
                    Click to upload
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

          {/* Campos de Texto */}
          <div className="md:col-span-9 grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                name="nome"
                id="nome"
                className="h-11"
                defaultValue={editando?.nome || ""}
                key={editando?.id + "nome"}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                name="categoria"
                id="categoria"
                className="h-11"
                defaultValue={editando?.categoria || ""}
                key={editando?.id + "cat"}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                name="preco"
                id="preco"
                type="number"
                step="0.01"
                className="h-11"
                defaultValue={editando?.preco || ""}
                key={editando?.id + "preco"}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="estoque">Estoque</Label>
              <Input
                name="estoque"
                id="estoque"
                type="number"
                className="h-11"
                defaultValue={editando?.estoque || ""}
                key={editando?.id + "estoque"}
                required
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                name="descricao"
                id="descricao"
                className="w-full min-h-24 rounded-lg border border-slate-200 p-3 text-sm"
                defaultValue={editando?.descricao || ""}
                key={editando?.id + "desc"}
              />
            </div>
          </div>

          <div className="md:col-span-12 flex justify-end gap-3 border-t pt-6">
            <Button
              type="submit"
              className={`${editando ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"} text-white px-8 h-11`}
            >
              {editando ? "Salvar Alterações" : "Salvar Produto"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
