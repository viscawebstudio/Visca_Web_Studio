import React from "react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "₹9,999",
      features: [
        "Responsive Website",
        "Up to 5 Sections",
        "Mobile Optimized",
        "Contact Form",
        "Fast Performance",
        "WhatsApp Integration",
        "Basic SEO",
        "Social Integration",
        "2 Revisions",
        "5–7 Day Delivery",
      ],
      buttonText: "Sign Up",
      highlight: false,
      type: "starter",
    },
    {
      name: "Elite",
      price: "₹19,999",
      features: [
        "Everything in Starter",
        "Up to 8 Pages",
        "Premium Custom Design",
        "Advanced Animations",
        "Google Maps Integration",
        "Lead Capture Forms",
        "Portfolio / Gallery",
        "SEO Optimization",
        "Priority Support",
        "3 Revisions",
      ],
      buttonText: "Sign Up",
      highlight: true,
      type: "elite",
    },
    {
      name: "Premium",
      price: "₹39,999",
      features: [
        "Custom Website Build",
        "Premium UI/UX Design",
        "CMS Integration",
        "Booking & Inquiry System",
        "Fast Performance",
        "Fully Responsive Layout",
        "Brand-Focused Design",
        "Custom Features",
        "Priority Support",
        "Scalable Structure",
      ],
      buttonText: "Sign Up",
      highlight: false,
      type: "premium",
    },
  ];

  const handleSignUpClick = (price: string) => {
    const event = new CustomEvent("setBudget", { detail: price });
    window.dispatchEvent(event);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="pricing"
      className="pb-32 px-6 md:px-12 bg-gradient-to-b from-transparent via-[#D8E6F5] to-[#CDE1F4]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 tracking-tight leading-[1.2] max-w-2xl mx-auto">
            Discover Tailored Pricing To Fit Your Needs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-end">
          {plans.map((plan, i) => {
            const isPremium = plan.type === "premium";
            const isElite = plan.type === "elite";
            const isStarter = plan.type === "starter";

            return (
              <div
                key={i}
                className={`rounded-[32px] p-8 md:p-10 flex flex-col transition-all duration-300 ease-in-out ${
                  isElite
                    ? "bg-gradient-to-b from-[#8ab4f8] via-[#8ab4f8] to-[#020b24] shadow-2xl hover:shadow-[0_20px_50px_rgba(80,120,180,0.18)] relative z-10 md:-translate-y-4 hover:-translate-y-2 md:hover:-translate-y-6"
                    : isPremium
                      ? "bg-gradient-to-b from-[#1B1B1B] via-[#101010] to-[#050505] border border-[rgba(212,175,55,0.35)] shadow-2xl hover:shadow-[0_20px_50px_rgba(80,120,180,0.18)] relative z-10 md:-translate-y-4 hover:-translate-y-2 md:hover:-translate-y-6"
                      : "bg-gradient-to-b from-[#D4EBFF] via-[#BDDEFF] to-[#A3CFFF] shadow-[inset_0_-30px_80px_rgba(37,99,235,0.15),inset_0_0_0_1px_rgba(255,255,255,0.5),0_18px_45px_rgba(80,120,180,0.12)] hover:shadow-[inset_0_-30px_80px_rgba(37,99,235,0.15),inset_0_0_0_1px_rgba(255,255,255,0.5),0_25px_50px_rgba(80,120,180,0.22)] relative z-0 md:mb-4 hover:-translate-y-2 md:hover:-translate-y-2"
                }`}
              >
                <div className="mb-8">
                  <div
                    className={`text-sm font-bold mb-4 ${
                      isElite
                        ? "text-[#020b24]"
                        : isPremium
                          ? "text-[#FFFFFF]"
                          : "text-black"
                    }`}
                  >
                    {plan.name}
                  </div>
                  <div
                    className={`text-4xl md:text-5xl font-bold ${
                      isElite
                        ? "text-[#020b24]"
                        : isPremium
                          ? "text-[#D4AF37]"
                          : "text-black"
                    }`}
                  >
                    {plan.price}
                  </div>
                </div>

                <ul
                  className={`space-y-4 flex-grow ${isStarter ? "mb-10 md:mb-6" : "mb-10"}`}
                >
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <svg
                        className={`w-5 h-5 mt-0.5 shrink-0 ${
                          isElite
                            ? "text-[#020b24]"
                            : isPremium
                              ? "text-[#D4AF37]"
                              : "text-blue-600"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span
                        className={`text-sm md:text-base font-medium ${
                          isElite
                            ? "text-[#020b24]"
                            : isPremium
                              ? "text-[rgba(255,255,255,0.9)]"
                              : "text-black"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSignUpClick(plan.price)}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-colors ${
                    isElite
                      ? "bg-[#020617] text-white hover:bg-[#0f172a]"
                      : isPremium
                        ? "bg-gradient-to-b from-[#F8E28A] to-[#D4AF37] text-[#111111] hover:brightness-110"
                        : "bg-[#8ab4f8] text-[#020617] hover:bg-[#7ba4f5]"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
