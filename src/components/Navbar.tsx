import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import navLogo from "../assets/images/regenerated_image_1783781363157.jpg";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "process", label: "Process" },
    { id: "why-visca", label: "About" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id: string, path?: string) => {
    setIsMobileMenuOpen(false);
    if (path) {
      navigate(path);
      return;
    }
    
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isScrolled ? "py-4 bg-[#020b24]/90 backdrop-blur-md border-b border-white/5" : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6 min-[1360px]:px-12 flex justify-between items-center relative z-[10000]">
        {/* Logo */}
        <BrandLogo onClick={() => handleNavClick("hero")} src={navLogo} />

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center xl:gap-2 min-[1320px]:gap-3 min-[1400px]:gap-5 2xl:gap-8 text-[14px] 2xl:text-[15px] font-medium whitespace-nowrap">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="transition-colors cursor-pointer text-white hover:text-blue-300 whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("questionnaire", "/client-questionnaire")}
            className="transition-colors cursor-pointer text-white hover:text-blue-300 font-semibold whitespace-nowrap"
          >
            Client Questionnaire
          </button>
          
          <button
            onClick={() => handleNavClick("contact")}
            className="xl:ml-1.5 xl:px-3 xl:py-2 min-[1320px]:ml-2 min-[1320px]:px-4 min-[1320px]:py-2.5 2xl:ml-4 2xl:px-6 2xl:py-3 bg-[#030712] border border-[#1e293b] hover:border-blue-500/50 text-white rounded-full font-semibold text-sm flex items-center gap-2 transition-all hover:bg-slate-900 whitespace-nowrap"
          >
            Book a Discovery Call
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden text-white p-2"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#020b24] z-[9999] flex flex-col p-6 pt-[100px] xl:hidden overflow-y-auto">
          <div className="flex flex-col gap-6 mt-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left text-2xl font-bold text-white py-2 border-b border-white/5"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("questionnaire", "/client-questionnaire")}
              className="text-left text-2xl font-bold text-white py-2 border-b border-white/5"
            >
              Client Questionnaire
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className="mt-8 px-6 py-4 bg-[#030712] text-white rounded-full font-bold text-lg flex items-center justify-center gap-2"
            >
              Book a Discovery Call
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
