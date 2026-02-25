// app/produtos/actions.ts
"use server";

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

  const fotoFile = formData.get("foto") as File;
  let fotoUrl = "";

  if (fotoFile && fotoFile.size > 0) {
    const fileExt = fotoFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("fotos-produtos")
      .upload(fileName, fotoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro no Upload:", uploadError.message);
      throw new Error(`Erro no upload da imagem: ${uploadError.message}`);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from("fotos-produtos")
        .getPublicUrl(fileName);

      fotoUrl = publicUrlData.publicUrl;
    }
  }

  const { error } = await supabase.from("produtos").insert([
    {
      nome,
      categoria,
      preco,
      estoque,
      descricao,
      ativado,
      imagem: fotoUrl ? [fotoUrl] : [], //
    },
  ]);

  if (error) {
    console.error("Erro ao salvar no banco:", error.message);
    throw new Error(`Falha ao cadastrar produto: ${error.message}`);
  }

  // ADICIONADO: Atualiza a lista após cadastrar
  revalidatePath("/produtos");
}

export async function excluirProduto(id: string, imagemUrl?: string) {
  if (imagemUrl) {
    const fileName = imagemUrl.split("/").pop();
    if (fileName) {
      await supabase.storage.from("fotos-produtos").remove([fileName]);
    }
  }

  const { error } = await supabase.from("produtos").delete().eq("id", id);

  if (error) throw new Error(`Erro ao excluir: ${error.message}`);

  // Atualiza a lista após excluir
  revalidatePath("/produtos");
}

export async function atualizarProduto(id: string, formData: FormData) {
  const nome = formData.get("nome") as string;
  const categoria = formData.get("categoria") as string;
  const preco = parseFloat(formData.get("preco") as string) || 0;
  const estoque = parseInt(formData.get("estoque") as string) || 0;
  const descricao = formData.get("descricao") as string;
  const ativado = formData.get("ativado") === "on";

  const { error } = await supabase
    .from("produtos")
    .update({ nome, categoria, preco, estoque, descricao, ativado })
    .eq("id", id);

  if (error) throw new Error(`Erro ao atualizar: ${error.message}`);

  // Atualiza a lista após atualizar
  revalidatePath("/produtos");
}

// app/produtos/actions.ts

export async function alternarStatusProduto(id: string, statusAtual: boolean) {
  const { error } = await supabase
    .from("produtos")
    .update({ ativado: !statusAtual }) // Inverte o status (se é false vira true)
    .eq("id", id);

  if (error) {
    console.error("Erro ao alternar status:", error);
    return { success: false };
  }

  return { success: true };
}

export async function baixarEstoque(id: string, quantidade: number) {
  const { data: produto, error: fetchError } = await supabase
    .from("produtos")
    .select("estoque")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Erro ao buscar produto:", fetchError);
    return { success: false };
  }

  const novoEstoque = Math.max((produto?.estoque || 0) - quantidade, 0);

  const { error: updateError } = await supabase
    .from("produtos")
    .update({ estoque: novoEstoque })
    .eq("id", id);

  if (updateError) {
    console.error("Erro ao atualizar estoque:", updateError);
    return { success: false };
  }

  return { success: true };
}
