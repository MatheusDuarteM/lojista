"use client";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AbordagemProps {
  ideiaPersonalizada: string;
  setIdeiaPersonalizada: (val: string) => void;
  solicitarJoiaPersonalizada: () => void;
  span1: string;
  h2: string;
  p: string;
  label: string;
  placeholder: string;
  p2: string;
  buttonText: string;
}

export function SectionAbordagem(props: AbordagemProps) {
  return (
    <section className="bg-blue-50/30 rounded-3xl p-12 text-center mb-24">
      <span className="text-[10px] uppercase tracking-[4px] text-blue-400 font-bold">
        {props.span1}
      </span>
      <h2 className="text-3xl font-medium mt-4 mb-6 tracking-tight">
        {props.h2}
      </h2>
      <p className="text-slate-500 max-w-2xl mx-auto mb-10 font-light italic">
        {props.p}
      </p>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
        <div className="text-left space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {props.label}
            </label>
            <textarea
              value={props.ideiaPersonalizada}
              onChange={(e) => props.setIdeiaPersonalizada(e.target.value)}
              placeholder={props.placeholder}
              className="w-full min-h-30 bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-1 focus:ring-blue-100 outline-none"
            />
          </div>
          <div className="border-2 border-dashed border-slate-100 rounded-xl p-8 text-center hover:border-blue-200 transition-colors cursor-pointer group">
            <UploadCloud
              className="mx-auto text-slate-300 group-hover:text-blue-300 mb-2"
              size={32}
            />
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              {props.p2}
            </p>
          </div>
          <Button
            onClick={props.solicitarJoiaPersonalizada}
            className="w-full bg-[#A8DADC] hover:bg-[#96cacc] text-slate-800 h-14 rounded-xl font-bold tracking-wider"
          >
            {props.buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default SectionAbordagem;
