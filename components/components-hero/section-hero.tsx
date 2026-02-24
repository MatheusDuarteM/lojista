"use client";

interface HeroProps {
  categorias: string[];
  categoriaAtiva: string;
  setCategoriaAtiva: (cat: string) => void;
}

export function SectionHero({
  categorias,
  categoriaAtiva,
  setCategoriaAtiva,
}: HeroProps) {
  return (
    <div className="flex justify-center gap-3 mb-16 overflow-x-auto pb-4">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategoriaAtiva(cat)}
          className={`px-6 py-2 rounded-full text-xs font-medium tracking-widest transition-all ${
            categoriaAtiva === cat
              ? "bg-blue-100 text-blue-600 shadow-sm"
              : "bg-white border border-slate-100 text-slate-500"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
