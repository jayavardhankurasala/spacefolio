"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { skillCategories } from "@/data/skills";

import { 
  FaJava, FaPython, FaDatabase, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaFigma, FaServer
} from "react-icons/fa";
import { 
  SiJavascript, SiC, SiNextdotjs, SiStreamlit, SiThreedotjs, SiWebgl, SiGreensock
} from "react-icons/si";
import { 
  Code2, Cpu, Network, Layers, Layout, Server, Boxes, ShieldAlert
} from "lucide-react";

const iconMap: Record<string, { icon: any, color: string }> = {
  "Java": { icon: FaJava, color: "#f89820" },
  "C": { icon: SiC, color: "#a8b9cc" },
  "Python": { icon: FaPython, color: "#3776ab" },
  "JavaScript": { icon: SiJavascript, color: "#f7df1e" },
  "SQL": { icon: FaDatabase, color: "#4479a1" },
  "DSA": { icon: Boxes, color: "#38bdf8" },
  "Data Structures": { icon: Boxes, color: "#38bdf8" },
  "Algorithms": { icon: Code2, color: "#38bdf8" },
  "OOP": { icon: Layers, color: "#38bdf8" },
  "DBMS": { icon: Server, color: "#38bdf8" },
  "Operating Systems": { icon: Cpu, color: "#38bdf8" },
  "Computer Networks": { icon: Network, color: "#38bdf8" },
  "HTML": { icon: FaHtml5, color: "#e34f26" },
  "CSS": { icon: FaCss3Alt, color: "#1572b6" },
  "React": { icon: FaReact, color: "#61dafb" },
  "Next.js": { icon: SiNextdotjs, color: "#ffffff" },
  "Streamlit": { icon: SiStreamlit, color: "#ff4b4b" },
  "Git": { icon: FaGitAlt, color: "#f05032" },
  "GitHub": { icon: FaGithub, color: "#ffffff" },
  "VS Code": { icon: Code2, color: "#007acc" },
  "Figma": { icon: FaFigma, color: "#f24e1e" },
  "APIs": { icon: Network, color: "#10b981" },
  "Three.js": { icon: SiThreedotjs, color: "#ffffff" },
  "WebGL": { icon: SiWebgl, color: "#990000" },
  "GSAP": { icon: SiGreensock, color: "#88ce02" }
};

// Flatten skills to a single array
const allSkills = skillCategories.flatMap(cat => cat.skills.map(skill => ({ name: skill, category: cat.title })));

function SkillNode({ skill, position }: { skill: { name: string, category: string }, position: THREE.Vector3 }) {
  const mapped = iconMap[skill.name] || { icon: ShieldAlert, color: "#fff" };
  const Icon = mapped.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={position}>
      <Html center transform zIndexRange={[100, 0]} sprite>
        <div 
          className={`flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer select-none rounded-xl bg-black/40 backdrop-blur-md border ${hovered ? 'scale-125 border-cyan-400/50' : 'scale-100 border-white/10'}`}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          style={{ boxShadow: hovered ? `0 0 20px ${mapped.color}44` : 'none' }}
        >
          <div 
            className="text-4xl drop-shadow-2xl mb-2"
            style={{ color: mapped.color, filter: `drop-shadow(0 0 10px ${mapped.color}66)` }}
          >
            <Icon strokeWidth={1.5} />
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-white whitespace-nowrap">
            {skill.name}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-white/40 mt-1 uppercase">
            {skill.category}
          </span>
        </div>
      </Html>
    </Float>
  );
}

function Constellation() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Rotate the whole constellation slowly
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Generate random spherical positions
  const positions = useMemo(() => {
    const pos = [];
    const radius = 6;
    for (let i = 0; i < allSkills.length; i++) {
      const phi = Math.acos(-1 + (2 * i) / allSkills.length);
      const theta = Math.sqrt(allSkills.length * Math.PI) * phi;
      pos.push(new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      ));
    }
    return pos;
  }, []);

  return (
    <group ref={groupRef}>
      {allSkills.map((skill, i) => (
        <SkillNode key={i} skill={skill} position={positions[i]} />
      ))}
    </group>
  );
}

export default function SkillsSection() {
  return (
    <section className="py-24 relative z-10 min-h-screen flex flex-col" id="skills">
      <div className="max-w-6xl mx-auto px-6 w-full mb-8 text-center">
        <h2 className="sec-heading text-4xl md:text-5xl font-bold mb-4 text-white/90 tracking-wide">
          TECHNICAL <span className="text-cyan-400">CONSTELLATION</span>
        </h2>
        <p className="text-white/50 font-mono text-sm tracking-widest">INTERACT WITH THE 3D SCENE BELOW</p>
      </div>
      
      {/* 3D Canvas Container */}
      <div className="flex-1 w-full min-h-[600px] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030407]/50 to-transparent pointer-events-none z-0" />
        <Canvas camera={{ position: [0, 0, 12], fov: 60 }} className="z-10">
          <ambientLight intensity={0.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Constellation />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </section>
  );
}
