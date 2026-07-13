import React from "react";

export default function Process() {
  const steps = [
    {
      id: "01",
      title: "Discovery",
      description: "Listening sessions, audits, and goal alignment.",
      align: "left"
    },
    {
      id: "02",
      title: "Research",
      description: "Users, market, and competitive cartography.",
      align: "right"
    },
    {
      id: "03",
      title: "Design",
      description: "Concepts, systems, and high-fidelity interactions.",
      align: "left"
    },
    {
      id: "04",
      title: "Development",
      description: "Engineering with performance and a11y baked in.",
      align: "right"
    },
    {
      id: "05",
      title: "Launch",
      description: "QA, rollout, analytics, and a calm go-live.",
      align: "left"
    },
    {
      id: "06",
      title: "Growth",
      description: "Iteration loops that compound results over time.",
      align: "right"
    }
  ];

  return (
    <section id="process" className="py-32 px-6 md:px-12 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <div className="text-[11px] font-bold tracking-widest text-[#7BA4F5] uppercase mb-6 flex items-center justify-center gap-4">
            <span className="w-6 h-[1px] bg-[#7BA4F5]"></span> OUR PROCESS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#020b24] tracking-tight leading-[1.1]">
            A calm, deliberate <span className="text-blue-600">path</span><br />
            from idea to impact.
          </h2>
        </div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-blue-100 -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-16 md:space-y-0">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col md:flex-row items-center md:mb-12">
                {/* Mobile Line */}
                <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-blue-100 md:hidden"></div>

                {/* Left Side */}
                <div className={`w-full md:w-1/2 flex md:block pl-16 md:pl-0 ${step.align === 'left' ? 'md:text-right md:pr-24' : 'md:opacity-0 md:pointer-events-none'}`}>
                  {step.align === 'left' && (
                    <div className="relative md:static w-full">
                      <div className="text-[56px] leading-none font-bold text-[#020b24] mb-2">{step.id}</div>
                      <h3 className="text-xl font-bold text-[#020b24] mb-2">{step.title}</h3>
                      <p className="text-slate-500 text-sm">{step.description}</p>
                      
                      {/* Floating dots decoration */}
                      <div className="hidden md:block absolute -left-20 top-1/2 w-3 h-3 bg-blue-600 rounded-full blur-[1px]"></div>
                    </div>
                  )}
                </div>

                {/* Center Node (Desktop) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 z-10">
                   {/* Nothing in center per design, just the line */}
                </div>

                {/* Mobile Node */}
                <div className="md:hidden absolute left-6 top-6 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full z-10"></div>

                {/* Right Side */}
                <div className={`w-full md:w-1/2 flex md:block pl-16 md:pl-24 mt-8 md:mt-0 ${step.align === 'right' ? 'md:text-left' : 'md:opacity-0 md:pointer-events-none'}`}>
                  {step.align === 'right' && (
                    <div className="relative md:static w-full">
                      <div className="text-[56px] leading-none font-bold text-blue-600 mb-2">{step.id}</div>
                      <h3 className="text-xl font-bold text-[#020b24] mb-2">{step.title}</h3>
                      <p className="text-slate-500 text-sm">{step.description}</p>
                      
                      {/* Floating dots decoration */}
                      <div className="hidden md:block absolute -right-12 top-1/2 w-3 h-3 bg-blue-600 rounded-full blur-[1px]"></div>
                    </div>
                  )}
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
