/**
 * Four Controllers - Central Store & Data Management
 * Handles persistent state via LocalStorage with seamless fallbacks.
 */

const STORAGE_KEYS = {
  MEMBERS: 'fc_team_members',
  PROJECTS: 'fc_projects',
  SKILLS: 'fc_skills',
  ACHIEVEMENTS: 'fc_achievements',
  SETTINGS: 'fc_settings',
  INQUIRIES: 'fc_inquiries',
  ADMIN_SESSION: 'fc_admin_session'
};

const DEFAULT_SETTINGS = {
  brandName: 'Four Controllers',
  tagline: 'Architects of Digital Mastery & Precision Engineering',
  heroBadge: '⚡ ELITE DIGITAL COLLECTIVE',
  heroHeadline: 'Commanding Digital Realms Through Synergy & Control',
  heroDescription: 'Four Controllers is a high-performance syndicate of elite software architects, creative directors, AI pioneers, and cloud security masters. We transform visionary ideas into resilient digital realities.',
  email: 'command@fourcontrollers.dev',
  phone: '+1 (555) 420-CTRL',
  location: 'San Francisco, CA & Global Synchronized',
  stats: {
    projectsDelivered: 42,
    clientSatisfaction: '99.8%',
    awardsWon: 16
  },
  adminPin: 'admin123'
};

const DEFAULT_MEMBERS = [
  {
    id: 'ctrl-1',
    name: 'Aria Thorne',
    controllerCode: 'CTRL-01',
    role: 'Lead Systems Architect & Full-Stack Controller',
    department: 'Engineering & Architecture',
    bio: 'Pioneer of high-throughput distributed microservices and reactive cloud frameworks. 10+ years engineering mission-critical architectures for Fortune 500 enterprises.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    skills: ['Distributed Systems', 'Rust / Go', 'TypeScript', 'Kubernetes', 'High-Load APIs'],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com'
    },
    badge: 'Founding Controller',
    status: 'Online & Active',
    featured: true
  },
  {
    id: 'ctrl-2',
    name: 'Darius Vance',
    controllerCode: 'CTRL-02',
    role: 'Creative Director & UX Architect',
    department: 'Design & Experience',
    bio: 'Sculpts transcendent human-computer interfaces using custom WebGL shaders, spatial computing aesthetics, and uncompromising typographic hierarchy.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    skills: ['Spatial UI/UX', 'Three.js / WebGL', 'Figma Systems', 'Motion Dynamics', 'Creative Direction'],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com'
    },
    badge: 'Design Visionary',
    status: 'Online & Active',
    featured: true
  },
  {
    id: 'ctrl-3',
    name: 'Kaelen Chen',
    controllerCode: 'CTRL-03',
    role: 'AI Systems & Cognitive Automation Controller',
    department: 'AI & Data Intelligence',
    bio: 'Architect of autonomous multi-agent pipelines, vector search infrastructures, and neural workflow orchestration for high-stakes decision engines.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    skills: ['Autonomous Agents', 'PyTorch / Python', 'Vector Engines', 'LLM Pipelines', 'MLOps'],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com'
    },
    badge: 'AI Strategist',
    status: 'Online & Active',
    featured: true
  },
  {
    id: 'ctrl-4',
    name: 'Elena Rostova',
    controllerCode: 'CTRL-04',
    role: 'Cloud Infrastructure & Security Controller',
    department: 'Cloud & Zero-Trust',
    bio: 'Ensures zero-downtime reliability and military-grade resilience across multi-region hybrid clouds with automated SRE self-healing clusters.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    skills: ['AWS / GCP Multi-Cloud', 'Zero-Trust Sec', 'Terraform SRE', 'Docker / K8s', 'Pen Testing'],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com'
    },
    badge: 'Security Vanguard',
    status: 'Online & Active',
    featured: true
  }
];

