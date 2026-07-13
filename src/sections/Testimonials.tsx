import React from "react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Visca didn't just redesign our product — they reframed the entire business case for it.",
      author: "Sarah Lin",
      title: "VP Product, Orbital Cloud",
      stars: 5
    },
    {
      quote: "The level of craft is genuinely rare. Every detail considered, every interaction intentional.",
      author: "Marco Reyes",
      title: "Founder, Maison Atelier",
      stars: 5
    },
    {
      quote: "They shipped in eight weeks what our internal team estimated at six months.",
      author: "Hannah Okafor",
      title: "CTO, Northbank",
      stars: 5
    },
    {
      quote: "Easily the most reliable partner we've worked with.",
      author: "James Lee",
      title: "CIO, Lumen",
      stars: 5
    }
  ];

  const brands = ["NORTHBANK", "ORBITAL", "MAISON", "LUMEN", "FELIX", "STRIDE", "VERTEX", "AURA"];

  return (
    <section id="testimonials" className="py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 flex flex-col items-center">
          <div className="text-[11px] font-bold tracking-widest text-[#7BA4F5] uppercase mb-6 flex items-center justify-center gap-4">
            <span className="w-6 h-[1px] bg-[#7BA4F5]"></span> TESTIMONIALS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#020b24] tracking-tight leading-[1.1] max-w-3xl">
            Words from people <span className="text-blue-600">we've<br/>shipped with.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {testimonials.map((test, i) => (
            <div key={i} className="bg-white rounded-[24px] border border-slate-100 p-8 flex flex-col hover:shadow-lg hover:border-blue-100 transition-all duration-300">
              <div className="flex gap-1 mb-6 text-blue-500">
                {[...Array(test.stars)].map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-[#020b24] font-medium text-[15px] leading-relaxed mb-10 flex-grow">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600"></div>
                <div>
                  <div className="text-sm font-bold text-[#020b24]">{test.author}</div>
                  <div className="text-xs text-slate-500">{test.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted By */}
        <div className="text-center">
          <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-12">
            TRUSTED BY TEAMS WORLDWIDE
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {brands.map((brand, i) => (
              <div key={i} className="text-sm md:text-base font-bold font-sans tracking-widest text-slate-600">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
