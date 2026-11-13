export interface SkillItem {
  id: string;
  name: string;
  category: 'AI & Core' | 'Web & Tooling';
  descriptor: string;
  focus: string;
  accent: 'purple' | 'blue' | 'violet';
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  architectureNote: string;
  techStack: string[];
  githubUrl: string;
  imageUrl: string;
  accent: 'blue' | 'purple' | 'violet';
}

export interface EducationNode {
  id: string;
  phase: string;
  period: string;
  degree: string;
  institution: string;
  summary: string;
  highlights: string[];
  isCurrent: boolean;
}

export interface AchievementSlot {
  id: string;
  category: string;
  statusLabel: string;
  title: string;
  description: string;
  targetCycle: string;
}

export const PORTFOLIO_OWNER = {
  fullName: 'Ch. Thrimurthi',
  shortName: 'Ch. Thrimurthi',
  avatarUrl: '/src/assets/images/thrimurthi_portrait_white_1794562602707.jpg',
  greeting: 'HELLO, WORLD! 👋',
  headline: "Hi, I'm Ch. Thrimurthi.",
  role: 'Aspiring AI & Machine Learning Engineer',
  heroSummary:
    "I'm a NIAT student specializing in AI and a Computer Science student passionate about programming, artificial intelligence, and building innovative solutions.",
  aboutBio:
    "I'm a NIAT student specializing in AI and a first-year Computer Science student exploring the exciting world of AI, Machine Learning, and Software Development. I'm passionate about learning new technologies and transforming creative ideas into practical solutions.",
  university: 'Joy University · NIAT',
  degree: 'BTech – Computer Science and Engineering (AI & ML)',
  email: 'choparathrimurthi@gmail.com',
  githubUrl: 'https://github.com/thrimurthi',
  linkedinUrl: 'https://www.linkedin.com/in/thrimurthi-choppara-752005412',
};

export const SKILLS_DATA: SkillItem[] = [
  {
    id: 'python',
    name: 'Python',
    category: 'AI & Core',
    descriptor: 'Primary Programming Language',
    focus: 'Algorithmic problem solving, automation scripts, and data structures for ML pipelines.',
    accent: 'blue',
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    category: 'AI & Core',
    descriptor: 'Intelligent Systems & Search',
    focus: 'Exploring heuristic reasoning, intelligent agents, and real-world problem automation.',
    accent: 'purple',
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    category: 'AI & Core',
    descriptor: 'Predictive Modeling Foundations',
    focus: 'Studying supervised learning concepts, feature representation, and model evaluation.',
    accent: 'violet',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Web & Tooling',
    descriptor: 'Interactive Client Logic',
    focus: 'Building dynamic web interfaces, asynchronous APIs, and interactive 3D browser scenes.',
    accent: 'blue',
  },
  {
    id: 'html',
    name: 'HTML',
    category: 'Web & Tooling',
    descriptor: 'Semantic Document Structure',
    focus: 'Crafting accessible, cleanly structured web interfaces and semantic layouts.',
    accent: 'violet',
  },
  {
    id: 'css',
    name: 'CSS',
    category: 'Web & Tooling',
    descriptor: 'Responsive Layout & Visual Craft',
    focus: 'Designing fluid grid architectures, glassmorphism surfaces, and smooth motion.',
    accent: 'purple',
  },
  {
    id: 'git-github',
    name: 'Git & GitHub',
    category: 'Web & Tooling',
    descriptor: 'Version Control & Collaboration',
    focus: 'Branching workflows, clean commit histories, and open-source project hosting.',
    accent: 'blue',
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'smart-sos',
    title: 'Smart SOS Emergency Alert System',
    subtitle: 'Rapid Safety & Location Dispatch',
    description:
      'A rapid-response emergency alert application built to trigger instant distress signals, capture live coordinates, and notify trusted contacts without friction during critical situations.',
    architectureNote:
      'Combines a single-tap emergency trigger interface with geolocation coordinate capture, structured alert payloads, and resilient fallback contact routing.',
    techStack: ['Python', 'JavaScript', 'HTML', 'CSS', 'Geolocation API'],
    githubUrl: 'https://github.com/thrimurthi/smart-sos-emergency-alert',
    imageUrl: '/src/assets/images/project_smart_sos_1794561456221.jpg',
    accent: 'blue',
  },
  {
    id: 'food-waste',
    title: 'Food Waste Management System',
    subtitle: 'Surplus Redistribution Platform',
    description:
      'A community-oriented web platform designed to bridge surplus food providers and local shelters, tracking perishable inventory windows to reduce avoidable food waste.',
    architectureNote:
      'Features donor listing workflows, freshness priority sorting, and clean pickup coordination dashboards structured for high-clarity mobile and desktop access.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Python', 'Git & GitHub'],
    githubUrl: 'https://github.com/thrimurthi/food-waste-management-system',
    imageUrl: '/src/assets/images/project_food_waste_1794561456570.jpg',
    accent: 'purple',
  },
  {
    id: 'personal-portfolio',
    title: 'Personal Portfolio Website',
    subtitle: 'Interactive 3D Spatial Showcase',
    description:
      'A dark-mode 3D interactive engineering portfolio combining procedural Three.js neural core geometry, real-time pointer parallax, and responsive glassmorphism UI.',
    architectureNote:
      'Built with React, React Three Fiber, Drei, Tailwind CSS, and Framer Motion, featuring software-WebGL scaling and procedural studio environment reflections.',
    techStack: ['React', 'Three.js', 'React Three Fiber', 'Drei', 'Tailwind CSS', 'Motion'],
    githubUrl: 'https://github.com/thrimurthi/ai-ml-3d-portfolio',
    imageUrl: '/src/assets/images/project_portfolio_3d_1794561456860.jpg',
    accent: 'violet',
  },
];

