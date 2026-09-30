"use client";

import GlassCard from "@/components/ui/GlassCard";

export default function AboutSection() {
  return (
    <section className="py-24 relative z-10" id="about">
      <div className="max-w-4xl mx-auto px-6">
        <GlassCard className="p-8 md:p-12 relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            <div className="w-48 h-48 shrink-0 rounded-full overflow-hidden border-2 border-white/10 relative">
              {/* Fallback avatar if mypic.jpeg isn't perfectly square */}
              <img 
                src="/assets/images/mypic.jpeg" 
                alt="Jayavardhan Kurasala" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <h2 className="sec-heading text-3xl font-bold text-white tracking-wider">
                  JAYAVARDHAN KURASALA
                </h2>
                <p className="text-cyan-400 font-mono text-sm tracking-widest mt-2 uppercase">
                  B.Tech CSE Student • Full Stack Developer
                </p>
              </div>
              
              <div className="text-white/70 space-y-4 leading-relaxed font-light">
                <p>
                  I am a passionate Computer Science student focusing on core computer science fundamentals, data structures, and algorithms. I specialize in building full-stack web applications and edge-computing architectures that solve real-world problems.
                </p>
                <p>
                  My journey involves competing in national hackathons (like Hack Overflow and Smart India Hackathon) and constantly exploring the intersection of AI, robust backends, and cinematic frontend experiences.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
