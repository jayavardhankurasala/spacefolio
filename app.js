/**
 * ════════════════════════════════════════════════
 * CONFIGURATION ARCHITECTURE & DYNAMIC STATE
 * ════════════════════════════════════════════════
 */
const DEFAULT_CONFIG = {
  name: "Jayavardhan Kurasala",
  shortName: "JK",
  role: "Computer Science Engineering Student & Developer",
  location: "Tadepalligudem",
  aboutText: "I'm Jayavardhan Kurasala, a Computer Science Engineering student who enjoys turning practical problems into clear, usable software. I work across web development, interface design, and programming fundamentals, and I learn best by building, testing, and refining ideas. My recent projects include MediKiosk, a healthcare intake concept, and a prototype for Kochi Metro train-induction planning. I'm interested in how thoughtful software can make everyday tasks more accessible and organized. I value collaboration, curiosity, and honest engineering: a prototype should communicate a concept, while a production system needs reliable data, security, testing, and validation. I'm continuing to strengthen my programming, full-stack development, and problem-solving skills by building digital experiences with a clear purpose.",
  email: "jayavardhan.kurasala@gmail.com",
  phone: "+917815902369",
  githubUrl: "https://github.com/jayavardhankurasala",
  linkedInUrl: "https://www.linkedin.com/in/jayavardhan-kurasala-2834b53ba?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  leetcodeUrl: "https://leetcode.com/u/Jayavardhan_kurasala/",
  gfgUrl: "https://www.geeksforgeeks.org/profile/jayavardhahjs3?tab=overview",
  codechefUrl: "https://www.codechef.com/users/u24a81a05f9",
  sections: {
    hero: true,
    about: true,
    education: true,
    work: true,
    skills: true,
    contact: true
  },
  customProjects: []
};

function getMergedConfig() {
  try {
    const stored = localStorage.getItem('spacefolio_config');
    if (stored) {
      const parsed = JSON.parse(stored);
      return Object.assign({}, DEFAULT_CONFIG, parsed);
    }
  } catch (err) {
    console.warn("Could not read local config, using defaults", err);
  }
  return DEFAULT_CONFIG;
}

const CONFIG = getMergedConfig();

// Route helper: If navigated to /#admin, redirect to /admin.html
if (window.location.hash === '#admin') {
  window.location.href = '/admin.html';
}

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
      const pct = Math.round((loadedCount / totalAssets) * 100);
      const lp = document.getElementById('loadPercent');
      if (lp) lp.textContent = pct + '%';
      const pb = document.getElementById('progressBar');
      if (pb) pb.style.width = pct + '%';
      const fs = document.getElementById('frameStats');
      if (fs) fs.textContent = `Aligning coordinates ${loadedCount}/${totalAssets}`;
      const loaderEl = document.getElementById('loader');
      if (loaderEl) loaderEl.setAttribute('aria-valuenow', pct.toString());
      resolve(img);
    };
    img.onerror = () => {
      console.warn('Fallback loading for asset:', url);
      loadedCount++;
      const pct = Math.round((loadedCount / totalAssets) * 100);
      const lp = document.getElementById('loadPercent');
      if (lp) lp.textContent = pct + '%';
      const pb = document.getElementById('progressBar');
      if (pb) pb.style.width = pct + '%';
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
const NUM_PARTICLES = window.innerWidth < 768 ? 200 : 500;
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
    if (isWarping) speed *= 15;
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
    
    const audioBtn = document.getElementById('btnAudioToggle');
    if (audioBtn) audioBtn._gain = gainNode;
  }
}

function updateAudioPulse() {
  if (!isAudioActive || !analyser) {
    currentBassPulse += (0 - currentBassPulse) * 0.1;
    return;
  }
  analyser.getByteFrequencyData(dataArray);
  let bassSum = 0;
  for(let i = 0; i < 4; i++) bassSum += dataArray[i];
  const targetPulse = (bassSum / (4 * 255)) * 0.08;
  currentBassPulse += (targetPulse - currentBassPulse) * 0.15;
}

/**
 * ════════════════════════════════════════════════
 * CANVAS ENGINE & SCROLL PHYSICS
 * ════════════════════════════════════════════════
 */
const canvas = document.getElementById('sequenceCanvas');
const ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null;
let w, h;
let currentScroll = 0;
let targetScroll = 0;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

function resize() {
  if (!canvas) return;
  w = window.innerWidth;
  h = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
}

