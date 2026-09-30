export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  role: string;
  technologies: string[];
  image?: string;
  github?: string;
  demo?: string;
  achievement?: string;
  year: number;
}

export const projects: Project[] = [
  {
    id: "medikiosk",
    title: "MediKiosk",
    shortDescription: "AI-powered healthcare kiosk.",
    description: "MediKiosk employs a decentralized edge-computing architecture. Local terminals interface with biometric and vital-sign sensors via Python scripts. Data is encrypted and transmitted securely to a cloud-hosted backend, where it is processed and rendered instantly on a React-based clinical dashboard.",
    problem: "Need for accessible, automated baseline healthcare diagnostics in remote or high-traffic areas.",
    solution: "A self-service kiosk with integrated edge-computing for immediate biometric analysis.",
    role: "Full Stack Developer",
    technologies: ["React", "Python", "Cloud Backend", "Edge Computing"],
    image: "/assets/images/certificate.jpg", // To be updated when actual screenshot exists
    achievement: "2nd place at Hack Overflow 2K26 (₹4,000 prize)",
    year: 2024
  },
  {
    id: "kochi-metro",
    title: "Kochi Metro (KMRL) Platform",
    shortDescription: "AI-driven train induction and scheduling platform.",
    description: "A transit-related project developed for the Smart India Hackathon. It focuses on optimizing the scheduling and induction processes for the Kochi Metro network using AI algorithms.",
    problem: "Inefficient manual scheduling and induction in large-scale transit systems.",
    solution: "An AI-driven platform that dynamically predicts and schedules train inductions based on live metrics.",
    role: "Developer",
    technologies: ["Python", "Machine Learning", "Data Structures"],
    year: 2024
  }
];
