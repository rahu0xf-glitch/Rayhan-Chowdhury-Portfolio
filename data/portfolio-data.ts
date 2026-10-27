export const PORTRAIT_IMAGE_PATH =
  '/assets/aistudio/IMG-20261027-WA0019_53031013.jpg';

export enum SkillStage {
  Learning = 'Learning',
  Practicing = 'Practicing',
  Proficient = 'Proficient',
  Professional = 'Professional Experience',
}

export const SKILL_STAGES: SkillStage[] = [
  SkillStage.Learning,
  SkillStage.Practicing,
  SkillStage.Proficient,
  SkillStage.Professional,
];

export interface SkillItem {
  id: string;
  name: string;
  stage: SkillStage;
}

export interface ExpertiseDomain {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: 'shield' | 'brain' | 'code' | 'cpu' | 'film';
  skills: SkillItem[];
}

export type ProjectCategory =
  | 'All Projects'
  | 'Cybersecurity'
  | 'AI & Data'
  | 'Software'
  | 'Web Development'
  | 'Creative Media';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'All Projects',
  'Cybersecurity',
  'AI & Data',
  'Software',
  'Web Development',
  'Creative Media',
];

export interface ProjectItem {
  id: string;
  title: string;
  category: Exclude<ProjectCategory, 'All Projects'>;
  summary: string;
  caseStudyOverview: string;
  caseStudyObjectives: string[];
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  caseStudyUrl: string;
  visualMotif: 'lattice' | 'neural' | 'architecture' | 'interface' | 'prism';
  customImageUrl?: string;
  isConfigurableExample?: boolean;
}

export interface AboutBlock {
  id: string;
  label: string;
  title: string;
  content: string;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  handle: string;
  url: string;
}

export const HERO_CONTENT = {
  eyebrow: 'MULTIDISCIPLINARY TECHNOLOGY PORTFOLIO',
  heading: 'RAYHAN CHOWDHURY',
  tagline: 'Technology Beyond Boundaries.',
  supportingText:
    'Exploring Cybersecurity, Artificial Intelligence, Software Engineering, Data Science, and Digital Creativity.',
  primaryCta: 'Explore My World',
  secondaryCta: "Let's Connect",
};

export const ABOUT_HEADING = 'Beyond One Discipline.';

export const ABOUT_DESCRIPTION =
  "I'm Rayhan Chowdhury, exploring the intersection of technology, security, intelligent systems, data, and digital creativity. I enjoy learning, experimenting, and transforming ideas into practical digital experiences.";

export const INITIAL_ABOUT_BLOCKS: AboutBlock[] = [
  {
    id: 'personal-intro',
    label: '01 · Personal Introduction',
    title: 'Curiosity Across Technical & Visual Worlds',
    content:
      'I approach technology as an interconnected craft—combining analytical problem-solving in software, data, and security with clean visual storytelling and digital media.',
  },
  {
    id: 'education-training',
    label: '02 · Education & Training',
    title: 'Foundations & Structured Skill Building',
    content:
      'Focused on computer technology fundamentals, Computer Operation Level 3 competencies, programming principles, and hands-on self-directed study across modern software and security labs. Use Customize Profile to add specific institutions or training.',
  },
  {
    id: 'learning-goals',
    label: '03 · Current Learning Goals',
    title: 'Deepening Practical Engineering & Security',
    content:
      'Currently advancing hands-on practice in web and API penetration testing methodologies, applied AI workflows, data analysis pipelines, and scalable MERN stack application architecture.',
  },
  {
    id: 'technical-interests',
    label: '04 · Technical Interests',
    title: 'Where Security, Intelligence & Design Meet',
    content:
      'Application security, red-team reconnaissance concepts, intelligent automation, interactive data visualization, full-stack web engineering, and motion graphics.',
  },
  {
    id: 'professional-background',
    label: '05 · Professional Background',
    title: 'Independent Exploration & Project Craft',
    content:
      'Building personal prototypes, technical lab environments, and creative digital media workflows. Open to internships, collaborative engineering initiatives, and multidisciplinary technology opportunities.',
  },
];

