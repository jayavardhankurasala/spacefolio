"use client";

import { projects } from "@/data/projects";
import GlassCard from "@/components/ui/GlassCard";
import { ExternalLink, Trophy } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function ProjectsSection() {
  return (
    <section className="py-24 relative z-10" id="projects">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="sec-heading text-4xl md:text-5xl font-bold mb-16 text-center text-white/90 tracking-wide">
          FEATURED <span className="text-cyan-400">PROJECTS</span>
        </h2>
        
        <div className="flex flex-col gap-16">
          {projects.map((project, idx) => (
            <GlassCard key={project.id} className="overflow-hidden group">
              <div className="flex flex-col md:flex-row">
                {/* Project Image */}
                <div className="w-full md:w-5/12 aspect-video md:aspect-auto bg-black/40 relative overflow-hidden">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-white/20 tracking-[0.3em]">
                      NO_IMAGE_DATA
                    </div>
                  )}
                  {project.achievement && (
                    <div className="absolute top-4 left-4 bg-yellow-400/20 backdrop-blur-md border border-yellow-400/50 text-yellow-400 text-xs font-bold tracking-wider px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                      <Trophy className="w-3 h-3" /> {project.achievement}
                    </div>
                  )}
                </div>
                
                {/* Project Details */}
                <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-wide">{project.title}</h3>
                      <p className="text-sm font-mono tracking-widest text-cyan-400 mt-1">{project.shortDescription}</p>
                    </div>
                    <div className="flex gap-3">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors">
                          <FaGithub className="w-5 h-5" />
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8 text-white/70 font-light text-sm">
                    <p>{project.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs font-mono text-white/40 mb-1">PROBLEM</span>
                        <p>{project.problem}</p>
                      </div>
                      <div>
                        <span className="block text-xs font-mono text-white/40 mb-1">SOLUTION</span>
                        <p>{project.solution}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.technologies.map(tech => (
                      <span key={tech} className="text-xs font-mono tracking-wider text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
