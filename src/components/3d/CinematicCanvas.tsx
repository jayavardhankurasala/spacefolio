"use client";

import { useEffect, useRef, useState } from 'react';

const ASSETS = {
  landing: '/assets/images/image-2.jpg',
  dive: '/assets/images/image-5.jpg',
  seq: [
    '/assets/images/image-7.jpg',
    '/assets/images/image-10.jpg',
    '/assets/images/image-11.jpg',
    '/assets/images/image-12.jpg'
  ]
};

export default function CinematicCanvas({ 
  onLoadComplete,
  isBreaching,
  hasBreached
}: { 
  onLoadComplete: () => void,
  isBreaching: boolean,
  hasBreached: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;
    
    // Engine State
    const loadedImages = new Map<string, HTMLImageElement>();
    let currentScroll = 0;
    let targetScroll = 0;
    let mouseX = w / 2;
    let mouseY = h / 2;
    let breachStartTime = 0;
    if (isBreaching && !hasBreached) {
      breachStartTime = performance.now();
    }

    // Particles
    const particles: any[] = [];
    const NUM_PARTICLES = window.innerWidth < 768 ? 200 : 500;
    const FOCAL_LENGTH = 300;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        baseSpeed: 0.5 + Math.random() * 1.5,
        color: Math.random() > 0.8 ? 'rgba(167, 139, 250, ' : 'rgba(255, 255, 255, ',
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const loadImg = (url: string) => {
      return new Promise<HTMLImageElement | null>((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    };

    const loadAssets = async () => {
      loadedImages.set('landing', await loadImg(ASSETS.landing) as HTMLImageElement);
      loadedImages.set('dive', await loadImg(ASSETS.dive) as HTMLImageElement);
      for (let i = 0; i < ASSETS.seq.length; i++) {
        const img = await loadImg(ASSETS.seq[i]);
        if (img) loadedImages.set(`seq_${i}`, img);
      }
      onLoadComplete();
      requestAnimationFrame(render);
    };

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    
    const handleScroll = () => {
      targetScroll = window.scrollY;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    loadAssets();

    function drawCover(img: HTMLImageElement, scale = 1.0, alpha = 1.0) {
      if (!img) return;
      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;
      let dw, dh, dx, dy;
      if (canvasRatio > imgRatio) {
        dw = w; dh = w / imgRatio;
      } else {
        dh = h; dw = h * imgRatio;
      }
      dw *= scale; dh *= scale;
      dx = (w - dw) / 2; dy = (h - dh) / 2;

      ctx!.globalAlpha = alpha;
      ctx!.drawImage(img, dx, dy, dw, dh);
      ctx!.globalAlpha = 1.0;
    }

    function updateAndDrawParticles(warp: boolean) {
      const cx = w / 2;
      const cy = h / 2;
      ctx!.save();
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = particles[i];
        
        let mX = (mouseX - cx) * (500 / FOCAL_LENGTH);
        let mY = (mouseY - cy) * (500 / FOCAL_LENGTH);
        const distSq = (p.x - mX) * (p.x - mX) + (p.y - mY) * (p.y - mY);
        if (distSq < 20000 && p.z < 800) {
          const force = (20000 - distSq) / 20000;
          p.x += (p.x - mX) * force * 0.05;
          p.y += (p.y - mY) * force * 0.05;
        }

        let speed = p.baseSpeed;
        if (warp) speed *= 15;
        p.z -= speed;

        if (p.z <= 0) {
          p.z = 2000;
          p.x = (Math.random() - 0.5) * 2000;
          p.y = (Math.random() - 0.5) * 2000;
        }

        const scale = FOCAL_LENGTH / p.z;
        const px = p.x * scale + cx;
        const py = p.y * scale + cy;

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          const r = scale * 1.5;
          ctx!.beginPath();
          if (warp) {
            const oldScale = FOCAL_LENGTH / (p.z + speed * 2);
            const oldPx = p.x * oldScale + cx;
            const oldPy = p.y * oldScale + cy;
            ctx!.moveTo(oldPx, oldPy);
            ctx!.lineTo(px, py);
            ctx!.strokeStyle = p.color + p.alpha + ')';
            ctx!.lineWidth = r;
            ctx!.stroke();
          } else {
            ctx!.arc(px, py, r, 0, Math.PI * 2);
            ctx!.fillStyle = p.color + (p.alpha * Math.min(1, scale)) + ')';
            ctx!.fill();
          }
        }
      }
      ctx!.restore();
    }

    function render(time: number) {
      ctx!.fillStyle = '#010103';
      ctx!.fillRect(0, 0, w, h);

      if (!hasBreached && !isBreaching) {
        const img = loadedImages.get('landing');
        if (img) drawCover(img, 1.0, 1.0);
        updateAndDrawParticles(false);
      } else if (isBreaching && !hasBreached) {
        if (!breachStartTime) breachStartTime = time;
        const elapsed = time - breachStartTime;
        const t = Math.min(1, elapsed / 1800);
        const easeIn = t * t * t;
        
        const scaleStart = 1.0 + (easeIn * 6.0);
        const imgL = loadedImages.get('landing');
        if (imgL) drawCover(imgL, scaleStart, 1 - easeIn);
        
        const diveT = Math.max(0, (t - 0.2) / 0.8);
        const diveEase = diveT * diveT;
        const imgD = loadedImages.get('dive');
        if (imgD) drawCover(imgD, 1.0 + diveEase * 3.0, diveEase);

        updateAndDrawParticles(true);
      } else {
        // Portfolio scroll
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        currentScroll += (targetScroll - currentScroll) * 0.08;
        const scrollVelocity = Math.abs(targetScroll - currentScroll);
        
        if (scrollVelocity > 5) {
          canvas!.style.filter = `drop-shadow(${Math.min(scrollVelocity*0.5, 10)}px 0 0 rgba(255,0,0,0.5)) drop-shadow(-${Math.min(scrollVelocity*0.5, 10)}px 0 0 rgba(0,255,255,0.5))`;
        } else {
          canvas!.style.filter = 'none';
        }

        const progress = Math.max(0, Math.min(1, currentScroll / maxScroll));
        const numScenes = ASSETS.seq.length;
        const exactIndex = progress * (numScenes - 1);
        const idx = Math.floor(exactIndex);
        const frac = exactIndex - idx;

        const imgA = loadedImages.get(`seq_${idx}`);
        const imgB = loadedImages.get(`seq_${idx + 1}`);

        if (imgA) drawCover(imgA, 1.0 + frac * 0.1, 1.0);
        if (imgB) drawCover(imgB, 1.0 + (frac - 1) * 0.1, frac);

        updateAndDrawParticles(false);
      }

      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isBreaching, hasBreached]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ willChange: 'transform, filter' }}
    />
  );
}
