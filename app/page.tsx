import { PlusCircle, Search, Filter, Image as ImageIcon } from "lucide-react";
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

export default function ProdutosPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Inventory Management</h1>

      {/* BLOCO 1: FORMULÁRIO DE CADASTRO */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <PlusCircle className="text-blue-600" size={20} />
          <CardTitle className="text-lg">Cadastrar Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Área de Upload (Placeholder) */}
            <div className="md:col-span-1 space-y-4">
              <Label>Product Images</Label>
              <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50 border-blue-200">
                <ImageIcon size={40} className="mb-2 text-blue-400" />
                <p className="text-sm font-medium text-blue-600">
                  Click to upload
                </p>
                <p className="text-xs">SVG, PNG, JPG (max. 5MB)</p>
              </div>
            </div>

            {/* Campos de Texto */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Product Name</Label>
                <Input id="nome" placeholder="e.g. Sapphire Gold Ring" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Category</Label>
                <Input id="categoria" placeholder="Select category" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preco">Price (R$)</Label>
                <Input id="preco" type="number" placeholder="R$ 0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoque">Initial Stock</Label>
                <Input id="estoque" type="number" placeholder="10" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="descricao">Description</Label>
                <textarea
                  id="descricao"
                  className="w-full min-h-25 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter product description..."
                />
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 border-t pt-4">
              <Button variant="ghost">Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Salvar Produto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* BLOCO 2: LISTA DE PRODUTOS (TABELA) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Lista de Produtos</CardTitle>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input className="pl-8 w-62.5" placeholder="Search products..." />
            </div>
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Exemplo Estático (Mock) */}
              <TableRow>
                <TableCell className="font-medium">
                  Gold Serpent Necklace
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">Necklaces</Badge>
                </TableCell>
                <TableCell>R$ 1.250,00</TableCell>
                <TableCell>12</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked />
                    <span className="text-sm">Active</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
