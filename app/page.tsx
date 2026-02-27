"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Toaster, toast } from "sonner"; // 1. Importar a Sonner

// Importando os componentes refatorados
import { SectionHeader } from "@/components/components-header/section-header";
import { SectionHero } from "@/components/components-hero/section-hero";
import { SectionProdutos } from "@/components/components-produtos/section-produtos";
import { SectionAbordagem } from "@/components/components-abordagem/section-abordagem";
import { SectionFooter } from "@/components/components-footer/section-footer";
import { abordagem, footer } from "@/lib/valuePage";

export default function StorefrontPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [ideiaPersonalizada, setIdeiaPersonalizada] = useState("");
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [isSacolaAberta, setIsSacolaAberta] = useState(false);

  const NUMERO_WHATSAPP = "5527992812662";

  async function carregarProdutos() {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .eq("ativado", true)
      .order("criado_em", { ascending: false });
    if (data) setProdutos(data);
  }

  useEffect(() => {
    carregarProdutos();
    const salvo = localStorage.getItem("naga-cart");
    if (salvo) setCarrinho(JSON.parse(salvo));
  }, []);

  useEffect(() => {
    localStorage.setItem("naga-cart", JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho((prev) => {
      const itemExiste = prev.find((item) => item.id === produto.id);
      const quantidadeNoCarrinho = itemExiste ? itemExiste.quantidade : 0;

      // --- SINALIZAÇÃO SUAVE DE ESTOQUE ---
      if (quantidadeNoCarrinho >= produto.estoque) {
        toast.error("Limite de estoque atingido", {
          description: `Temos apenas ${produto.estoque} unidades de "${produto.nome}" disponíveis.`,
          style: {
            background: "#f8fafc",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
          },
        });
        return prev;
      }

      if (itemExiste) {
        toast.success(`Mais um "${produto.nome}" adicionado!`);
        return prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        );
      }

      toast.success("Adicionado à sacola!");
      return [...prev, { ...produto, quantidade: 1 }];
    });
    setIsSacolaAberta(true);
  };

  const removerOuDiminuir = (id: string) => {
    setCarrinho((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item,
        )
        .filter((item) => item.quantidade > 0),
    );
  };

  const excluirDoCarrinho = (id: string) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removido da sacola");
  };

  const valorTotal = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );

  const atualizarEstoqueNoBanco = async () => {
    try {
      const promises = carrinho.map(async (item) => {
        const novoEstoque = item.estoque - item.quantidade;
        const { error } = await supabase
          .from("produtos")
          .update({ estoque: novoEstoque })
          .eq("id", item.id);
        if (error) throw error;
      });

      await Promise.all(promises);
      await carregarProdutos();
      return true;
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      toast.error("Erro no processamento", {
        description: "Não conseguimos atualizar o estoque. Tente novamente.",
      });
      return false;
    }
  };

  const confirmarCompraWhatsApp = async () => {
    if (carrinho.length === 0) return;

    // Feedback visual de carregamento
    const idAviso = toast.loading("Processando seu pedido...");

    const sucesso = await atualizarEstoqueNoBanco();

    if (sucesso) {
      toast.dismiss(idAviso);
      toast.success("Pedido pronto! Redirecionando...");

      const mensagemBase =
        "Olá! Gostaria de encomendar os seguintes itens da NAGA:\n\n";
      const itensTexto = carrinho
        .map(
          (item) =>
            `• ${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}`,
        )
        .join("\n");

      const textoFinal = `${mensagemBase}${itensTexto}\n\n*Total: R$ ${valorTotal.toFixed(2)}*`;

      setCarrinho([]);
      localStorage.removeItem("naga-cart");
      setIsSacolaAberta(false);

      window.open(
        `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(textoFinal)}`,
        "_blank",
      );
    }
  };

  const solicitarJoiaPersonalizada = () => {
    if (!ideiaPersonalizada.trim()) {
      return toast.warning("Campo vazio", {
        description: "Por favor, descreva sua ideia antes de enviar.",
      });
    }
    const mensagem = `Olá! Tenho uma ideia para uma joia personalizada que não vi no catálogo:\n\n"${ideiaPersonalizada}"`;
    window.open(
      `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`,
      "_blank",
    );
  };

  const categorias = useMemo(
    () => ["Todos", ...Array.from(new Set(produtos.map((p) => p.categoria)))],
    [produtos],
  );

  const produtosFiltrados = produtos.filter(
    (p) => categoriaAtiva === "Todos" || p.categoria === categoriaAtiva,
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* 2. Adicionar o Toaster aqui para renderizar as mensagens */}
      <Toaster position="bottom-right" richColors closeButton />

      <SectionHeader
        carrinho={carrinho}
        isSacolaAberta={isSacolaAberta}
        setIsSacolaAberta={setIsSacolaAberta}
        adicionarAoCarrinho={adicionarAoCarrinho}
        removerOuDiminuir={removerOuDiminuir}
        excluirDoCarrinho={excluirDoCarrinho}
        valorTotal={valorTotal}
        confirmarCompraWhatsApp={confirmarCompraWhatsApp}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <SectionHero
          categorias={categorias}
          categoriaAtiva={categoriaAtiva}
          setCategoriaAtiva={setCategoriaAtiva}
        />

        <SectionProdutos
          produtos={produtosFiltrados}
          adicionarAoCarrinho={adicionarAoCarrinho}
        />

        <SectionAbordagem
          ideiaPersonalizada={ideiaPersonalizada}
          setIdeiaPersonalizada={setIdeiaPersonalizada}
          solicitarJoiaPersonalizada={solicitarJoiaPersonalizada}
          {...abordagem}
        />
      </main>

      <SectionFooter p={footer.p} span={footer.span} span2={footer.span2} />
    </div>
  );
}
