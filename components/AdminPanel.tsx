'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  KeyRound,
  Sparkles,
  User,
  Layers,
  Briefcase,
  Share2,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react';
import GlassSurface from '@/components/GlassSurface';
import { useLocalStorageState } from '@/hooks/use-local-storage';
import {
  HERO_CONTENT as DEFAULT_HERO_CONTENT,
  ABOUT_DESCRIPTION,
  INITIAL_ABOUT_BLOCKS,
  INITIAL_EXPERTISE_DOMAINS,
  INITIAL_PROJECTS,
  INITIAL_SOCIAL_LINKS,
  SKILL_STAGES,
  SkillStage,
  ProjectCategory,
  PROJECT_CATEGORIES,
  ProjectItem,
  AboutBlock,
  ExpertiseDomain,
  SocialLinkItem,
  STORAGE_KEY_HERO,
  STORAGE_KEY_ABOUT_DESC,
  STORAGE_KEY_ABOUT_BLOCKS,
  STORAGE_KEY_EXPERTISE,
  STORAGE_KEY_PROJECTS,
  STORAGE_KEY_SOCIALS,
  STORAGE_KEY_AUTH,
  STORAGE_KEY_SESSION,
} from '@/data/portfolio-data';
import {
  sha256,
  sanitizeInput,
  sanitizeUrl,
  DEFAULT_PASSWORD_HASH,
} from '@/lib/security';

interface AdminAuth {
  username: string;
  passHash: string;
  // Legacy backward-compat field
  pass?: string;
}

const DEFAULT_AUTH: AdminAuth = {
  username: 'rahu0xf@gmail.com',
  passHash: DEFAULT_PASSWORD_HASH,
  pass: 'rago@123',
};

type AdminTab =
  | 'hero'
  | 'about'
  | 'expertise'
  | 'projects'
  | 'socials'
  | 'security';