export const INITIAL_EXPERTISE_DOMAINS: ExpertiseDomain[] = [
  {
    id: 'cybersecurity',
    index: '01',
    title: 'Cybersecurity',
    subtitle: 'Offensive Concepts & Defensive Thinking',
    description:
      'Studying system vulnerabilities, attack surfaces, and structured assessment methodologies across modern web, network, cloud, and API environments.',
    iconName: 'shield',
    skills: [
      { id: 'cs-1', name: 'Cybersecurity Fundamentals', stage: SkillStage.Practicing },
      { id: 'cs-2', name: 'Red Teaming', stage: SkillStage.Learning },
      { id: 'cs-3', name: 'Web Penetration Testing', stage: SkillStage.Practicing },
      { id: 'cs-4', name: 'Mobile Penetration Testing', stage: SkillStage.Learning },
      { id: 'cs-5', name: 'Cloud Penetration Testing', stage: SkillStage.Learning },
      { id: 'cs-6', name: 'API Penetration Testing', stage: SkillStage.Practicing },
      { id: 'cs-7', name: 'Network Penetration Testing', stage: SkillStage.Practicing },
    ],
  },
  {
    id: 'ai-data',
    index: '02',
    title: 'AI & Data',
    subtitle: 'Intelligent Systems & Analytical Insight',
    description:
      'Exploring machine learning pipelines, structured data analytics, visual storytelling with data, and practical AI-assisted workflow automation.',
    iconName: 'brain',
    skills: [
      { id: 'ai-1', name: 'AI Engineering', stage: SkillStage.Practicing },
      { id: 'ai-2', name: 'Artificial Intelligence', stage: SkillStage.Practicing },
      { id: 'ai-3', name: 'Data Science', stage: SkillStage.Practicing },
      { id: 'ai-4', name: 'Data Analytics', stage: SkillStage.Practicing },
      { id: 'ai-5', name: 'Machine Learning', stage: SkillStage.Learning },
      { id: 'ai-6', name: 'Data Visualization', stage: SkillStage.Proficient },
      { id: 'ai-7', name: 'AI Automation', stage: SkillStage.Practicing },
    ],
  },
  {
    id: 'software-web',
    index: '03',
    title: 'Software & Web Development',
    subtitle: 'Full-Stack Architecture & Modern Interfaces',
    description:
      'Designing and engineering responsive web applications using the MERN ecosystem grounded in core computer science principles.',
    iconName: 'code',
    skills: [
      { id: 'sw-1', name: 'Software Engineering', stage: SkillStage.Practicing },
      { id: 'sw-2', name: 'MERN Stack Development', stage: SkillStage.Proficient },
      { id: 'sw-3', name: 'MongoDB', stage: SkillStage.Practicing },
      { id: 'sw-4', name: 'Express.js', stage: SkillStage.Practicing },
      { id: 'sw-5', name: 'React', stage: SkillStage.Proficient },
      { id: 'sw-6', name: 'Node.js', stage: SkillStage.Practicing },
      { id: 'sw-7', name: 'Computer Science Fundamentals', stage: SkillStage.Proficient },
    ],
  },
  {
    id: 'computer-tech',
    index: '04',
    title: 'Computer Technology',
    subtitle: 'Systems, Networks & Core Computing',
    description:
      'Hands-on grounding in computer hardware, operating systems, networking protocols, relational databases, and algorithmic logic.',
    iconName: 'cpu',
    skills: [
      { id: 'ct-1', name: 'Computer Operation Level 3', stage: SkillStage.Proficient },
      { id: 'ct-2', name: 'Computer Hardware and Software', stage: SkillStage.Proficient },
      { id: 'ct-3', name: 'Operating Systems', stage: SkillStage.Practicing },
      { id: 'ct-4', name: 'Networking Fundamentals', stage: SkillStage.Practicing },
      { id: 'ct-5', name: 'Databases', stage: SkillStage.Practicing },
      { id: 'ct-6', name: 'Algorithms and Data Structures', stage: SkillStage.Practicing },
      { id: 'ct-7', name: 'Programming Fundamentals', stage: SkillStage.Proficient },
    ],
  },
  {
    id: 'creative-media',
    index: '05',
    title: 'Creative Media',
    subtitle: 'Motion, Design & Visual Direction',
    description:
      'Crafting compelling digital visuals, motion graphics, and edited video narratives that communicate complex ideas with clarity.',
    iconName: 'film',
    skills: [
      { id: 'cm-1', name: 'Video Editing', stage: SkillStage.Proficient },
      { id: 'cm-2', name: 'Graphic Design', stage: SkillStage.Practicing },
      { id: 'cm-3', name: 'Motion Graphics', stage: SkillStage.Practicing },
      { id: 'cm-4', name: 'Digital Content Creation', stage: SkillStage.Proficient },
      { id: 'cm-5', name: 'Visual Storytelling', stage: SkillStage.Proficient },
    ],
  },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-cyber-lab',
    title: 'Web & API Security Lab Sandbox',
    category: 'Cybersecurity',
    summary:
      'Configurable project slot for documenting personal OWASP web/API security lab exercises, HTTP inspection notes, and defensive remediation write-ups.',
    caseStudyOverview:
      'This entry is a configurable template slot for your personal cybersecurity lab documentation. Replace this overview with your controlled lab setup, vulnerability analysis methodology, and defensive findings.',
    caseStudyObjectives: [
      'Document structured HTTP & REST API security testing workflows in isolated local lab environments',
      'Compare vulnerable endpoint patterns with hardened authentication and input-validation controls',
      'Maintain ethical, reproducible technical write-ups without exposing sensitive third-party systems',
    ],
    technologies: ['HTTP Analysis', 'REST APIs', 'OWASP Top 10', 'Linux Lab'],
    liveUrl: '',
    githubUrl: '',
    caseStudyUrl: '',
    visualMotif: 'lattice',
    isConfigurableExample: true,
  },
  {
    id: 'proj-ai-workflow',
    title: 'Exploratory Data & AI Automation Notebook',
    category: 'AI & Data',
    summary:
      'Configurable project slot for presenting dataset cleaning workflows, interactive visual dashboards, and practical AI automation experiments.',
    caseStudyOverview:
      'Use this configurable project card to highlight an ongoing data analytics notebook, visualization study, or AI-assisted automation workflow.',
    caseStudyObjectives: [
      'Transform raw structured datasets into clear visual narratives and summary metrics',
      'Evaluate feature relationships and model behavior transparently',
      'Automate repetitive document or data-processing steps using modular pipelines',
    ],
    technologies: ['Python', 'Data Visualization', 'Analytics', 'AI Workflows'],
    liveUrl: '',
    githubUrl: '',
    caseStudyUrl: '',
    visualMotif: 'neural',
    isConfigurableExample: true,
  },
  {
    id: 'proj-mern-app',
    title: 'Modular MERN Stack Application Blueprint',
    category: 'Web Development',
    summary:
      'Configurable project slot for a full-stack React, Node.js, Express, and MongoDB web application with clean REST routing and responsive UI.',
    caseStudyOverview:
      'Replace this configurable blueprint with your own full-stack web application—detailing schema design in MongoDB, Express middleware structure, and React state management.',
    caseStudyObjectives: [
      'Architect clean separation between Express API controllers and React client views',
      'Implement responsive, accessible user interfaces with modern CSS and TypeScript',
      'Design structured data models and validation layers',
    ],
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'TypeScript'],
    liveUrl: '',
    githubUrl: '',
    caseStudyUrl: '',
    visualMotif: 'interface',
    isConfigurableExample: true,
  },
  {
    id: 'proj-systems-tool',
    title: 'Core Algorithms & System Utility Collection',
    category: 'Software',
    summary:
      'Configurable project slot for CLI utilities, data-structure implementations, networking scripts, and foundational software engineering exercises.',
    caseStudyOverview:
      'A structured placeholder ready for your personal software repositories, algorithm benchmarks, or operating-system automation scripts.',
    caseStudyObjectives: [
      'Implement classic data structures and search/sort algorithms from first principles',
      'Build lightweight command-line tools for local file and network diagnostics',
      'Write readable, well-documented, maintainable code',
    ],
    technologies: ['Algorithms', 'Data Structures', 'Networking', 'CLI Utilities'],
    liveUrl: '',
    githubUrl: '',
    caseStudyUrl: '',
    visualMotif: 'architecture',
    isConfigurableExample: true,
  },
  {
    id: 'proj-creative-reel',
    title: 'Motion Graphics & Visual Storytelling Reel',
    category: 'Creative Media',
    summary:
      'Configurable project slot for edited video sequences, kinetic typography studies, graphic compositions, and digital content direction.',
    caseStudyOverview:
      'Customize this card with links to your video editing showreel, motion design breakdowns, color-grading studies, and visual storytelling pieces.',
    caseStudyObjectives: [
      'Combine pacing, sound design, and clean motion curves to hold viewer attention',
      'Develop cohesive visual identities across thumbnails, layouts, and video frames',
      'Translate technical topics into engaging visual narratives',
    ],
    technologies: ['Video Editing', 'Motion Graphics', 'Graphic Design', 'Storytelling'],
    liveUrl: '',
    githubUrl: '',
    caseStudyUrl: '',
    visualMotif: 'prism',
    isConfigurableExample: true,
  },
];

export const INITIAL_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: 'soc-github',
    platform: 'GitHub',
    handle: 'Add GitHub profile URL',
    url: '',
  },
  {
    id: 'soc-linkedin',
    platform: 'LinkedIn',
    handle: 'Add LinkedIn profile URL',
    url: '',
  },
  {
    id: 'soc-email',
    platform: 'Email',
    handle: 'Add direct email address',
    url: '',
  },
  {
    id: 'soc-youtube',
    platform: 'Creative Media',
    handle: 'Add portfolio or channel URL',
    url: '',
  },
];
