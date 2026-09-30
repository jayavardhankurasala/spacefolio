export interface SkillCategory {
  title: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "LANGUAGES",
    skills: ["Java", "C", "Python", "JavaScript", "SQL"]
  },
  {
    title: "CORE CS",
    skills: ["Data Structures", "Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks"]
  },
  {
    title: "DEVELOPMENT",
    skills: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Streamlit"]
  },
  {
    title: "TOOLS",
    skills: ["Git", "GitHub", "VS Code", "Figma", "APIs"]
  },
  {
    title: "CURRENTLY EXPLORING",
    skills: ["Three.js", "WebGL", "GSAP"]
  }
];
