import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(".hero-title-line", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" });
      tl.fromTo(".hero-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.5");
      tl.fromTo(".hero-ctas", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.8");
      tl.fromTo(".hero-artwork", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=0.8");
      
      if (floatRef.current) {
        gsap.to(floatRef.current, {
          y: -6,
          duration: 3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: 1.2
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!artworkRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = artworkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top; 
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4; 
    const rotateY = ((x - centerX) / centerX) * 4; 
    gsap.to(artworkRef.current, {
      rotateX, rotateY, duration: 0.5, ease: "power2.out", transformPerspective: 1000, transformOrigin: "center center"
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, { x: x - 200, y: y - 200, opacity: 0.15, duration: 0.3, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (!artworkRef.current) return;
    gsap.to(artworkRef.current, { rotateX: 0, rotateY: 0, duration: 1, ease: "power3.out" });
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
    }
  };

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="hero" ref={containerRef} className="relative pt-40 pb-24 px-6 flex flex-col items-center overflow-visible bg-gradient-to-b from-[#020b24] via-[#011B55] to-[#012571]">
      {/* Background Dots/Stars */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none" />
      {/* Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl lg:text-[96px] font-bold leading-[1.05] tracking-tight mb-8 text-white font-sans">
          <div className="overflow-hidden pb-2"><div className="hero-title-line">Crafting digital</div></div>
          <div className="overflow-hidden pb-2"><div className="hero-title-line">experiences that</div></div>
          <div className="overflow-hidden pb-2"><div className="hero-title-line text-[#7BA4F5] font-light">drive growth.</div></div>
        </h1>
        
        <p className="hero-desc text-slate-300 text-base md:text-xl max-w-3xl mb-12 leading-relaxed">
          We help ambitious brands transform ideas into exceptional digital products through strategy, design, and engineering.
        </p>
        
        <div className="hero-ctas flex flex-col sm:flex-row gap-4 mb-24 w-full sm:w-auto">
          <button onClick={() => scrollToElement("contact")} className="px-8 py-4 bg-white text-[#0a1e50] text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5)] group">
            Start Your Project
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button onClick={() => scrollToElement("portfolio")} className="px-8 py-4 bg-[#0a1e50]/40 backdrop-blur-sm border border-white/20 text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.3)] hover:border-blue-400/50">
            View Our Work
          </button>
        </div>
        
        {/* Artwork */}
        <div className="hero-artwork relative w-full max-w-4xl" style={{ perspective: "1200px" }}>
          <div ref={floatRef} className="w-full h-full will-change-transform">
            {/* Main Showcase Image */}
            <div 
              ref={artworkRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full aspect-[1.5] bg-[#091022] rounded-[24px] border-[8px] border-[#020617] overflow-hidden flex items-center justify-center cursor-pointer group shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5),0_0_40px_rgba(59,130,246,0.15)] hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.6),0_0_60px_rgba(59,130,246,0.4)] transition-shadow duration-300 will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
               <div ref={glowRef} className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-400/80 rounded-full blur-[80px] opacity-0 pointer-events-none mix-blend-screen z-10 will-change-transform" />
               <img 
                 fetchPriority="high"
                 src="https://cdn.phototourl.com/free/2026-07-11-c1354655-df46-4159-8efe-28f1f56ede9a.png" 
                 alt="Visca Web Studio dashboard digital product showcase" 
                 className="w-full h-full object-cover object-center relative z-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]" 
                 style={{ imageRendering: "high-quality", WebkitFontSmoothing: "antialiased" }}
               />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