export default function AdminPanel() {
  // Auth & Session
  const [authCreds, setAuthCreds] = useLocalStorageState<AdminAuth>(
    STORAGE_KEY_AUTH,
    DEFAULT_AUTH
  );
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState<boolean>(
    STORAGE_KEY_SESSION,
    false
  );

  // Login form state (Clean single username & password)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('hero');
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Editable Portfolio States
  const [hero, setHero, resetHero] = useLocalStorageState(
    STORAGE_KEY_HERO,
    DEFAULT_HERO_CONTENT
  );
  const [aboutDesc, setAboutDesc, resetAboutDesc] = useLocalStorageState<string>(
    STORAGE_KEY_ABOUT_DESC,
    ABOUT_DESCRIPTION
  );
  const [aboutBlocks, setAboutBlocks, resetAboutBlocks] = useLocalStorageState<AboutBlock[]>(
    STORAGE_KEY_ABOUT_BLOCKS,
    INITIAL_ABOUT_BLOCKS
  );
  const [domains, setDomains, resetDomains] = useLocalStorageState<ExpertiseDomain[]>(
    STORAGE_KEY_EXPERTISE,
    INITIAL_EXPERTISE_DOMAINS
  );
  const [projects, setProjects, resetProjects] = useLocalStorageState<ProjectItem[]>(
    STORAGE_KEY_PROJECTS,
    INITIAL_PROJECTS
  );
  const [socials, setSocials, resetSocials] = useLocalStorageState<SocialLinkItem[]>(
    STORAGE_KEY_SOCIALS,
    INITIAL_SOCIAL_LINKS
  );

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Project Editor state (within admin)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const notifySave = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => {
      setSaveBanner(null);
    }, 3200);
  };

  // OWASP A07: Identification and Authentication Failures - Brute-Force Rate Limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Check brute-force lockout
    const now = Date.now();
    if (lockoutUntil && now < lockoutUntil) {
      const waitSeconds = Math.ceil((lockoutUntil - now) / 1000);
      setLoginError(
        `Too many failed attempts. Temporary security lockout active. Try again in ${waitSeconds}s.`
      );
      return;
    }

    // Normalize username comparison
    const storedUsername = (
      authCreds.username ||
      (authCreds as unknown as { email?: string }).email ||
      DEFAULT_AUTH.username
    )
      .trim()
      .toLowerCase();

    const inputUser = sanitizeInput(loginUsername, 100).toLowerCase();
    const isUsernameMatch =
      inputUser === storedUsername ||
      inputUser === 'rahu0xf@gmail.com' ||
      inputUser === 'rahu0xf';

    // Cryptographic hash validation (OWASP A02: Cryptographic Failures)
    const inputHash = await sha256(loginPass);
    const targetHash = authCreds.passHash || DEFAULT_AUTH.passHash;

    // Check either SHA-256 hash match or legacy raw match if migrating
    const isPasswordMatch =
      inputHash === targetHash ||
      (authCreds.pass && loginPass === authCreds.pass);

    if (isUsernameMatch && isPasswordMatch) {
      setIsAuthenticated(true);
      setFailedAttempts(0);
      setLockoutUntil(null);
      setLoginUsername('');
      setLoginPass('');

      // Auto-upgrade legacy plain password to SHA-256 hash
      if (!authCreds.passHash) {
        setAuthCreds({
          username: storedUsername,
          passHash: inputHash,
        });
      }
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      if (nextFailed >= 5) {
        // 5 consecutive failed attempts locks out for 60 seconds
        const lockDuration = 60 * 1000;
        setLockoutUntil(now + lockDuration);
        setLoginError(
          'Security Alert: 5 failed login attempts detected. Portal locked for 60 seconds.'
        );
      } else {
        setLoginError(
          `Invalid Username or Password. (${5 - nextFailed} attempts remaining before lockout)`
        );
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    const targetHash = authCreds.passHash || DEFAULT_AUTH.passHash;
    const oldHash = await sha256(oldPassword);

    // Verify current password via cryptographic hash
    const isOldMatch =
      oldHash === targetHash ||
      (authCreds.pass && oldPassword === authCreds.pass);

    if (!isOldMatch) {
      setPassError('Current password does not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPassError('New password must be at least 8 characters for OWASP compliance.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    const newHash = await sha256(newPassword);
    setAuthCreds({
      username:
        authCreds.username ||
        (authCreds as unknown as { email?: string }).email ||
        DEFAULT_AUTH.username,
      passHash: newHash,
    });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPassSuccess(
      'Password cryptographically updated (SHA-256)! Your new password is now active.'
    );
  };

  // Helper functions for Projects management
  const handleAddNewProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Project Exploration',
      category: 'Cybersecurity',
      summary: 'Summary of the new project or research findings.',
      caseStudyOverview: 'Detailed overview of methodology and results.',
      caseStudyObjectives: [
        'Objective 1: Research and architecture',
        'Objective 2: Practical implementation',
      ],
      technologies: ['Security', 'Next.js', 'Python'],
      liveUrl: '',
      githubUrl: '',
      caseStudyUrl: '',
      visualMotif: 'lattice',
    };
    setProjects([newProj, ...projects]);
    setEditingProjectId(newProj.id);
    notifySave('New project slot created.');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    if (editingProjectId === id) setEditingProjectId(null);
    notifySave('Project removed.');
  };

  const handleUpdateProjectField = (
    id: string,
    field: keyof ProjectItem,
    value: unknown
  ) => {
    let sanitizedValue = value;
    if (typeof value === 'string') {
      if (
        field === 'liveUrl' ||
        field === 'githubUrl' ||
        field === 'caseStudyUrl' ||
        field === 'customImageUrl'
      ) {
        sanitizedValue = sanitizeUrl(value);
      } else {
        sanitizedValue = sanitizeInput(value, 2000);
      }
    }
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, [field]: sanitizedValue } : p))
    );
  };

  // Helper functions for Skills management
  const handleAddSkillToDomain = (domainId: string) => {
    const rawSkillName = prompt('Enter new skill name:');
    if (!rawSkillName || !rawSkillName.trim()) return;
    const skillName = sanitizeInput(rawSkillName, 60);

    setDomains(
      domains.map((dom) => {
        if (dom.id !== domainId) return dom;
        const newSkill = {
          id: `sk-${Date.now()}`,
          name: skillName,
          stage: SkillStage.Learning,
        };
        return {
          ...dom,
          skills: [...dom.skills, newSkill],
        };
      })
    );
    notifySave(`Added "${skillName}" skill.`);
  };

  const handleRemoveSkill = (domainId: string, skillId: string) => {
    setDomains(
      domains.map((dom) => {
        if (dom.id !== domainId) return dom;
        return {
          ...dom,
          skills: dom.skills.filter((s) => s.id !== skillId),
        };
      })
    );
    notifySave('Skill removed.');
  };

  const handleUpdateSkillStage = (
    domainId: string,
    skillId: string,
    stage: SkillStage
  ) => {
    setDomains(
      domains.map((dom) => {
        if (dom.id !== domainId) return dom;
        return {
          ...dom,
          skills: dom.skills.map((s) =>
            s.id === skillId ? { ...s, stage } : s
          ),
        };
      })
    );
  };

  // Helper functions for Social Links
  const handleUpdateSocial = (
    id: string,
    field: keyof SocialLinkItem,
    value: string
  ) => {
    const sanitized =
      field === 'url' ? sanitizeUrl(value) : sanitizeInput(value, 150);
    setSocials(
      socials.map((s) => (s.id === id ? { ...s, [field]: sanitized } : s))
    );
  };

  const handleAddSocial = () => {
    const platform = prompt('Enter platform name (e.g., Discord, X, Medium):');
    if (!platform || !platform.trim()) return;
    const newSocial: SocialLinkItem = {
      id: `soc-${Date.now()}`,
      platform: platform.trim(),
      handle: `@${platform.trim().toLowerCase()}`,
      url: 'https://',
      category: 'Online Channel',
      badge: 'Social',
    };
    setSocials([...socials, newSocial]);
    notifySave(`Added ${platform} profile.`);
  };

  const handleRemoveSocial = (id: string) => {
    setSocials(socials.filter((s) => s.id !== id));
    notifySave('Social channel removed.');
  };

  // ==========================================
  // VIEW 1: LOGIN SCREEN (if not authenticated)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#100305] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle Ambient Background Orbs */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rose-700/20 blur-3xl pointer-events-none"
        />

        <div className="w-full max-w-md relative z-10">
          <div className="mb-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-white/70 hover:text-white transition-colors mb-4 rounded-full border border-white/15 px-3 py-1 bg-white/5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Portfolio</span>
            </Link>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/30 to-black/60 border border-white/20 shadow-xl mb-3">
              <Lock className="h-7 w-7 text-white" />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Admin Control Center
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-white/70">
              Restricted portal to edit portfolio content, projects, and credentials.
            </p>
          </div>

          <GlassSurface variant="readable" className="p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-400/30 bg-rose-950/70 p-3 text-xs text-rose-200 flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-300" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="login-username"
                  className="block text-xs font-semibold text-white/80 mb-1.5"
                >
                  Username
                </label>
                <input
                  id="login-username"
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder=""
                  autoComplete="username"
                  className="glass-input w-full min-h-[46px] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-white/80 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder=""
                    autoComplete="current-password"
                    className="glass-input w-full min-h-[46px] rounded-xl pl-4 pr-11 py-2.5 text-sm text-white placeholder:text-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="liquid-btn-primary w-full min-h-[46px] mt-2 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold"
              >
                <Unlock className="h-4 w-4" />
                <span>Sign In to Admin Panel</span>
              </button>

              <div className="pt-3 border-t border-white/10 text-center">
                <p className="text-[11px] font-mono text-white/50">
                  Secured Access · Session persists in your browser
                </p>
              </div>
            </form>
          </GlassSurface>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-[#100305] text-white relative">
      {/* Save Notification Toast */}
      {saveBanner && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl border border-emerald-400/40 bg-emerald-950/90 backdrop-blur-md px-4 py-2.5 shadow-2xl flex items-center gap-2.5 text-xs text-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-white/15 bg-black/60 backdrop-blur-xl px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-white/70 hover:text-white rounded-lg border border-white/15 px-3 py-1.5 bg-white/5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View Public Site</span>
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <h1 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
              Portfolio Control Center
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/15 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              activeTab === 'hero'
                ? 'bg-white text-black font-semibold shadow'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Hero &amp; Headlines</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              activeTab === 'about'
                ? 'bg-white text-black font-semibold shadow'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>About &amp; Bio Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('expertise')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              activeTab === 'expertise'
                ? 'bg-white text-black font-semibold shadow'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>5 Core Pillars &amp; Skills</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              activeTab === 'projects'
                ? 'bg-white text-black font-semibold shadow'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Projects &amp; Case Studies</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('socials')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              activeTab === 'socials'
                ? 'bg-white text-black font-semibold shadow'
                : 'text-white/75 hover:text-white hover:bg-white/10'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Socials &amp; Direct Mail</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              activeTab === 'security'
                ? 'bg-white text-black font-semibold shadow'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Admin Password</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: HERO SECTION CONFIGURATION */}
        {/* ============================================================ */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <GlassSurface variant="readable" className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Hero Section Headlines &amp; Copy
                  </h2>
                  <p className="mt-1 text-xs text-white/70">
                    Changes here immediately update the front-page title, animation, tagline, and CTA buttons.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetHero();
                    notifySave('Hero content reset to defaults.');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      Eyebrow Label
                    </label>
                    <input
                      type="text"
                      value={hero.eyebrow}
                      onChange={(e) =>
                        setHero({ ...hero, eyebrow: e.target.value })
                      }
                      className="glass-input w-full min-h-[44px] rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      Primary Name / Heading
                    </label>
                    <input
                      type="text"
                      value={hero.heading}
                      onChange={(e) =>
                        setHero({ ...hero, heading: e.target.value })
                      }
                      className="glass-input w-full min-h-[44px] rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">
                    Tagline (Displays under name with animated styling)
                  </label>
                  <input
                    type="text"
                    value={hero.tagline}
                    onChange={(e) =>
                      setHero({ ...hero, tagline: e.target.value })
                    }
                    className="glass-input w-full min-h-[44px] rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">
                    Supporting Introductory Bio Text
                  </label>
                  <textarea
                    rows={3}
                    value={hero.supportingText}
                    onChange={(e) =>
                      setHero({ ...hero, supportingText: e.target.value })
                    }
                    className="glass-input w-full rounded-xl px-4 py-2.5 text-sm text-white leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      Primary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={hero.primaryCta}
                      onChange={(e) =>
                        setHero({ ...hero, primaryCta: e.target.value })
                      }
                      className="glass-input w-full min-h-[44px] rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      Secondary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={hero.secondaryCta}
                      onChange={(e) =>
                        setHero({ ...hero, secondaryCta: e.target.value })
                      }
                      className="glass-input w-full min-h-[44px] rounded-xl px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => notifySave('Hero changes saved!')}
                    className="liquid-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Hero Headlines</span>
                  </button>
                </div>
              </div>
            </GlassSurface>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ABOUT SECTION & BIO CARDS */}
        {/* ============================================================ */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <GlassSurface variant="readable" className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Primary Bio Quote &amp; 5 Structured Blocks
                  </h2>
                  <p className="mt-1 text-xs text-white/70">
                    Edit your personal introduction quote, education credentials, learning goals, and experience narrative.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetAboutDesc();
                    resetAboutBlocks();
                    notifySave('About section reset to defaults.');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Featured Introduction Quote
                </label>
                <textarea
                  rows={3}
                  value={aboutDesc}
                  onChange={(e) => setAboutDesc(e.target.value)}
                  className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white leading-relaxed"
                />
              </div>

              <div className="border-t border-white/15 pt-6">
                <h3 className="font-display text-base font-bold text-white mb-4">
                  Profile Narrative Cards
                </h3>

                <div className="space-y-4">
                  {aboutBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="rounded-2xl border border-white/15 bg-white/[0.04] p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs text-white/60">
                          {block.label}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/75 mb-1">
                          Card Title
                        </label>
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) =>
                            setAboutBlocks(
                              aboutBlocks.map((b) =>
                                b.id === block.id
                                  ? { ...b, title: e.target.value }
                                  : b
                              )
                            )
                          }
                          className="glass-input w-full rounded-xl px-3.5 py-2 text-sm text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/75 mb-1">
                          Card Content
                        </label>
                        <textarea
                          rows={3}
                          value={block.content}
                          onChange={(e) =>
                            setAboutBlocks(
                              aboutBlocks.map((b) =>
                                b.id === block.id
                                  ? { ...b, content: e.target.value }
                                  : b
                              )
                            )
                          }
                          className="glass-input w-full rounded-xl px-3.5 py-2 text-sm text-white/90 leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => notifySave('About cards updated!')}
                    className="liquid-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save About Section</span>
                  </button>
                </div>
              </div>
            </GlassSurface>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: EXPERTISE DOMAINS & SKILL STAGES */}
        {/* ============================================================ */}
        {activeTab === 'expertise' && (
          <div className="space-y-6">
            <GlassSurface variant="readable" className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Five Core Pillars &amp; Skill Levels
                  </h2>
                  <p className="mt-1 text-xs text-white/70">
                    Add new skills, adjust proficiency levels (Learning, Practicing, Proficient, Professional), or update pillar descriptions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetDomains();
                    notifySave('Pillars and skills reset to defaults.');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              <div className="space-y-6">
                {domains.map((dom) => (
                  <div
                    key={dom.id}
                    className="rounded-2xl border border-white/15 bg-white/[0.04] p-5 sm:p-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-white/70 mb-1">
                          Pillar Title ({dom.index})
                        </label>
                        <input
                          type="text"
                          value={dom.title}
                          onChange={(e) =>
                            setDomains(
                              domains.map((d) =>
                                d.id === dom.id
                                  ? { ...d, title: e.target.value }
                                  : d
                              )
                            )
                          }
                          className="glass-input w-full rounded-xl px-3 py-1.5 text-sm font-bold text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-white/70 mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={dom.subtitle}
                          onChange={(e) =>
                            setDomains(
                              domains.map((d) =>
                                d.id === dom.id
                                  ? { ...d, subtitle: e.target.value }
                                  : d
                              )
                            )
                          }
                          className="glass-input w-full rounded-xl px-3 py-1.5 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Pillar Description
                      </label>
                      <textarea
                        rows={2}
                        value={dom.description}
                        onChange={(e) =>
                          setDomains(
                            domains.map((d) =>
                              d.id === dom.id
                                ? { ...d, description: e.target.value }
                                : d
                            )
                          )
                        }
                        className="glass-input w-full rounded-xl px-3 py-2 text-sm text-white/90"
                      />
                    </div>

                    {/* Skill List */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono text-white/80">
                          Skills in {dom.title} ({dom.skills.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddSkillToDomain(dom.id)}
                          className="inline-flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200 border border-emerald-400/30 rounded-lg px-2.5 py-1 bg-emerald-950/40"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Skill</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {dom.skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-black/40 px-3 py-2"
                          >
                            <span className="text-xs font-medium text-white truncate">
                              {skill.name}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <select
                                value={skill.stage}
                                onChange={(e) =>
                                  handleUpdateSkillStage(
                                    dom.id,
                                    skill.id,
                                    e.target.value as SkillStage
                                  )
                                }
                                className="bg-neutral-900 border border-white/20 rounded-lg text-[11px] text-white/90 px-1.5 py-1 font-mono"
                              >
                                {SKILL_STAGES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSkill(dom.id, skill.id)
                                }
                                aria-label={`Remove ${skill.name}`}
                                className="text-white/50 hover:text-rose-400 p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => notifySave('Skills and domains saved!')}
                    className="liquid-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Pillars &amp; Skills</span>
                  </button>
                </div>
              </div>
            </GlassSurface>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PROJECTS & CASE STUDIES */}
        {/* ============================================================ */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <GlassSurface variant="readable" className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/15 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Projects &amp; Case Study Showcase
                  </h2>
                  <p className="mt-1 text-xs text-white/70">
                    Manage project repositories, live URLs, case study write-ups, and screenshots.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleAddNewProject}
                    className="liquid-btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Project</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetProjects();
                      notifySave('Projects restored to defaults.');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {projects.map((proj) => {
                  const isEditing = editingProjectId === proj.id;
                  return (
                    <div
                      key={proj.id}
                      className="rounded-2xl border border-white/15 bg-white/[0.04] p-5 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-emerald-300">
                              {proj.category}
                            </span>
                            {proj.liveUrl && (
                              <span className="text-[10px] rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-white/70">
                                Live Active
                              </span>
                            )}
                          </div>
                          <h3 className="font-display mt-1 text-lg font-bold text-white">
                            {proj.title}
                          </h3>
                          <p className="mt-1 text-xs text-white/70 line-clamp-2">
                            {proj.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProjectId(isEditing ? null : proj.id)
                            }
                            className="inline-flex items-center gap-1 text-xs font-medium rounded-lg border border-white/20 px-3 py-1.5 text-white hover:bg-white/10"
                          >
                            <span>{isEditing ? 'Close' : 'Edit Details'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="inline-flex items-center justify-center rounded-lg border border-rose-400/30 text-rose-300 hover:bg-rose-950/60 p-1.5"
                            aria-label={`Delete ${proj.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Project Edit Form */}
                      {isEditing && (
                        <div className="mt-5 pt-4 border-t border-white/12 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-white/75 mb-1">
                                Project Title
                              </label>
                              <input
                                type="text"
                                value={proj.title}
                                onChange={(e) =>
                                  handleUpdateProjectField(
                                    proj.id,
                                    'title',
                                    e.target.value
                                  )
                                }
                                className="glass-input w-full rounded-xl px-3 py-2 text-sm text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-white/75 mb-1">
                                Category
                              </label>
                              <select
                                value={proj.category}
                                onChange={(e) =>
                                  handleUpdateProjectField(
                                    proj.id,
                                    'category',
                                    e.target.value as Exclude<
                                      ProjectCategory,
                                      'All Projects'
                                    >
                                  )
                                }
                                className="glass-input w-full rounded-xl px-3 py-2 text-sm text-white bg-neutral-900"
                              >
                                {PROJECT_CATEGORIES.filter(
                                  (c) => c !== 'All Projects'
                                ).map((cat) => (
                                  <option
                                    key={cat}
                                    value={cat}
                                    className="bg-neutral-900"
                                  >
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-white/75 mb-1">
                              Summary Description
                            </label>
                            <textarea
                              rows={2}
                              value={proj.summary}
                              onChange={(e) =>
                                handleUpdateProjectField(
                                  proj.id,
                                  'summary',
                                  e.target.value
                                )
                              }
                              className="glass-input w-full rounded-xl px-3 py-2 text-sm text-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-white/75 mb-1">
                                Live Project URL
                              </label>
                              <input
                                type="url"
                                value={proj.liveUrl || ''}
                                onChange={(e) =>
                                  handleUpdateProjectField(
                                    proj.id,
                                    'liveUrl',
                                    e.target.value
                                  )
                                }
                                placeholder="https://..."
                                className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-white/75 mb-1">
                                GitHub URL
                              </label>
                              <input
                                type="url"
                                value={proj.githubUrl || ''}
                                onChange={(e) =>
                                  handleUpdateProjectField(
                                    proj.id,
                                    'githubUrl',
                                    e.target.value
                                  )
                                }
                                placeholder="https://github.com/..."
                                className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-white/75 mb-1">
                                External Case Study URL
                              </label>
                              <input
                                type="url"
                                value={proj.caseStudyUrl || ''}
                                onChange={(e) =>
                                  handleUpdateProjectField(
                                    proj.id,
                                    'caseStudyUrl',
                                    e.target.value
                                  )
                                }
                                placeholder="https://..."
                                className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-white/75 mb-1">
                              Technologies (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={proj.technologies.join(', ')}
                              onChange={(e) =>
                                handleUpdateProjectField(
                                  proj.id,
                                  'technologies',
                                  e.target.value
                                    .split(',')
                                    .map((t) => t.trim())
                                    .filter(Boolean)
                                )
                              }
                              className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-white/75 mb-1">
                              Case Study Detailed Overview
                            </label>
                            <textarea
                              rows={3}
                              value={proj.caseStudyOverview || ''}
                              onChange={(e) =>
                                handleUpdateProjectField(
                                  proj.id,
                                  'caseStudyOverview',
                                  e.target.value
                                )
                              }
                              className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-white/75 mb-1">
                              Custom Image URL (Optional)
                            </label>
                            <input
                              type="url"
                              value={proj.customImageUrl || ''}
                              onChange={(e) =>
                                handleUpdateProjectField(
                                  proj.id,
                                  'customImageUrl',
                                  e.target.value
                                )
                              }
                              placeholder="Leave blank for built-in geometric SVG artwork"
                              className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => notifySave('Projects updated!')}
                  className="liquid-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Projects List</span>
                </button>
              </div>
            </GlassSurface>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: SOCIAL LINKS & CONTACT CHANNELS */}
        {/* ============================================================ */}
        {activeTab === 'socials' && (
          <div className="space-y-6">
            <GlassSurface variant="readable" className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/15 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Official Social Profiles &amp; Target Mailbox
                  </h2>
                  <p className="mt-1 text-xs text-white/70">
                    Controls the verified profiles displayed in the Contact section and Hero dock.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleAddSocial}
                    className="liquid-btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetSocials();
                      notifySave('Social links restored to defaults.');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {socials.map((soc) => (
                  <div
                    key={soc.id}
                    className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 sm:p-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-mono text-white/60 mb-1">
                          Platform
                        </label>
                        <input
                          type="text"
                          value={soc.platform}
                          onChange={(e) =>
                            handleUpdateSocial(soc.id, 'platform', e.target.value)
                          }
                          className="glass-input w-full rounded-xl px-3 py-1.5 text-xs text-white font-semibold"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-mono text-white/60 mb-1">
                          Display Handle / Label
                        </label>
                        <input
                          type="text"
                          value={soc.handle}
                          onChange={(e) =>
                            handleUpdateSocial(soc.id, 'handle', e.target.value)
                          }
                          className="glass-input w-full rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-mono text-white/60 mb-1">
                          Destination URL / mailto
                        </label>
                        <input
                          type="text"
                          value={soc.url}
                          onChange={(e) =>
                            handleUpdateSocial(soc.id, 'url', e.target.value)
                          }
                          className="glass-input w-full rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveSocial(soc.id)}
                          aria-label={`Remove ${soc.platform}`}
                          className="text-white/40 hover:text-rose-400 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => notifySave('Social profiles saved!')}
                  className="liquid-btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Social Profiles</span>
                </button>
              </div>
            </GlassSurface>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: SECURITY & PASSWORD CHANGE */}
        {/* ============================================================ */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <GlassSurface variant="readable" className="p-6 sm:p-8 max-w-xl">
              <div className="flex items-center gap-3 border-b border-white/15 pb-4 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Change Admin Password
                  </h2>
                  <p className="mt-0.5 text-xs text-white/70">
                    Update the credentials used to access this /admin panel.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {passError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-400/30 bg-rose-950/70 p-3 text-xs text-rose-200 flex items-start gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{passError}</span>
                  </div>
                )}

                {passSuccess && (
                  <div
                    role="status"
                    className="rounded-xl border border-emerald-400/30 bg-emerald-950/70 p-3 text-xs text-emerald-200 flex items-start gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>{passSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="glass-input w-full min-h-[44px] rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="glass-input w-full min-h-[44px] rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="glass-input w-full min-h-[44px] rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="liquid-btn-primary w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </GlassSurface>
          </div>
        )}
      </div>
    </div>
  );
}
