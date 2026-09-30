"use client";

import { socials } from "@/data/socials";
import GlassCard from "@/components/ui/GlassCard";
import { Mail, MessageSquare, Send } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function ContactSection() {
  const getIcon = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'github': return <FaGithub className="w-5 h-5" />;
      case 'linkedin': return <FaLinkedin className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'whatsapp': return <MessageSquare className="w-5 h-5" />;
      default: return <Mail className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-24 relative z-10" id="contact">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="sec-heading text-4xl md:text-5xl font-bold mb-16 text-center text-white/90 tracking-wide">
          INITIATE <span className="text-cyan-400">CONTACT</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Socials & Info */}
          <div className="space-y-6">
            <p className="text-white/70 font-light text-lg mb-8">
              Currently open to new opportunities, collaborations, and discussions on full-stack development and AI integration.
            </p>
            
            <div className="flex flex-col gap-4">
              {socials.map((social) => (
                <a 
                  key={social.platform} 
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <GlassCard className="w-12 h-12 flex items-center justify-center text-white/50 group-hover:text-cyan-400 group-hover:border-cyan-400/30 transition-colors">
                    {getIcon(social.platform)}
                  </GlassCard>
                  <div>
                    <div className="text-sm font-mono tracking-widest text-white/40 uppercase">{social.platform}</div>
                    <div className="text-white/80 group-hover:text-white transition-colors">{social.username}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {/* Contact Form Placeholder */}
          <GlassCard className="p-8">
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-mono tracking-widest text-white/50 mb-2">IDENTIFIER / NAME</label>
                <input 
                  type="text" 
                  className="w-full bg-black/20 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-widest text-white/50 mb-2">TRANSMISSION LINK / EMAIL</label>
                <input 
                  type="email" 
                  className="w-full bg-black/20 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-widest text-white/50 mb-2">DATA PACKET / MESSAGE</label>
                <textarea 
                  rows={4}
                  className="w-full bg-black/20 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                  placeholder="Enter your message"
                />
              </div>
              <button 
                type="button" 
                className="magnetic-btn w-full py-4 bg-white/5 border border-white/10 hover:bg-cyan-400/10 hover:border-cyan-400/30 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 rounded-sm text-sm tracking-[0.2em]"
              >
                <Send className="w-4 h-4" /> TRANSMIT DATA
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
