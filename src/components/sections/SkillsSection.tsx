"use client";

import { skillCategories } from "@/data/skills";
import GlassCard from "@/components/ui/GlassCard";
import { 
  FaJava, FaPython, FaDatabase, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaFigma, FaServer
} from "react-icons/fa";
import { 
  SiJavascript, SiC, SiNextdotjs, SiStreamlit, SiVisualstudiocode, SiThreejs, SiWebgl, SiGreensock
} from "react-icons/si";
import { 
  Code2, Cpu, Network, Layers, Layout, Server, Boxes, ShieldAlert
} from "lucide-react";

const iconMap: Record<string, { icon: any, color: string }> = {
  // Languages
  "Java": { icon: FaJava, color: "#f89820" },
  "C": { icon: SiC, color: "#a8b9cc" },
  "Python": { icon: FaPython, color: "#3776ab" },
  "JavaScript": { icon: SiJavascript, color: "#f7df1e" },
  "SQL": { icon: FaDatabase, color: "#4479a1" },
  
  // Core CS
  "Data Structures": { icon: Boxes, color: "#38bdf8" },
  "Algorithms": { icon: Code2, color: "#38bdf8" },
  "OOP": { icon: Layers, color: "#38bdf8" },
  "DBMS": { icon: Server, color: "#38bdf8" },
  "Operating Systems": { icon: Cpu, color: "#38bdf8" },
  "Computer Networks": { icon: Network, color: "#38bdf8" },
  
  // Development
  "HTML": { icon: FaHtml5, color: "#e34f26" },
  "CSS": { icon: FaCss3Alt, color: "#1572b6" },
  "React": { icon: FaReact, color: "#61dafb" },
  "Next.js": { icon: SiNextdotjs, color: "#ffffff" },
  "Streamlit": { icon: SiStreamlit, color: "#ff4b4b" },
  
  // Tools
  "Git": { icon: FaGitAlt, color: "#f05032" },
  "GitHub": { icon: FaGithub, color: "#ffffff" },
  "VS Code": { icon: SiVisualstudiocode, color: "#007acc" },
  "Figma": { icon: FaFigma, color: "#f24e1e" },
  "APIs": { icon: Network, color: "#10b981" },
  
  // Exploring
  "Three.js": { icon: SiThreejs, color: "#ffffff" },
  "WebGL": { icon: SiWebgl, color: "#990000" },
  "GSAP": { icon: SiGreensock, color: "#88ce02" }
};

export default function SkillsSection() {
  return (
    <section className="py-24 relative z-10" id="skills">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="sec-heading text-4xl md:text-5xl font-bold mb-16 text-center text-white/90 tracking-wide">
          TECHNICAL <span className="text-cyan-400">ARSENAL</span>
        </h2>
        
        <div className="flex flex-col gap-16">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="flex flex-col gap-6">
              <h3 className="text-xl tracking-[0.2em] text-white/50 border-b border-white/10 pb-4">
                {category.title}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {category.skills.map((skill, sIdx) => {
                  const mapped = iconMap[skill] || { icon: ShieldAlert, color: "#fff" };
                  const Icon = mapped.icon;
                  
                  return (
                    <GlassCard key={sIdx} tilt className="p-6 flex flex-col items-center justify-center gap-4 cursor-pointer group">
                      <div 
                        className="text-4xl transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-2 drop-shadow-2xl"
                        style={{ color: mapped.color, filter: `drop-shadow(0 0 15px ${mapped.color}66)` }}
                      >
                        <Icon strokeWidth={1.5} />
                      </div>
                      <span className="text-sm font-medium tracking-wider text-white/70 group-hover:text-white transition-colors">
                        {skill}
                      </span>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
