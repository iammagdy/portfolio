import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const EDUCATION_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(-1.5, 0.4, -14.2),
    year: '2017',
    title: 'BA of Arts — Journalism',
    subtitle: 'Media · Zagazig University',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1.5, 0.6, -15.3),
    year: '2021',
    title: 'Data Scientist Diploma',
    subtitle: 'Machinfy',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-1.5, 0.4, -16.4),
    year: '2024',
    title: 'Software Engineering',
    subtitle: 'Cairo University',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1.5, 0.5, -17.5),
    year: '2026',
    title: 'Human Resources',
    subtitle: 'Arab Academy for Science & Technology (AAST)',
    position: 'right',
  },
];

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2008',
    title: 'Senior Technical Support Specialist',
    subtitle: 'Link-ADSL',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-1.5, 0.3, -1.1),
    year: '2012',
    title: 'IT Support',
    subtitle: 'TE-Data',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1.5, 0.6, -2.2),
    year: '2014',
    title: 'IT Administrator',
    subtitle: 'TE-Data',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-1.5, 0.2, -3.3),
    year: '2017',
    title: 'Customer Care Supervisor',
    subtitle: 'e& Emirates',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1.5, 0.5, -4.4),
    year: '2020',
    title: 'Recruitment Specialist',
    subtitle: 'White Whale',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-1.5, 0.4, -5.5),
    year: '2021',
    title: 'HR Administrator',
    subtitle: 'White Whale',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1.5, 0.6, -6.6),
    year: '2022',
    title: 'Senior Sales Supervisor',
    subtitle: 'e& Egypt',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-1.5, 0.3, -7.7),
    year: '2024',
    title: 'Airline Service Coordinator',
    subtitle: 'Teleperformance',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1.5, 0.5, -8.8),
    year: 'Apr 2025',
    title: 'Corporate & Guest Transport Supervisor',
    subtitle: 'Etihad Airways',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-1.5, 0.6, -10),
    year: 'Dec 2025',
    title: 'Customer Care Team Lead',
    subtitle: 'Concentrix',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1.5, 0.5, -11.1),
    year: '2026',
    title: 'AI Product Engineer',
    description: 'Building production-ready apps at 10x speed using an AI-first workflow.',
    position: 'right',
  },
]