export const EDUCATION_TIMELINE: EducationNode[] = [
  {
    id: 'year-1',
    phase: 'Year 1 — Foundations',
    period: '2026 – 2027',
    degree: 'BTech – Computer Science and Engineering (AI & ML)',
    institution: 'Joy University · NIAT',
    summary:
      'NIAT student specializing in AI while building core engineering fundamentals in programming, algorithmic thinking, web engineering, and mathematical foundations for machine intelligence.',
    highlights: [
      'NIAT AI Specialization Track',
      'Python Programming & Problem Solving',
      'Web Technologies (HTML, CSS, JavaScript)',
    ],
    isCurrent: true,
  },
  {
    id: 'year-2-3',
    phase: 'Years 2 & 3 — Core Intelligence',
    period: '2027 – 2029',
    degree: 'BTech – Computer Science and Engineering (AI & ML)',
    institution: 'Joy University',
    summary:
      'Deepening specialization into supervised and unsupervised learning, neural network architectures, data engineering, and applied computer vision.',
    highlights: [
      'Data Structures & Algorithms',
      'Machine Learning & Statistical Modeling',
      'Neural Networks & Deep Learning Architectures',
    ],
    isCurrent: false,
  },
  {
    id: 'year-4',
    phase: 'Year 4 — Research & Production',
    period: '2029 – 2030',
    degree: 'BTech – Computer Science and Engineering (AI & ML)',
    institution: 'Joy University',
    summary:
      'Capstone AI systems engineering, end-to-end model deployment, and collaborative industry research projects.',
    highlights: [
      'AI Systems Capstone Project',
      'MLOps & Scalable Inference Pipelines',
      'Research Publications & Industry Internships',
    ],
    isCurrent: false,
  },
];

export const ACHIEVEMENTS_DATA: AchievementSlot[] = [
  {
    id: 'hackathons',
    category: 'Hackathons',
    statusLabel: 'Active Experience',
    title: 'Multi-Hackathon Participant',
    description:
      'Participated in several hackathons, collaborating in rapid sprint teams to design, prototype, and pitch practical AI, safety, and web solutions under tight deadlines.',
    targetCycle: 'Multiple Events · 2026',
  },
  {
    id: 'competitions',
    category: 'Technical Competitions',
    statusLabel: 'Milestone Slot · Upcoming',
    title: 'Algorithmic & AI Contests',
    description:
      'Dedicated to upcoming inter-collegiate coding contests, Python problem-solving challenges, and university AI innovation showcases.',
    targetCycle: 'Target: 2026 – 2027',
  },
  {
    id: 'certifications',
    category: 'Certifications',
    statusLabel: 'Milestone Slot · In Progress',
    title: 'AI, ML & Python Credentials',
    description:
      'Tracking foundational certifications in Python programming, version control workflows, and supervised machine learning.',
    targetCycle: 'In Progress · 2026',
  },
  {
    id: 'milestones',
    category: 'Coding Milestones',
    statusLabel: 'Milestone Slot · Active',
    title: 'Open-Source & Problem Solving',
    description:
      'Building consistent daily Python & JavaScript practice streaks while shipping documented repositories on GitHub.',
    targetCycle: 'Ongoing · Year 1',
  },
];
