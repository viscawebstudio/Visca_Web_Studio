import React from "react";

export default function TechStack() {
  return (
    <section
      id="tech-stack"
      className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-b from-[#eef4ff] to-white overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="text-[11px] font-bold tracking-widest text-[#7BA4F5] uppercase flex items-center gap-4 mr-4">
            <span className="w-6 h-[1px] bg-[#7BA4F5]"></span> TECH STACK
          </div>

          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1.5 border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Figma
          </div>
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1.5 border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Framer
            Motion
          </div>
          <div className="flex items-center gap-1 bg-white rounded-full px-4 py-1.5 border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#020b24] tracking-tight leading-[1.1]">
          Tools chosen for <span className="text-blue-600">longevity.</span>
        </h2>
      </div>
    </section>
  );
}