function drawCover(img, scale = 1.0, alpha = 1.0) {
  if (!img || !ctx) return;
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

function render() {
  if (!ctx) return;
  updateAudioPulse();

  ctx.fillStyle = '#010103';
  ctx.fillRect(0, 0, w, h);

  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  currentScroll += (targetScroll - currentScroll) * 0.04;
  const scrollVelocity = Math.abs(targetScroll - currentScroll);
  
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
  const audioScale = (idx === 0) ? currentBassPulse : 0;

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
 * SECTION VISIBILITY & DYNAMIC CONTENT RENDERING
 * ════════════════════════════════════════════════
 */
function applySectionVisibility(sectionsConfig) {
  if (!sectionsConfig) return;
  const sectionKeys = ['hero', 'about', 'education', 'work', 'skills', 'contact'];

  sectionKeys.forEach(secKey => {
    const isVisible = sectionsConfig[secKey] !== false;
    const secEl = document.getElementById(secKey);
    if (secEl) {
      secEl.classList.toggle('section-hidden', !isVisible);
    }
    // Also toggle corresponding nav links
    document.querySelectorAll(`a[href="#${secKey}"]`).forEach(link => {
      link.classList.toggle('section-hidden', !isVisible);
    });
  });
}

function renderCustomProjects(customProjects) {
  if (!customProjects || !customProjects.length) return;
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  customProjects.forEach(cp => {
    const card = document.createElement('article');
    card.className = 'project-card glass-panel reveal-up visible';
    card.style.setProperty('--delay', '.2s');

    const cleanId = cp.id || ('custom_' + Math.random().toString(36).substring(2, 8));
    const tagsString = (cp.tags || []).join(' · ');

    card.innerHTML = `
      <button class="project-card-button" type="button" data-project="${cleanId}" data-project-title="${escapeHTML(cp.title)}"
        data-project-subtitle="${escapeHTML(cp.subtitle)}"
        data-section-labels="Overview|Workflow|Delivery" aria-haspopup="dialog">
        <span class="project-visual project-visual-image">
          <img src="${cp.image ? escapeHTML(cp.image) : 'ezgif-7ea5ecfd07305554-jpg/certificate.jpg'}" alt="${escapeHTML(cp.title)}">
        </span>
        <span class="project-copy">
          <span class="project-title">${escapeHTML(cp.title)}</span>
          <span class="project-subtitle">${escapeHTML(cp.subtitle)}</span>
          <span class="project-brief">${escapeHTML(cp.brief)}</span>
          <span class="project-open">Read case study <span aria-hidden="true">→</span></span>
        </span>
      </button>
    `;

    // Create dynamic template for modal
    const template = document.createElement('template');
    template.id = `projectDetails${cleanId.charAt(0).toUpperCase() + cleanId.slice(1)}`;
    template.innerHTML = `
      <section id="project-panel-overview" class="project-detail-section" data-project-section="overview">
        <h3>The Challenge &amp; Overview</h3>
        <p>${escapeHTML(cp.brief)}</p>
        ${cp.image ? `<img class="project-detail-screenshot" src="${escapeHTML(cp.image)}" alt="${escapeHTML(cp.title)}">` : ''}
      </section>
      <section id="project-panel-approach" class="project-detail-section" data-project-section="approach">
        <h3>Approach &amp; Stack</h3>
        <p>${escapeHTML(cp.desc)}</p>
        ${tagsString ? `<p><strong>Technologies:</strong> ${tagsString}</p>` : ''}
      </section>
      <section id="project-panel-delivery" class="project-detail-section" data-project-section="delivery">
        <h3>Project Delivery</h3>
        <div class="project-detail-actions">
          ${cp.demo ? `<a href="${escapeHTML(cp.demo)}" target="_blank" rel="noopener noreferrer" class="project-link-button project-link-button-primary">Live Demo <span aria-hidden="true">↗</span></a>` : ''}
          ${cp.github ? `<a href="${escapeHTML(cp.github)}" target="_blank" rel="noopener noreferrer" class="project-link-button">GitHub Repository <span aria-hidden="true">↗</span></a>` : ''}
        </div>
      </section>
    `;
    document.body.appendChild(template);

    const btn = card.querySelector('.project-card-button');
    btn.addEventListener('click', () => {
      if (typeof openProjectDetails === 'function') {
        openProjectDetails(btn);
      }
    });

    grid.appendChild(card);
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * ════════════════════════════════════════════════
 * UI & INTERACTION PHYSICS
 * ════════════════════════════════════════════════
 */
function initUI() {
  const currentConfig = getMergedConfig();

  // Populate config
  const logoEl = document.getElementById('conf-logo'); if (logoEl) logoEl.textContent = currentConfig.shortName || "JK";
  const logoShortEl = document.getElementById('conf-logo-short'); if (logoShortEl) logoShortEl.textContent = currentConfig.shortName || "JK";
  const nameHeroEl = document.getElementById('conf-name-hero'); if (nameHeroEl) nameHeroEl.textContent = currentConfig.name;
  const roleEl = document.querySelector('.hero-role'); if (roleEl && currentConfig.role) roleEl.textContent = currentConfig.role;
  const aboutBodyEl = document.querySelector('.about-body'); if (aboutBodyEl && currentConfig.aboutText) aboutBodyEl.textContent = currentConfig.aboutText;
  
  const locEl = document.getElementById('conf-location'); if (locEl) locEl.textContent = currentConfig.location;
  const emailLinkEl = document.getElementById('conf-email-link'); if (emailLinkEl) emailLinkEl.href = `mailto:${currentConfig.email}`;
  const emailTextEl = document.getElementById('conf-email-text'); if (emailTextEl) emailTextEl.textContent = currentConfig.email;
  const githubEl = document.getElementById('conf-github'); if (githubEl) githubEl.href = currentConfig.githubUrl;
  const linkedinEl = document.getElementById('conf-linkedin'); if (linkedinEl) linkedinEl.href = currentConfig.linkedInUrl;
  const footerNameEl = document.getElementById('conf-footer-name'); if (footerNameEl) footerNameEl.textContent = currentConfig.name;

  // Apply Section Visibility
  applySectionVisibility(currentConfig.sections);

  // Render Custom Projects
  renderCustomProjects(currentConfig.customProjects);

  // Audio Toggle
  const btnAudio = document.getElementById('btnAudioToggle');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      setupAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      isAudioActive = !isAudioActive;
      if (isAudioActive) {
        if (btnAudio._gain) btnAudio._gain.gain.setTargetAtTime(0.15, audioCtx.currentTime, 0.5);
        document.getElementById('iconAudioMute')?.classList.add('hidden');
        document.getElementById('iconAudioOn')?.classList.remove('hidden');
      } else {
        if (btnAudio._gain) btnAudio._gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3);
        document.getElementById('iconAudioMute')?.classList.remove('hidden');
        document.getElementById('iconAudioOn')?.classList.add('hidden');
      }
    });
  }

  // Magnetic Micro-Interactions
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const hx = rect.left + rect.width / 2;
      const hy = rect.top + rect.height / 2;
      const dx = e.clientX - hx;
      const dy = e.clientY - hy;
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
    if (siteNav) {
      if (window.scrollY > 20) siteNav.classList.add('scrolled');
      else siteNav.classList.remove('scrolled');
    }

    let currentId = '';
    sections.forEach(s => {
      if (!s.classList.contains('section-hidden') && window.scrollY >= s.offsetTop - 300) {
        currentId = s.id;
      }
    });
    navLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${currentId}`) l.classList.add('active');
    });
  }, { passive: true });

  // Mobile menu
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#' || href === '#admin') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const top = target.offsetTop - 72;
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

  // Load assets with timeout safety so loader never gets permanently stuck
  const loadPromise = Promise.all(ASSETS.seq.map((url, i) => 
    loadImg(url).then(img => loadedImages.set(`seq_${i}`, img))
  ));

  const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2500));

  try {
    await Promise.race([loadPromise, timeoutPromise]);
  } catch (err) {
    console.error("Asset loading warning:", err);
  }

  // Update loader text to ready state
  const loaderLabel = document.getElementById('loaderLabel');
  if (loaderLabel) loaderLabel.textContent = "Universe Traversed · Entering Spacefolio";

  // Hide loader with smooth cosmic fade out
  setTimeout(() => {
    const loaderEl = document.getElementById('loader');
    if (loaderEl) loaderEl.classList.add('fade-out');
  }, 400);

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
  if (!educationCards.length) return;
  activeEducationIndex = Math.max(0, Math.min(index, educationCards.length - 1));
  educationCards.forEach((card, cardIndex) => {
    card.classList.toggle('is-active', cardIndex === activeEducationIndex);
  });
  if (educationPrevious) educationPrevious.disabled = activeEducationIndex === 0;
  if (educationNext) educationNext.disabled = activeEducationIndex === educationCards.length - 1;
}

if (educationPrevious && educationNext) {
  educationPrevious.addEventListener('click', () => showEducation(activeEducationIndex - 1));
  educationNext.addEventListener('click', () => showEducation(activeEducationIndex + 1));
  showEducation(0);
}

// Space themes engagement ripple - safe check prevents null reference
const landingOverlay = document.getElementById('landingOverlay');
if (landingOverlay) {
  landingOverlay.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'space-ripple';
    const size = Math.max(window.innerWidth, window.innerHeight) * 0.15;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - size/2}px`;
    ripple.style.top = `${e.clientY - size/2}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  });
}
