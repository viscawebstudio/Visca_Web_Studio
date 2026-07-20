import React from "react";

export default function WhyVisca() {
  const reasons = [
    {
      id: "01",
      title: "Strategy First",
      description: "Every pixel anchored to a measurable outcome.",
    },
    {
      id: "02",
      title: "User-Centered",
      description: "Research and testing baked into every sprint.",
    },
    {
      id: "03",
      title: "Fast Delivery",
      description: "Tight feedback loops. Predictable milestones.",
    },
    {
      id: "04",
      title: "Scalable",
      description: "Architectures that grow with your ambition.",
    },
    {
      id: "05",
      title: "Future-Proof",
      description: "Modern stacks. Standards. Zero technical debt.",
    },
    {
      id: "06",
      title: "Dedicated Support",
      description: "A real team you can reach — long after launch.",
    },
  ];

  return (
    <section
      id="why-visca"
      className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#020b24] to-[#011B55] text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 flex flex-col items-center">
          <div className="text-[11px] font-bold tracking-widest text-[#7BA4F5] uppercase mb-6 flex items-center justify-center gap-4">
            <span className="w-6 h-[1px] bg-[#7BA4F5]"></span> WHY VISCA
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight max-w-3xl leading-[1.1]">
            Built to be the team <span className="text-blue-400">you</span>
            <br />
            call when it <span className="text-blue-400">matters.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.id}
              className="bg-[#05143a] border border-blue-900/50 rounded-[24px] p-8 flex flex-col hover:bg-[#071a4a] transition-colors"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">
                  {reason.id}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-blue-300/90 uppercase pt-2">
                  VISCA
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