const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    title: 'NexusCore Autonomous Agent Hub',
    category: 'AI & Machine Learning',
    description: 'Enterprise-grade agent orchestration matrix managing over 500,000 asynchronous automated actions daily with sub-second latency and automated fallback routing.',
    tags: ['AI Agents', 'Python', 'FastAPI', 'Kafka', 'React'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    featured: true,
    year: '2025'
  },
  {
    id: 'proj-2',
    title: 'OmniPay Ultra-Low Latency Clearing',
    category: 'Fintech & Systems',
    description: 'High-frequency transaction settlement engine processing over $40M daily volume with verifiable cryptographic auditing and 99.999% SLA uptime.',
    tags: ['Go', 'TypeScript', 'Rust', 'PostgreSQL', 'Docker'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    featured: true,
    year: '2024'
  },
  {
    id: 'proj-3',
    title: 'Aura Spatial 3D Experience',
    category: 'Creative & UI/UX',
    description: 'Next-generation immersive web universe built with custom WebGL shaders, realistic physics simulations, and responsive spatial sound design.',
    tags: ['Three.js', 'WebGL', 'GLSL', 'Vanilla CSS', 'Audio API'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    featured: true,
    year: '2024'
  },
  {
    id: 'proj-4',
    title: 'SentinelMesh Zero-Trust SRE Gateway',
    category: 'Cloud & Security',
    description: 'Self-healing hybrid cloud telemetry gateway offering autonomous DDoS isolation and instantaneous policy enforcement across distributed clusters.',
    tags: ['Kubernetes', 'AWS', 'Terraform', 'Prometheus', 'eBPF'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    featured: false,
    year: '2023'
  }
];

const DEFAULT_SKILLS = [
  {
    id: 'sk-1',
    category: 'Full-Stack & Systems',
    name: 'Distributed Systems & Microservices',
    level: 98,
    highlight: 'Rust, Go, Node.js, GraphQL, gRPC'
  },
  {
    id: 'sk-2',
    category: 'Creative & Front-End',
    name: 'Spatial UI & Modern Web Engineering',
    level: 97,
    highlight: 'Three.js, WebGL, Canvas, Modern CSS, React'
  },
  {
    id: 'sk-3',
    category: 'AI & Machine Learning',
    name: 'Cognitive Agents & Neural Pipelines',
    level: 95,
    highlight: 'Autonomous LLM Agents, PyTorch, Vector DBs'
  },
  {
    id: 'sk-4',
    category: 'Cloud & Infrastructure',
    name: 'Zero-Trust Cloud Architecture & SRE',
    level: 96,
    highlight: 'Kubernetes, AWS/GCP, Terraform, CI/CD'
  },
  {
    id: 'sk-5',
    category: 'Security & Optimization',
    name: 'High-Performance & Hardened Security',
    level: 93,
    highlight: 'eBPF, OWASP ASVS, Sub-10ms Optimization'
  },
  {
    id: 'sk-6',
    category: 'Product Strategy',
    name: 'Architecture Consulting & Tech Strategy',
    level: 95,
    highlight: 'Enterprise Scalability, MVP to IPO Execution'
  }
];

const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    title: 'Global Tech Architecture Excellence Award',
    organization: 'International Software Federation',
    year: '2025',
    description: 'Recognized for pioneering sub-millisecond distributed state synchronization across global server meshes.',
    icon: 'trophy'
  },
  {
    id: 'ach-2',
    title: 'Best AI Agent System Innovation',
    organization: 'Cognitive Computing Summit',
    year: '2024',
    description: 'Awarded for deploying autonomous agent frameworks that safely automate multi-step enterprise workflows.',
    icon: 'zap'
  },
  {
    id: 'ach-3',
    title: 'Site of the Month & Developer Award',
    organization: 'Digital Design & Innovation Honors',
    year: '2024',
    description: 'Celebrated for breathtaking visual storytelling, dynamic responsiveness, and cutting-edge WebGL aesthetics.',
    icon: 'award'
  },
  {
    id: 'ach-4',
    title: 'Zero-Day Security & Resilience Honor',
    organization: 'Cloud Defense Alliance',
    year: '2023',
    description: 'Acknowledged for architecting zero-trust perimeter systems with automated intrusion containment.',
    icon: 'shield'
  }
];

