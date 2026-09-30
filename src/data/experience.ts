export interface Experience {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string[];
  type: 'education' | 'hackathon' | 'milestone';
}

export const experiences: Experience[] = [
  {
    id: "btech-cse",
    title: "B.Tech Computer Science Engineering",
    organization: "University", // Will be updated
    date: "2022 - 2026",
    description: [
      "Focusing on core computer science fundamentals, data structures, and algorithms.",
      "Developing a passion for full-stack web development and edge-computing architectures."
    ],
    type: "education"
  },
  {
    id: "hack-overflow-2k26",
    title: "2nd Place Winner",
    organization: "Hack Overflow 2K26",
    date: "2024",
    description: [
      "Won 2nd place and a ₹4,000 prize for developing MediKiosk.",
      "Built an AI-powered healthcare kiosk with edge-computing for automated baseline diagnostics."
    ],
    type: "hackathon"
  },
  {
    id: "smart-india-hackathon",
    title: "Kochi Metro (KMRL) Platform",
    organization: "Smart India Hackathon",
    date: "2024",
    description: [
      "Developed an AI-driven train induction and scheduling platform.",
      "Utilized machine learning to optimize the scheduling processes for the Kochi Metro network."
    ],
    type: "hackathon"
  }
];
