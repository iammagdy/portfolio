export const WEBSITE_URL = "https://magdysaber.com";

export const ROLES = [
  "Frontend Engineer",
  "Designer",
  "Developer",
  "AI Product Engineer",
];

export interface Project {
  title: string;
  date: string;
  role: string;
  tags: string[];
  subtext: string;
  color: string;
  image?: string;
  urls: { text: string; url?: string; disabled?: boolean }[];
}

export interface WorkEntry {
  year: string;
  title: string;
  subtitle?: string;
  description?: string;
}

export interface ContactLink {
  name: string;
  icon: string;
  url: string;
}

export const PROJECTS: Project[] = [
  {
    title: "megZone",
    date: "2024-2025",
    role: "Founder & Engineer",
    tags: ["AI", "Workspace", "SaaS"],
    subtext:
      "A centralized AI workspace that lets you launch and manage multiple AI apps from one streamlined interface.",
    color: "#7c3aed",
    urls: [{ text: "VIEW", disabled: true }],
  },
  {
    title: "Wise Prompt",
    date: "2025",
    role: "Engineer",
    tags: ["AI", "Prompting", "Vision"],
    subtext:
      "An \"All-in-One\" AI workspace combining advanced prompt engineering, web scraping, and computer vision into a single interface.",
    color: "#14b8a6",
    urls: [{ text: "CODE", url: "https://github.com/iammagdy/Wise-Prompt" }],
  },
  {
    title: "Wise Quran",
    date: "2025-2026",
    role: "Designer & Engineer",
    tags: ["PWA", "Offline-first", "Audio"],
    subtext:
      "A modern, offline-first Quran Progressive Web App for reading, listening, and daily worship tracking.",
    color: "#059669",
    urls: [
      { text: "SITE", url: "https://quran.thewise.cloud" },
      { text: "CODE", url: "https://github.com/iammagdy/wisequran" },
    ],
  },
  {
    title: "Wise Resume",
    date: "2025-2026",
    role: "Product Engineer",
    tags: ["AI", "Careers", "ATS"],
    subtext:
      "AI career platform combining a resume builder (30+ templates, ATS scoring) with interview coaching, AI career tools, and an application tracker.",
    color: "#f59e0b",
    urls: [
      { text: "SITE", url: "https://resume.thewise.cloud" },
      { text: "CODE", disabled: true },
    ],
  },
  {
    title: "Portfolio",
    date: "2026",
    role: "Designer & Engineer",
    tags: ["3D", "GSAP", "Personal"],
    subtext:
      "This very portfolio — a 3D immersive experience built with React Three Fiber, GSAP, and spatial scroll-driven animations.",
    color: "#0ea5e9",
    urls: [{ text: "CODE", url: "https://github.com/iammagdy/MagdySaber_Portfolio" }],
  },
  {
    title: "Wise Hire",
    date: "2026",
    role: "Product Engineer",
    tags: ["HR", "AI", "Enterprise"],
    subtext:
      "An invite-only AI HR SaaS offering AI-written job descriptions, bulk CV screening, Kanban hiring pipeline, and enterprise SSO.",
    color: "#ec4899",
    urls: [
      { text: "SITE", url: "https://resume.thewise.cloud/enterprises" },
      { text: "CODE", disabled: true },
    ],
  },
  {
    title: "The Wise Cloud",
    date: "2026",
    role: "Founder",
    tags: ["Platform", "AI", "HR"],
    subtext:
      "A dual-product AI platform serving both job seekers and HR teams from one connected ecosystem.",
    color: "#3b82f6",
    urls: [
      { text: "SITE", url: "https://thewise.cloud" },
      { text: "CODE", disabled: true },
    ],
  },
  {
    title: "Magic Sourcing",
    date: "2026",
    role: "Engineer",
    tags: ["Chrome", "AI", "Sourcing"],
    subtext:
      "A Chrome extension automating LinkedIn candidate sourcing using Gemini AI — with profile scoring, skill-gap analysis, and outreach generation.",
    color: "#f97316",
    urls: [{ text: "VIEW", disabled: true }],
  },
];

export const WORK_TIMELINE: WorkEntry[] = [
  { year: "2008", title: "Senior Technical Support Specialist", subtitle: "Link-ADSL" },
  { year: "2012", title: "IT Support", subtitle: "TE-Data" },
  { year: "2014", title: "IT Administrator", subtitle: "TE-Data" },
  { year: "2017", title: "Customer Care Supervisor", subtitle: "e& Emirates" },
  { year: "2020", title: "Recruitment Specialist", subtitle: "White Whale" },
  { year: "2021", title: "HR Administrator", subtitle: "White Whale" },
  { year: "2022", title: "Senior Sales Supervisor", subtitle: "e& Egypt" },
  { year: "2024", title: "Airline Service Coordinator", subtitle: "Teleperformance" },
  { year: "Apr 2025", title: "Corporate & Guest Transport Supervisor", subtitle: "Etihad Airways" },
  { year: "Dec 2025", title: "Customer Care Team Lead", subtitle: "Concentrix" },
  { year: "2026", title: "AI Product Engineer", description: "Building production-ready apps at 10x speed using an AI-first workflow." },
];

export const CONTACT_LINKS: ContactLink[] = [
  { name: "Website — magdysaber.com", icon: "globe", url: WEBSITE_URL },
  { name: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/magdy-saber" },
  { name: "GitHub", icon: "github", url: "https://github.com/iammagdy" },
  { name: "Email", icon: "mail", url: "mailto:contact@magdysaber.com?subject=Hello%20Magdy&body=Hi%20Magdy%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20wanted%20to%20reach%20out%20about%20" },
];