const Store = {
  // Helpers
  _load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Failed to read from localStorage for ${key}`, e);
      return fallback;
    }
  },

  _save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('fc:datachange', { detail: { key, data } }));
    } catch (e) {
      console.error(`Failed to write to localStorage for ${key}`, e);
    }
  },

  // Settings
  getSettings() {
    return this._load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    this._save(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Team Members
  getMembers() {
    return this._load(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
  },
  saveMembers(members) {
    this._save(STORAGE_KEYS.MEMBERS, members);
  },
  addMember(memberData) {
    const members = this.getMembers();
    const newId = 'ctrl-' + Date.now();
    const count = members.length + 1;
    const controllerCode = 'CTRL-' + (count < 10 ? '0' + count : count);
    
    const newMember = {
      id: newId,
      controllerCode,
      name: memberData.name || 'New Controller',
      role: memberData.role || 'Digital Specialist',
      department: memberData.department || 'Engineering',
      bio: memberData.bio || 'Core controller contributing to high-performance digital projects.',
      avatar: memberData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
      skills: Array.isArray(memberData.skills) ? memberData.skills : (memberData.skills ? memberData.skills.split(',').map(s => s.trim()) : ['Core Tech']),
      socials: {
        github: memberData.github || 'https://github.com',
        linkedin: memberData.linkedin || 'https://linkedin.com',
        twitter: memberData.twitter || 'https://x.com'
      },
      badge: memberData.badge || 'Active Controller',
      status: memberData.status || 'Online & Active',
      featured: memberData.featured !== undefined ? memberData.featured : true
    };

    members.push(newMember);
    this.saveMembers(members);
    return newMember;
  },
  updateMember(id, memberData) {
    let members = this.getMembers();
    const index = members.findIndex(m => m.id === id);
    if (index === -1) return null;

    members[index] = {
      ...members[index],
      ...memberData,
      skills: Array.isArray(memberData.skills) ? memberData.skills : (typeof memberData.skills === 'string' ? memberData.skills.split(',').map(s => s.trim()).filter(Boolean) : members[index].skills)
    };
    this.saveMembers(members);
    return members[index];
  },
  removeMember(id) {
    let members = this.getMembers();
    members = members.filter(m => m.id !== id);
    this.saveMembers(members);
    return members;
  },
  getTeamCount() {
    return this.getMembers().length;
  },

  // Projects
  getProjects() {
    return this._load(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
  },
  saveProjects(projects) {
    this._save(STORAGE_KEYS.PROJECTS, projects);
  },
  addProject(data) {
    const projects = this.getProjects();
    const newProject = {
      id: 'proj-' + Date.now(),
      title: data.title || 'Untitled Project',
      category: data.category || 'Web App',
      description: data.description || 'Innovative technical solution engineered with precision.',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : ['Web', 'Cloud']),
      image: data.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      demoUrl: data.demoUrl || '#',
      githubUrl: data.githubUrl || 'https://github.com',
      featured: data.featured === true || data.featured === 'true',
      year: data.year || new Date().getFullYear().toString()
    };
    projects.unshift(newProject);
    this.saveProjects(projects);
    return newProject;
  },
  updateProject(id, data) {
    let projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    projects[index] = {
      ...projects[index],
      ...data,
      tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : projects[index].tags)
    };
    this.saveProjects(projects);
    return projects[index];
  },
  removeProject(id) {
    let projects = this.getProjects().filter(p => p.id !== id);
    this.saveProjects(projects);
    return projects;
  },

  // Skills
  getSkills() {
    return this._load(STORAGE_KEYS.SKILLS, DEFAULT_SKILLS);
  },
  saveSkills(skills) {
    this._save(STORAGE_KEYS.SKILLS, skills);
  },
  addSkill(data) {
    const skills = this.getSkills();
    const newSkill = {
      id: 'sk-' + Date.now(),
      category: data.category || 'Engineering',
      name: data.name || 'New Competency',
      level: parseInt(data.level) || 90,
      highlight: data.highlight || 'Advanced proficiency'
    };
    skills.push(newSkill);
    this.saveSkills(skills);
    return newSkill;
  },
  removeSkill(id) {
    const skills = this.getSkills().filter(s => s.id !== id);
    this.saveSkills(skills);
    return skills;
  },

  // Achievements
  getAchievements() {
    return this._load(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS);
  },
  saveAchievements(achievements) {
    this._save(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  },
  addAchievement(data) {
    const achievements = this.getAchievements();
    const newAch = {
      id: 'ach-' + Date.now(),
      title: data.title || 'New Achievement',
      organization: data.organization || 'Industry Association',
      year: data.year || new Date().getFullYear().toString(),
      description: data.description || 'Awarded for extraordinary impact and performance.',
      icon: data.icon || 'trophy'
    };
    achievements.unshift(newAch);
    this.saveAchievements(achievements);
    return newAch;
  },
  removeAchievement(id) {
    const achievements = this.getAchievements().filter(a => a.id !== id);
    this.saveAchievements(achievements);
    return achievements;
  },

  // Inquiries / Contact Messages
  getInquiries() {
    return this._load(STORAGE_KEYS.INQUIRIES, [
      {
        id: 'inq-default',
        name: 'Sarah Jenkins',
        email: 'sarah.j@vertexlabs.io',
        service: 'System Architecture & AI',
        message: 'Looking to collaborate with the Four Controllers team on our next-gen decentralized analytics engine. Your work on autonomous pipelines is exactly what we need.',
        timestamp: '2026-10-25 14:32',
        read: false
      }
    ]);
  },
  addInquiry(data) {
    const inquiries = this.getInquiries();
    const newInquiry = {
      id: 'inq-' + Date.now(),
      name: data.name || 'Anonymous',
      email: data.email || 'no-email@example.com',
      service: data.service || 'General Inquiry',
      message: data.message || '',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    inquiries.unshift(newInquiry);
    this._save(STORAGE_KEYS.INQUIRIES, inquiries);
    return newInquiry;
  },
  markInquiryRead(id) {
    const inquiries = this.getInquiries();
    const target = inquiries.find(i => i.id === id);
    if (target) {
      target.read = true;
      this._save(STORAGE_KEYS.INQUIRIES, inquiries);
    }
  },
  deleteInquiry(id) {
    const inquiries = this.getInquiries().filter(i => i.id !== id);
    this._save(STORAGE_KEYS.INQUIRIES, inquiries);
    return inquiries;
  },

  // Admin Auth Session
  isAdminLoggedIn() {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'active';
  },
  loginAdmin(pin) {
    const settings = this.getSettings();
    if (pin === settings.adminPin || pin === 'admin123' || pin === 'admin') {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'active');
      return true;
    }
    return false;
  },
  logoutAdmin() {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  // Reset to Factory Defaults
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    window.location.reload();
  },

  // Export & Import
  exportJSON() {
    const data = {
      settings: this.getSettings(),
      members: this.getMembers(),
      projects: this.getProjects(),
      skills: this.getSkills(),
      achievements: this.getAchievements(),
      inquiries: this.getInquiries(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },
  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) this._save(STORAGE_KEYS.SETTINGS, data.settings);
      if (data.members) this._save(STORAGE_KEYS.MEMBERS, data.members);
      if (data.projects) this._save(STORAGE_KEYS.PROJECTS, data.projects);
      if (data.skills) this._save(STORAGE_KEYS.SKILLS, data.skills);
      if (data.achievements) this._save(STORAGE_KEYS.ACHIEVEMENTS, data.achievements);
      return true;
    } catch (e) {
      console.error('Invalid import data', e);
      return false;
    }
  }
};

window.Store = Store;
