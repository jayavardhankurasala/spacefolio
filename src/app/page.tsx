"use client";

import { useState } from 'react';
import CinematicCanvas from '@/components/3d/CinematicCanvas';
import LandingOverlay from '@/components/layout/LandingOverlay';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [isBreaching, setIsBreaching] = useState(false);
  const [hasBreached, setHasBreached] = useState(false);

  // Simulated loader for now; in reality, we'd hook this into CinematicCanvas
  const handleLoadComplete = () => {
    setIsLoaded(true);
    setLoadPercent(100);
  };

  const handleEnter = () => {
    setIsBreaching(true);
    // The warp effect takes 1800ms
    setTimeout(() => {
      setHasBreached(true);
      setIsBreaching(false);
    }, 1800);
  };

  return (
    <main className="min-h-screen">
      <CinematicCanvas 
        onLoadComplete={handleLoadComplete}
        isBreaching={isBreaching}
        hasBreached={hasBreached}
      />
      
      {!hasBreached && (
        <div className={`transition-opacity duration-1000 ${isBreaching ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <LandingOverlay 
            onEnter={handleEnter}
            isLoading={!isLoaded}
            loadPercent={loadPercent}
          />
        </div>
      )}

      {/* Warp Flash Effect */}
      <div 
        className={`fixed inset-0 bg-white z-[60] pointer-events-none transition-opacity duration-100 ${
          isBreaching && !hasBreached ? 'opacity-0 animate-[flash_0.1s_ease-out_1.7s_forwards]' : 'opacity-0'
        }`}
      />

      {/* Portfolio Shell */}
      <div 
        className={`relative z-10 transition-opacity duration-1000 delay-500 ${
          hasBreached ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'
        }`}
      >
        <div className="pt-[100vh]">
          {/* We add top padding equivalent to 100vh so the first section starts after the user scrolls down, moving the landing image naturally up via parallax (CinematicCanvas handles the bg image transition). */}
          
          <ScrollReveal delay={0.2}><AboutSection /></ScrollReveal>
          <ScrollReveal delay={0.1}><SkillsSection /></ScrollReveal>
          <ScrollReveal delay={0.1}><ExperienceSection /></ScrollReveal>
          <ScrollReveal delay={0.1}><ProjectsSection /></ScrollReveal>
          <ScrollReveal delay={0.1}><ContactSection /></ScrollReveal>
          
          <footer className="py-8 text-center text-white/30 text-sm font-mono tracking-widest border-t border-white/5 mt-24">
            &copy; {new Date().getFullYear()} JAYAVARDHAN KURASALA. ALL SYSTEMS NOMINAL.
          </footer>
        </div>
      </div>
    </main>
  );
}
