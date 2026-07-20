import React from "react";
import { ArrowRight } from "lucide-react";

export default function Portfolio() {
  const projects = [
    {
      id: "maison",
      title: "Maison Atelier",
      category: "E-COMMERCE",
      description:
        "Luxury homeware storefront concept designed with editorial precision.",
      align: "left",
      image:
        "https://cdn.phototourl.com/free/2026-07-11-7cd3f379-d774-404f-a2ce-0d3150835eaa.png",
      imgBg: "bg-[#f4f4f4]",
    },
    {
      id: "orbital",
      title: "Orbital Cloud",
      category: "SAAS",
      description: "Developer platform brand & product surface concept.",
      align: "right",
      image:
        "https://cdn.phototourl.com/free/2026-07-11-3a090b11-4f96-46ef-9251-9254cfc88540.png",
      imgBg: "bg-[#050B14]",
    },
    {
      id: "northbank",
      title: "Northbank",
      category: "FINTECH",
      description:
        "Mobile banking app concept that turns complexity into a daily ritual.",
      align: "left",
      image:
        "https://cdn.phototourl.com/free/2026-07-11-f6005ac5-a17c-4b83-b24d-ddd9de53c468.png",
      imgBg: "bg-[#0a1e50]",
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="portfolio" className="py-32 px-6 md:px-12 bg-[#fafcff]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-[#2563eb] uppercase mb-6 flex items-center gap-4">
              <span className="w-6 h-[1px] bg-[#2563eb]"></span> SELECTED WORK
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-sans tracking-tight text-[#020b24] mb-8">
              Work that <span className="text-blue-600">moves the</span>
              <br />
              needle.
            </h2>
            <p className="text-slate-700 text-lg max-w-xl leading-relaxed">
              Explore a selection of concept websites created to demonstrate our
              design thinking, development quality, and attention to detail.
              These showcase the standard of work clients can expect from Visca
              Web Studio.
            </p>
          </div>

          <div className="pb-4">
            <button
              onClick={() => scrollToSection("contact")}
              className="group inline-flex items-center gap-2 text-xs font-bold tracking-widest text-slate-700 hover:text-[#020b24] transition-colors uppercase"
            >
              START A PROJECT
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="space-y-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col lg:flex-row bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 border border-slate-100"
            >
              {/* Image Column */}
              <div
                className={`w-full lg:w-1/2 min-h-[350px] lg:min-h-[500px] relative flex items-center justify-center overflow-hidden ${project.imgBg} ${project.align === "right" ? "lg:order-2" : "lg:order-1"}`}
              >
                <img
                  loading="lazy"
                  src={project.image}
                  alt={`${project.title} - ${project.category} website design concept by Visca Web Studio`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Column */}
              <div
                className={`w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center ${project.align === "right" ? "lg:order-1" : "lg:order-2"}`}
              >
                <div className="mb-16">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[12px] font-bold tracking-widest text-[#2563eb] uppercase">
                      {project.category}
                    </span>
                    <span className="px-2.5 py-1 bg-[#2563eb]/10 text-[#2563eb] text-[10px] font-bold tracking-widest uppercase rounded-full">
                      Concept Project
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-[#020b24] mb-6">
                    {project.title}
                  </h3>
                  <p className="text-slate-700 text-lg leading-relaxed max-w-sm">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
