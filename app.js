/**
 * ════════════════════════════════════════════════
 * CONFIGURATION ARCHITECTURE
 * ════════════════════════════════════════════════
 */
const CONFIG = {
  name: "Jayavardhan Kurasala",
  shortName: "JK",
  role: "Computer Science Student",
  location: "Tadepalligudem",
  email: "jayavardhan.kurasala@gmail.com",
  githubUrl: "https://github.com/jayavardhankurasala",
  linkedInUrl: "https://www.linkedin.com/in/jayavardhan-kurasala-2834b53ba?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  twitterUrl: "#"
};

/**
 * ════════════════════════════════════════════════
 * ASSET & PRELOADER ARCHITECTURE
 * ════════════════════════════════════════════════
 */
const ASSETS = {
  seq: [
    'ezgif-7ea5ecfd07305554-jpg/image-7.jpg',
    'ezgif-7ea5ecfd07305554-jpg/image-10.jpg',
    'ezgif-7ea5ecfd07305554-jpg/image-11.jpg',
    'ezgif-7ea5ecfd07305554-jpg/image-12.jpg'
  ]
};

const loadedImages = new Map();
let totalAssets = ASSETS.seq.length;
let loadedCount = 0;

function loadImg(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedCount++;
      document.getElementById('loadPercent').textContent = Math.round((loadedCount / totalAssets) * 100) + '%';
      document.getElementById('progressBar').style.width = (loadedCount / totalAssets) * 100 + '%';
      resolve(img);
    };
    img.onerror = () => {
      console.error('Failed to load image:', url);
      loadedCount++;
      document.getElementById('loadPercent').textContent = Math.round((loadedCount / totalAssets) * 100) + '%';
      document.getElementById('progressBar').style.width = (loadedCount / totalAssets) * 100 + '%';
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * ════════════════════════════════════════════════
 * 3D PARTICLE ENGINE (STARFIELD)
 * ════════════════════════════════════════════════
 */
const particles = [];
const NUM_PARTICLES = window.innerWidth < 768 ? 200 : 500; // Graceful degradation
const FOCAL_LENGTH = 300;

function initParticles() {
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
}

function updateAndDrawParticles(ctx, w, h, isWarping, mouseX, mouseY) {
  const cx = w / 2;
  const cy = h / 2;

  ctx.save();
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const p = particles[i];
    
    // Repulsion logic
    let dx = p.x;
    let dy = p.y;
    // We map mouse to 3D space roughly at z=500
    const mX = (mouseX - cx) * (500 / FOCAL_LENGTH);
    const mY = (mouseY - cy) * (500 / FOCAL_LENGTH);
    const distSq = (p.x - mX) * (p.x - mX) + (p.y - mY) * (p.y - mY);
    if (distSq < 20000 && p.z < 800) {
      const force = (20000 - distSq) / 20000;
      p.x += (p.x - mX) * force * 0.05;
      p.y += (p.y - mY) * force * 0.05;
    }

    // Velocity
    let speed = p.baseSpeed;
    if (isWarping) speed *= 15; // Warp Acceleration
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
      ctx.beginPath();
      if (isWarping) {
        // Motion trail
        const oldScale = FOCAL_LENGTH / (p.z + speed * 2);
        const oldPx = p.x * oldScale + cx;
        const oldPy = p.y * oldScale + cy;
        ctx.moveTo(oldPx, oldPy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = p.color + p.alpha + ')';
        ctx.lineWidth = r;
        ctx.stroke();
      } else {
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (p.alpha * Math.min(1, scale)) + ')';
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

/**
 * ════════════════════════════════════════════════
 * AUDIO REACTIVE LENSING
 * ════════════════════════════════════════════════
 */
let audioCtx = null;
let analyser = null;
let dataArray = null;
let isAudioActive = false;
let currentBassPulse = 0;

function setupAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine'; osc1.frequency.setValueAtTime(43.65, audioCtx.currentTime); 
    osc2.type = 'triangle'; osc2.frequency.setValueAtTime(65.4, audioCtx.currentTime); 

    filter.type = 'lowpass'; filter.frequency.setValueAtTime(150, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    osc1.start(); osc2.start();
    
    // Toggle logic stored on button
    document.getElementById('btnAudioToggle')._gain = gainNode;
  }
}

function updateAudioPulse() {
  if (!isAudioActive || !analyser) {
    currentBassPulse += (0 - currentBassPulse) * 0.1;
    return;
  }
  analyser.getByteFrequencyData(dataArray);
  let bassSum = 0;
  for(let i=0; i<4; i++) bassSum += dataArray[i];
  const targetPulse = (bassSum / (4 * 255)) * 0.08; // Max 8% scale bump
  currentBassPulse += (targetPulse - currentBassPulse) * 0.15;
}

/**
 * ════════════════════════════════════════════════
 * CANVAS ENGINE & SCROLL PHYSICS
 * ════════════════════════════════════════════════
 */
const canvas = document.getElementById('sequenceCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
let w, h;

let currentScroll = 0;
let targetScroll = 0;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function resize() {
  w = window.innerWidth;
  h = window.innerHeight;
  // High DPI support
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
}

function drawCover(img, scale = 1.0, alpha = 1.0) {
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

  ctx.globalAlpha = alpha;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.globalAlpha = 1.0;
}

function render(time) {
  updateAudioPulse();

  // Draw pure black base
  ctx.fillStyle = '#010103';
  ctx.fillRect(0, 0, w, h);

  // Portfolio Scroll Sequence
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  
  // Inertial scroll lerp
  currentScroll += (targetScroll - currentScroll) * 0.04;
  const scrollVelocity = Math.abs(targetScroll - currentScroll);
  
  // Chromatic warp based on velocity
  if (scrollVelocity > 5) {
    canvas.style.filter = `drop-shadow(${Math.min(scrollVelocity*0.5, 10)}px 0 0 rgba(255,0,0,0.5)) drop-shadow(-${Math.min(scrollVelocity*0.5, 10)}px 0 0 rgba(0,255,255,0.5))`;
  } else {
    canvas.style.filter = 'none';
  }

  const progress = Math.max(0, Math.min(1, currentScroll / maxScroll));
  const numScenes = ASSETS.seq.length;
  const exactIndex = progress * (numScenes - 1);
  const idx = Math.floor(exactIndex);
  const frac = exactIndex - idx;

  const imgA = loadedImages.get(`seq_${idx}`);
  const imgB = loadedImages.get(`seq_${idx + 1}`);

  // Audio reactive pulse on first scene (black hole)
  const audioScale = (idx === 0) ? currentBassPulse : 0;

  // Cross-dissolve logic
  const scaleA = 1.0 + frac * 0.1 + audioScale;
  const alphaA = Math.cos(frac * Math.PI * 0.5);
  drawCover(imgA, scaleA, alphaA);

  if (imgB && frac > 0) {
    const scaleB = 1.0 + (1 - frac) * 0.1;
    const alphaB = Math.sin(frac * Math.PI * 0.5);
    drawCover(imgB, scaleB, alphaB);
  }

  updateAndDrawParticles(ctx, w, h, false, mouseX, mouseY);

  requestAnimationFrame(render);
}

window.addEventListener('scroll', () => {
  targetScroll = window.scrollY;
}, { passive: true });

/**
 * ════════════════════════════════════════════════
 * UI & INTERACTION PHYSICS
 * ════════════════════════════════════════════════
 */
function initUI() {
  // Populate config
  const logoEl = document.getElementById('conf-logo'); if (logoEl) logoEl.textContent = CONFIG.shortName || "PORTFOLIO";
  const logoShortEl = document.getElementById('conf-logo-short'); if (logoShortEl) logoShortEl.textContent = CONFIG.shortName || "PORTFOLIO";
  const nameHeroEl = document.getElementById('conf-name-hero'); if (nameHeroEl) nameHeroEl.textContent = CONFIG.name;
  const locEl = document.getElementById('conf-location'); if (locEl) locEl.textContent = CONFIG.location;
  const emailLinkEl = document.getElementById('conf-email-link'); if (emailLinkEl) emailLinkEl.href = `mailto:${CONFIG.email}`;
  const emailTextEl = document.getElementById('conf-email-text'); if (emailTextEl) emailTextEl.textContent = CONFIG.email;
  const githubEl = document.getElementById('conf-github'); if (githubEl) githubEl.href = CONFIG.githubUrl;
  const linkedinEl = document.getElementById('conf-linkedin'); if (linkedinEl) linkedinEl.href = CONFIG.linkedInUrl;
  const twitterEl = document.getElementById('conf-twitter'); if (twitterEl) twitterEl.href = CONFIG.twitterUrl;
  const footerNameEl = document.getElementById('conf-footer-name'); if (footerNameEl) footerNameEl.textContent = CONFIG.name;

  // Audio Toggle
  const btnAudio = document.getElementById('btnAudioToggle');
  btnAudio.addEventListener('click', () => {
    setupAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    isAudioActive = !isAudioActive;
    if (isAudioActive) {
      btnAudio._gain.gain.setTargetAtTime(0.15, audioCtx.currentTime, 0.5);
      document.getElementById('iconAudioMute').classList.add('hidden');
      document.getElementById('iconAudioOn').classList.remove('hidden');
    } else {
      btnAudio._gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3);
      document.getElementById('iconAudioMute').classList.remove('hidden');
      document.getElementById('iconAudioOn').classList.add('hidden');
    }
  });

  // Magnetic Micro-Interactions
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const hx = rect.left + rect.width / 2;
      const hy = rect.top + rect.height / 2;
      const dx = e.clientX - hx;
      const dy = e.clientY - hy;
      // 30% pull strength
      btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // Holographic Glass Panel Cursor Spotlight
  document.querySelectorAll('.glass-panel').forEach(panel => {
    panel.addEventListener('mousemove', e => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      panel.style.setProperty('--mouse-x', `${x}px`);
      panel.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Intersection Observers for Reveals & Nav
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');
  const siteNav = document.getElementById('siteNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) siteNav.classList.add('scrolled');
    else siteNav.classList.remove('scrolled');

    // Active nav tracking
    let currentId = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 300) currentId = s.id;
    });
    navLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${currentId}`) l.classList.add('active');
    });
  }, { passive: true });

  // Mobile menu
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        const top = target.offsetTop - 72; // nav height offset
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/**
 * ════════════════════════════════════════════════
 * BOOTSTRAP
 * ════════════════════════════════════════════════
 */
async function bootstrap() {
  resize();
  window.addEventListener('resize', resize);
  initParticles();
  initUI();

  // Load assets
  try {
    for (let i = 0; i < ASSETS.seq.length; i++) {
      loadedImages.set(`seq_${i}`, await loadImg(ASSETS.seq[i]));
    }
  } catch (err) {
    console.error("Asset loading error", err);
  }

  // Hide loader
  const loaderEl = document.getElementById('loader');
  if (loaderEl) loaderEl.classList.add('fade-out');

  // Start Engine
  requestAnimationFrame(render);
}

document.addEventListener('DOMContentLoaded', () => {
  bootstrap();
});

const educationCards = Array.from(document.querySelectorAll('[data-education-index]'));
const educationPrevious = document.querySelector('.education-arrow-prev');
const educationNext = document.querySelector('.education-arrow-next');
let activeEducationIndex = 0;

function showEducation(index) {
  activeEducationIndex = Math.max(0, Math.min(index, educationCards.length - 1));
  educationCards.forEach((card, cardIndex) => {
    card.classList.toggle('is-active', cardIndex === activeEducationIndex);
  });
  educationPrevious.disabled = activeEducationIndex === 0;
  educationNext.disabled = activeEducationIndex === educationCards.length - 1;
}

educationPrevious.addEventListener('click', () => showEducation(activeEducationIndex - 1));
educationNext.addEventListener('click', () => showEducation(activeEducationIndex + 1));
showEducation(0);

// Space themes engagement ripple
document.getElementById('landingOverlay').addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  ripple.className = 'space-ripple';
  const size = Math.max(window.innerWidth, window.innerHeight) * 0.15;
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - size/2}px`;
  ripple.style.top = `${e.clientY - size/2}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 800);
});
