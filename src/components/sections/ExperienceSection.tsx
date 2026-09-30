"use client";

import { experiences } from "@/data/experience";
import GlassCard from "@/components/ui/GlassCard";
import { Trophy, GraduationCap, Code } from "lucide-react";

export default function ExperienceSection() {
  return (
    <section className="py-24 relative z-10" id="experience">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="sec-heading text-4xl md:text-5xl font-bold mb-16 text-center text-white/90 tracking-wide">
          MILESTONES & <span className="text-purple-400">ACHIEVEMENTS</span>
        </h2>
        
        <div className="relative border-l border-white/10 ml-4 md:ml-0 md:pl-0">
          {/* Vertical line for desktop centered */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
          
          <div className="flex flex-col gap-12">
            {experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;
              const Icon = exp.type === 'education' ? GraduationCap : exp.type === 'hackathon' ? Trophy : Code;
              const iconColor = exp.type === 'hackathon' ? 'text-yellow-400' : 'text-cyan-400';
              
              return (
                <div key={exp.id} className={`relative flex items-center md:justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline marker */}
                  <div className="absolute left-[-1.5rem] md:left-1/2 w-6 h-6 rounded-full bg-[#030407] border-2 border-white/30 md:-translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <div className={`w-2 h-2 rounded-full ${exp.type === 'hackathon' ? 'bg-yellow-400' : 'bg-cyan-400'}`} />
                  </div>
                  
                  {/* Empty space for the opposite side on desktop */}
                  <div className="hidden md:block w-[45%]" />
                  
                  {/* Content card */}
                  <div className="w-full md:w-[45%] pl-6 md:pl-0">
                    <GlassCard className="p-6 h-full border-t-2 border-t-white/10 hover:border-t-cyan-400/50 transition-colors duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                        <span className="text-xs font-mono tracking-widest text-white/50">{exp.date}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white tracking-wide mt-2">{exp.title}</h3>
                      <h4 className="text-sm tracking-widest text-cyan-400/80 uppercase mt-1 mb-4">{exp.organization}</h4>
                      
                      <ul className="space-y-2">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="text-white/70 text-sm font-light flex gap-2">
                            <span className="text-cyan-500 mt-1">▹</span> {desc}
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
