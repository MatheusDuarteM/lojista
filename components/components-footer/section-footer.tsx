"use client";

import { Instagram } from "lucide-react";

interface FooterProps {
  // Adicione quaisquer props necessárias para personalizar o footer
  p: string;
  span: string;
  span2: string;
}

export function SectionFooter(props: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        {/* Lado Esquerdo: Marca e Bio */}
        <div className="space-y-6">
          <span className="text-xl font-bold tracking-[3px]">NAGA</span>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Joias atemporais desenhadas para contar sua história com elegância e
            sofisticação.{props.p}
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 cursor-pointer text-slate-300 transition-colors"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Barra Inferior de Direitos */}
      <div className="max-w-7xl mx-auto border-t border-slate-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-300 tracking-widest uppercase font-medium">
        <p>© {currentYear} Naga Jewelry. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <span className="hover:text-slate-500 cursor-pointer transition-colors">
            Privacidade{props.span}
          </span>
          <span className="hover:text-slate-500 cursor-pointer transition-colors">
            Termos{props.span2}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default SectionFooter;
