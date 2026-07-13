import React from 'react';

interface BrandLogoProps {
  className?: string;
  onClick?: () => void;
  alignItems?: "items-center" | "items-start" | "items-end";
  src?: string;
}

export default function BrandLogo({ 
  className = "", 
  onClick,
  alignItems = "items-center",
  src
}: BrandLogoProps) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-row items-center gap-3 cursor-pointer group ${className}`}
    >
      {src && (
        <img 
          src={src} 
          alt="Visca Web Studio" 
          className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
        />
      )}
      <div className="flex flex-col justify-center">
        <span className="text-[14px] font-bold tracking-[0.28em] text-white font-sans uppercase leading-none pl-[0.28em]">
          VISCA
        </span>
        <span className="text-[9px] font-medium tracking-[0.45em] text-white/90 font-sans uppercase leading-none mt-1 pl-[0.45em]">
          WEB STUDIO
        </span>
      </div>
    </div>
  );
}
