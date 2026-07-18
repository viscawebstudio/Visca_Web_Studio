import React, { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { handleEmailClick } from '../utils/emailHandler';

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleSetBudget = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setBudget(customEvent.detail);
      }
    };
    
    window.addEventListener("setBudget", handleSetBudget);
    return () => window.removeEventListener("setBudget", handleSetBudget);
  }, []);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setBudget("");
      return;
    }
    const formatted = new Intl.NumberFormat('en-IN').format(parseInt(rawValue, 10));
    setBudget(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setErrorMessage("");

    if (!name || !email || !phone) {
      setErrorMessage("Please fill out the required fields: Name, Email, and Phone Number.");
      return;
    }

    if (phone.length !== 10 || !/^[0-9]{10}$/.test(phone)) {
      setErrorMessage("Phone Number must be exactly 10 digits.");
      return;
    }

    setIsSubmitting(true);

    try {
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || import.meta.env.EMAILJS_SERVICE_ID || "";
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.EMAILJS_TEMPLATE_ID || "";
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.EMAILJS_PUBLIC_KEY || "";

      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        throw new Error("EmailJS credentials are not configured. Please add them to the environment variables.");
      }

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          business_type: projectType.trim(),
          budget: budget.trim(),
          message: message.trim(),
        },
        PUBLIC_KEY
      );

      setIsSubmitting(false);
      setShowModal(true);
    } catch (err: any) {
      console.error("API Error:", err);
      setIsSubmitting(false);
      setErrorMessage(err.message || "Failed to send your inquiry. Please try again or email us directly.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setProjectType("");
    setBudget("");
    setMessage("");
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-gradient-to-br from-[#020b24] to-[#011B55] text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
        
        {/* Left Side: Info */}
        <div className="w-full lg:w-5/12">
          <div className="text-[11px] font-bold tracking-widest text-[#7BA4F5] uppercase mb-6 flex items-center gap-4">
            <span className="w-6 h-[1px] bg-[#7BA4F5]"></span> GET IN TOUCH
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1] mb-6">
            Let's build<br />
            something<br />
            <span className="text-blue-400">unforgettable.</span>
          </h2>
          
          <p className="text-blue-200 text-base mb-12 max-w-sm">
            Tell us about your project. We typically respond within one business day.
          </p>

          <div className="space-y-4">
            {/* Contact Options */}
            <a href="https://wa.me/919446054420" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 rounded-2xl border border-blue-900/50 bg-[#05143a]/50 hover:bg-[#071a4a] transition-colors group">
              <div className="pointer-events-none">
                <div className="text-[10px] font-bold tracking-widest text-blue-300 uppercase mb-1">WHATSAPP</div>
                <div className="text-sm font-medium text-white">+91 9446054420</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors pointer-events-none" />
            </a>
            
            <a href="mailto:viscawebstudio@gmail.com" onClick={handleEmailClick} className="flex items-center justify-between p-5 rounded-2xl border border-blue-900/50 bg-[#05143a]/50 hover:bg-[#071a4a] transition-colors group">
              <div className="pointer-events-none">
                <div className="text-[10px] font-bold tracking-widest text-blue-300 uppercase mb-1">EMAIL</div>
                <div className="text-sm font-medium text-white">viscawebstudio@gmail.com</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors pointer-events-none" />
            </a>
            
            <a href="tel:+919446054420" className="flex items-center justify-between p-5 rounded-2xl border border-blue-900/50 bg-[#05143a]/50 hover:bg-[#071a4a] transition-colors group">
              <div className="pointer-events-none">
                <div className="text-[10px] font-bold tracking-widest text-blue-300 uppercase mb-1">BOOK A CALL</div>
                <div className="text-sm font-medium text-white">Schedule on Calendly</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors pointer-events-none" />
            </a>

            <Link to="/client-questionnaire" className="flex items-center justify-between p-5 rounded-2xl border border-blue-900/50 bg-[#05143a]/50 hover:bg-[#071a4a] transition-colors group">
              <div className="pointer-events-none">
                <div className="text-[10px] font-bold tracking-widest text-blue-300 uppercase mb-1">CLIENT QUESTIONNAIRE</div>
                <div className="text-sm font-medium text-white">Complete our detailed project questionnaire</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors pointer-events-none" />
            </Link>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-7/12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-blue-200 uppercase mb-2">NAME *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-colors" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-blue-200 uppercase mb-2">EMAIL *</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-blue-200 uppercase mb-2">PHONE NUMBER *</label>
                  <input 
                    type="tel" 
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Phone number must be exactly 10 digits"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-colors" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-blue-200 uppercase mb-2">COMPANY</label>
                  <input 
                    type="text" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-blue-200 uppercase mb-2">BUSINESS TYPE</label>
                  <input 
                    type="text" 
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-colors" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-blue-200 uppercase mb-2">BUDGET</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  autoComplete="off"
                  value={budget}
                  onChange={handleBudgetChange}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-blue-200 uppercase mb-2">MESSAGE</label>
                <textarea 
                  rows={4} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-colors resize-none"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-[#020b24] font-bold tracking-widest text-sm uppercase py-5 rounded-xl hover:bg-slate-200 transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "SENDING..." : "SEND INQUIRY"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-[#05143a] border border-blue-900/50 rounded-[32px] p-8 md:p-12 shadow-2xl max-w-lg w-full text-center z-10">
            <h3 className="text-3xl font-bold tracking-tight leading-[1.1] mb-6 text-white">Thank You!</h3>
            <p className="text-blue-200 text-base mb-10 leading-relaxed whitespace-pre-line">
              Thank you for sending your inquiry.{"\n"}
              Your information has been sent to the Visca Web Studio team.
            </p>
            <button 
              onClick={closeModal}
              className="w-full bg-blue-600 text-white font-bold tracking-widest text-sm uppercase py-4 rounded-xl hover:bg-blue-500 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
