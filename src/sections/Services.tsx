import React from "react";

export default function Services() {
  const services = [
    {
      id: "01",
      title: "UI/UX Design",
      description: "Human-first interfaces grounded in research and clarity.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "02",
      title: "Web Design",
      description: "Editorial layouts and motion that feel inevitable.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            transform="rotate(45 12 12)"
          />
        </svg>
      ),
    },
    {
      id: "03",
      title: "Web Development",
      description: "Performant, accessible builds on modern stacks.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "04",
      title: "Branding",
      description: "Identity systems that scale across every touchpoint.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <path d="M12 2v20M2 12h20" />
          <path d="M12 2l4 10-4 10-4-10z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "05",
      title: "Design Systems",
      description: "Tokens, components, and docs your team will love.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <path d="M12 5v14M5 12h14" strokeWidth="3" />
        </svg>
      ),
    },
    {
      id: "06",
      title: "Mobile App Design",
      description: "iOS & Android experiences crafted to feel native.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <path d="M12 18h.01" />
        </svg>
      ),
    },
    {
      id: "07",
      title: "E-Commerce",
      description: "Conversion-led storefronts with cinematic polish.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="services"
      className="pt-24 pb-24 px-6 md:px-12 bg-white relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="text-[11px] font-bold tracking-widest text-[#7BA4F5] uppercase mb-6 flex items-center gap-4">
              <span className="w-6 h-[1px] bg-[#7BA4F5]"></span> SERVICES
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#020b24] tracking-tight">
              A full studio, <span className="text-blue-600">end to end.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-slate-700 text-base leading-relaxed">
              Strategy, design, and engineering under one roof — composed into a
              single, calm process.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, _index) => (
            <div
              key={service.id}
              className="bg-white rounded-[24px] border border-slate-100 p-8 flex flex-col h-full hover:shadow-lg hover:border-blue-100 transition-all duration-300"
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-lg font-bold text-[#020b24] mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-12 flex-grow">
                {service.description}
              </p>
              <div className="text-xs font-medium text-slate-500 mt-auto">
                {service.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
