// app/produtos/actions.ts
"use server";

// Apenas use em ambiente de desenvolvimento se houver erro de SSL local
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function cadastrarProduto(formData: FormData) {
  const nome = formData.get("nome") as string;
  const categoria = formData.get("categoria") as string;
  const preco = parseFloat(formData.get("preco") as string) || 0;
  const estoque = parseInt(formData.get("estoque") as string) || 0;
  const descricao = formData.get("descricao") as string;
  const ativado = formData.get("ativado") === "on";

  // Pega o arquivo do formulário
  const fotoFile = formData.get("foto") as File;
  let fotoUrl = "";

  if (fotoFile && fotoFile.size > 0) {
    // AJUSTE 1: Limpar o nome do arquivo (remove espaços e caracteres especiais)
    // Isso evita erros de URL quebrada no navegador
    const fileExt = fotoFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    // 1. Faz o upload para o Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("fotos-produtos")
      .upload(fileName, fotoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      // AJUSTE 2: Lançar erro para que o usuário saiba que a foto falhou
      console.error("Erro no Upload:", uploadError.message);
      throw new Error(`Erro no upload da imagem: ${uploadError.message}`);
    } else {
      // 2. Pega a URL pública da imagem
      const { data: publicUrlData } = supabase.storage
        .from("fotos-produtos")
        .getPublicUrl(fileName);

      fotoUrl = publicUrlData.publicUrl;
    }
  }

  // 3. Salva no banco de dados
  const { error } = await supabase.from("produtos").insert([
    {
      nome,
      categoria,
      preco,
      estoque,
      descricao,
      ativado,
      // Salva no formato array de texto compatível com o banco
      imagem: fotoUrl ? [fotoUrl] : [],
    },
  ]);

  if (error) {
    console.error("Erro ao salvar no banco:", error.message);
    throw new Error(`Falha ao cadastrar produto: ${error.message}`);
  }
}
export async function excluirProduto(id: string, imagemUrl?: string) {
  // 1. Se existir uma imagem, removemos do Storage para não ocupar espaço à toa
  if (imagemUrl) {
    const fileName = imagemUrl.split("/").pop(); // Pega o nome do arquivo da URL
    if (fileName) {
      await supabase.storage.from("fotos-produtos").remove([fileName]);
    }
  }

  // 2. Remove o registro do banco de dados
  const { error } = await supabase.from("produtos").delete().eq("id", id);

  if (error) throw new Error(`Erro ao excluir: ${error.message}`);

  revalidatePath("/produtos");
}
