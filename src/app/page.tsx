"use client";

import { useState } from 'react';
import CinematicCanvas from '@/components/3d/CinematicCanvas';
import LandingOverlay from '@/components/layout/LandingOverlay';

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
        <div className="min-h-[300vh]">
          {/* Scrollable content will go here in Phase 5 */}
          <div className="h-screen flex items-center justify-center">
            <div className="glass-panel p-12 max-w-2xl text-center rounded-sm">
              <h2 className="sec-heading text-3xl mb-4 tracking-widest text-cyan-400">PORTFOLIO SHELL ACTIVE</h2>
              <p className="text-white/70">The cinematic engine has successfully transitioned. Scrolling content sections will be mounted here in Phase 5.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
