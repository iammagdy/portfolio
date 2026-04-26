import { Project } from "../types";

// Sorted oldest -> newest (left -> right in the carousel).
export const PROJECTS: Project[] = [
  {
    title: 'megZone',
    date: '2024-2025',
    subtext: 'megZone is a centralized AI workspace that lets you launch and manage multiple AI apps (starting with the AI CV Builder) from one streamlined interface. Unpublished — development paused.',
    urls: [
      { text: 'VIEW ↗', disabled: true },
    ],
  },
  {
    title: 'Wise Prompt',
    date: '2025',
    subtext: 'An "All-in-One" AI workspace that combines advanced prompt engineering, web scraping, and computer vision into a single Streamlit interface, allowing users to generate full-stack code, analyze live websites, and replicate UI designs instantly.',
    urls: [
      { text: 'CODE ↗', url: 'https://github.com/iammagdy/Wise-Prompt' },
    ],
  },
  {
    title: 'Wise Quran',
    date: '2025-2026',
    subtext: 'A modern, offline-first Quran Progressive Web App (PWA) for reading, listening, and daily worship tracking.',
    urls: [
      { text: 'SITE ↗', url: 'https://quran.thewise.cloud' },
      { text: 'CODE ↗', url: 'https://github.com/iammagdy/wisequran' },
    ],
  },
  {
    title: 'Wise Resume',
    date: '2025-2026',
    subtext: 'AI career platform for job seekers that combines a powerful resume builder (30+ templates, ATS scoring, multi-format export) with interview coaching, AI career tools, a public portfolio builder, and an application tracker, all running on a shared AI and Supabase backend.',
    urls: [
      { text: 'SITE ↗', url: 'https://resume.thewise.cloud' },
      { text: 'CODE ↗', disabled: true },
    ],
  },
  {
    title: 'Portfolio',
    date: '2026',
    subtext: '[Enter a meta joke].',
    urls: [
      { text: 'CODE ↗', url: 'https://github.com/iammagdy/MagdySaber_Portfolio' },
    ],
  },
  {
    title: 'Wise Hire',
    date: '2026',
    subtext: 'An invite-only AI HR SaaS for recruiters and HR teams that offers AI-written job descriptions, candidate briefs, bulk CV screening, a Kanban hiring pipeline, HR analytics, and enterprise-ready features like SSO, all built on the same Wise Cloud platform.',
    urls: [
      { text: 'SITE ↗', url: 'https://resume.thewise.cloud/enterprises' },
      { text: 'CODE ↗', disabled: true },
    ],
  },
  {
    title: 'The Wise Cloud',
    date: '2026',
    subtext: 'A dual-product AI platform that serves both sides of the hiring market from one place, giving job seekers and HR teams all their tools in a single, connected ecosystem. Currently under development.',
    urls: [
      { text: 'SITE ↗', url: 'https://thewise.cloud' },
      { text: 'CODE ↗', disabled: true },
    ],
  },
  {
    title: 'Magic Sourcing',
    date: '2026',
    subtext: 'A Chrome extension that automates LinkedIn candidate sourcing using Google Gemini AI (and optionally OpenRouter or Groq). It evaluates profiles against a job description, scores matches, and presents a full-featured results dashboard with skill-gap analysis, outreach generation, and session history.',
    urls: [
      { text: 'VIEW ↗', disabled: true },
    ],
  },
];
