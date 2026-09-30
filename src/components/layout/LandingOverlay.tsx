"use client";

import { useEffect, useState } from 'react';

interface LandingOverlayProps {
  onEnter: () => void;
  isLoading: boolean;
  loadPercent: number;
}

export default function LandingOverlay({ onEnter, isLoading, loadPercent }: LandingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 transition-opacity duration-1000">
      {/* Navigation (simplified for landing) */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold tracking-[0.2em] text-white/90 cursor-default">
          JAYAVARDHAN KURASALA
        </h1>
      </nav>

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-sm tracking-[0.3em] text-white/50">INITIALIZING SYSTEMS</div>
            <div className="text-4xl font-light text-white/80">{loadPercent}%</div>
            <div className="w-64 h-px bg-white/10 mt-4 overflow-hidden">
              <div 
                className="h-full bg-white/50 transition-all duration-300 ease-out" 
                style={{ width: `${loadPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <button 
            onClick={onEnter}
            className="magnetic-btn group relative px-12 py-4 border border-white/20 bg-black/20 backdrop-blur-md rounded-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 text-sm tracking-[0.4em] font-light text-white group-hover:text-cyan-400 transition-colors duration-300">
              ENTER PORTFOLIO
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
