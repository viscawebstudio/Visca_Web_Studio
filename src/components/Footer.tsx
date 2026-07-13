import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import footerLogo from "../assets/images/regenerated_image_1783781365216.jpg";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  };

  return (
    <footer className="bg-[#011440] text-white pt-20 pb-8 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-24">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <BrandLogo className="mb-6" alignItems="items-start" src={footerLogo} />
            <p className="text-blue-200/60 text-sm leading-relaxed max-w-sm">
              A design and engineering studio building digital products — and beyond.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-[11px] font-bold tracking-widest text-blue-400 uppercase mb-6">COMPANY</div>
            <ul className="space-y-4">
              <li><a href="#why-visca" onClick={(e) => scrollToSection(e, 'why-visca')} className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">About</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">Services</a></li>
              <li><a href="#portfolio" onClick={(e) => scrollToSection(e, 'portfolio')} className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">Portfolio</a></li>
              <li><a href="#process" onClick={(e) => scrollToSection(e, 'process')} className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">Process</a></li>
              <li><a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">Testimonials</a></li>
            </ul>
          </div>
          
          <div>
            <div className="text-[11px] font-bold tracking-widest text-blue-400 uppercase mb-6">SERVICES</div>
            <ul className="space-y-4">
              <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">UI/UX</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">Web Design</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">Development</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">Branding</a></li>
            </ul>
          </div>
          
          <div>
            <div className="text-[11px] font-bold tracking-widest text-blue-400 uppercase mb-6">CONNECT</div>
            <ul className="space-y-4">
              <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">Contact</a></li>
              <li><a href="https://instagram.com/viscawebstudio" target="_blank" rel="noopener noreferrer" className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">@viscawebstudio</a></li>
              <li><a href="https://wa.me/919446054420" target="_blank" rel="noopener noreferrer" className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">+91 9446054420</a></li>
              <li><a href="mailto:viscawebstudio@gmail.com" className="text-blue-200/80 hover:text-white text-sm transition-colors cursor-pointer">viscawebstudio@gmail.com</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs text-blue-200/50">
          <div>© Visca Web Studio. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors cursor-pointer">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors cursor-pointer">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
