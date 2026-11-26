import React, { useState } from 'react';
import {
  LayoutDashboard,
  Mic,
  Pill,
  Calendar,
  Heart,
  TrendingUp,
  LifeBuoy,
  ShieldCheck,
  Eye,
  User,
  Menu,
  X,
  ArrowLeftRight,
  LogOut,
  Users,
  Clock,
  FileText,
} from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { AppView } from '../types/saanjh';
import { SafeImage } from './SafeImage';

interface NavItem {
  view: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  coreForSimplified?: boolean;
}

const SENIOR_NAV: NavItem[] = [
  { view: 'senior-dashboard', label: 'Today', icon: LayoutDashboard, coreForSimplified: true },
  { view: 'voice-assistant', label: 'Talk to Saanjh', icon: Mic, coreForSimplified: true },
  { view: 'routine-planner', label: 'Routine Planner', icon: Clock, coreForSimplified: true },
  { view: 'medicines', label: 'Medicines', icon: Pill, coreForSimplified: true },
  { view: 'appointments', label: 'Appointments', icon: Calendar, coreForSimplified: true },
  { view: 'wellbeing', label: 'Wellbeing', icon: Heart },
  { view: 'insights', label: 'Routine Insights', icon: TrendingUp },
  { view: 'document-vault', label: 'Document Vault', icon: FileText },
  { view: 'care-circle', label: 'Care Circle', icon: Users },
  { view: 'help', label: 'I Need Help', icon: LifeBuoy, coreForSimplified: true },
  { view: 'privacy', label: 'Privacy & Consent', icon: ShieldCheck, coreForSimplified: true },
  { view: 'accessibility', label: 'Accessibility', icon: Eye },
  { view: 'profile', label: 'Profile & Demo', icon: User },
];

const FAMILY_NAV: NavItem[] = [
  { view: 'family-dashboard', label: 'Family Overview', icon: LayoutDashboard, coreForSimplified: true },
  { view: 'care-circle', label: 'Care Circle & Tasks', icon: Users, coreForSimplified: true },
  { view: 'privacy', label: 'Consent Status', icon: ShieldCheck, coreForSimplified: true },
  { view: 'accessibility', label: 'Accessibility', icon: Eye },
  { view: 'profile', label: 'Profile & Demo', icon: User, coreForSimplified: true },
];

const VIEW_TITLES: Record<AppView, string> = {
  landing: 'Welcome',
  auth: 'Sign In',
  'role-select': 'Choose View',
  'senior-dashboard': 'Senior Home',
  'family-dashboard': 'Family Overview',
  'voice-assistant': 'Talk to Saanjh',
  'routine-planner': 'Daily Routine Planner',
  medicines: 'Medicine Schedule',
  appointments: 'Appointments & Visit Prep',
  wellbeing: 'Wellbeing & Trends',
  insights: 'Routine Insights',
  'document-vault': 'Health Document Vault',
  'care-circle': 'Family Care Circle',
  help: 'Trusted Contact Help',
  privacy: 'Privacy & Consent Center',
  accessibility: 'Accessibility Settings',
  profile: 'Profile & Demo Guide',
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, navigate, switchRole, logout } = useSaanjh();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSenior = state.activeRole === 'senior';
  const rawNav = isSenior ? SENIOR_NAV : FAMILY_NAV;
  const navItems = state.accessibility.simplifiedNav
    ? rawNav.filter((item) => item.coreForSimplified)
    : rawNav;

  const activeProfile = isSenior ? state.seniorProfile : state.familyProfile;

  const handleNavClick = (view: AppView) => {
    navigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-ivory)] text-[var(--text-primary)] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-68 lg:shrink-0 lg:flex-col border-r border-[var(--border-hairline)] bg-[var(--surface-white)]">
        <div className="px-6 py-6 border-b border-[var(--border-hairline)]">
          <button
            type="button"
            onClick={() => navigate('landing')}
            className="font-display text-xl font-bold tracking-tight text-[var(--deep-green)] text-left"
          >
            Saanjh
          </button>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Local Offline Demo · Saved on device
          </p>
        </div>

        <nav aria-label="Primary navigation" className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = state.currentView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNavClick(item.view)}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[var(--secondary-sage)] text-[var(--deep-green)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[#F3F5F2] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--border-hairline)] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <SafeImage
              src={activeProfile.avatarUrl}
              alt={activeProfile.name}
              className="w-10 h-10 rounded-full object-cover border border-[var(--border-hairline)] shrink-0"
              fallbackLabel={activeProfile.name[0]}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {activeProfile.name}
              </p>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {isSenior ? 'Senior View' : `Family · ${state.familyProfile.relationship}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => switchRole(isSenior ? 'family' : 'senior')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] transition-colors whitespace-nowrap"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Switch to {isSenior ? 'Ananya (Family)' : 'Meera (Senior)'}</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#F3F5F2] transition-colors whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Exit to Landing</span>
          </button>
        </div>
      </aside>

      {/* Mobile Compact Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-4 px-4 py-3 bg-[var(--surface-white)] border-b border-[var(--border-hairline)]">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 rounded-xl border border-[var(--border-hairline)] text-[var(--text-primary)] hover:bg-[var(--secondary-sage)]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display text-lg font-bold text-[var(--deep-green)] whitespace-nowrap">
            Saanjh
          </span>
        </div>

        <button
          type="button"
          onClick={() => switchRole(isSenior ? 'family' : 'senior')}
          className="px-3 py-1.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-xs font-medium text-[var(--text-primary)] whitespace-nowrap shrink-0"
        >
          {isSenior ? 'View as Ananya' : 'View as Meera'}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="fixed inset-0 bg-[#26352F]/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-[var(--surface-white)] h-full flex flex-col border-r border-[var(--border-hairline)]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-hairline)]">
              <span className="font-display text-lg font-bold text-[var(--deep-green)]">
                Saanjh
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--secondary-sage)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = state.currentView === item.view;
                return (
                  <button
                    key={item.view}
                    type="button"
                    onClick={() => handleNavClick(item.view)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[var(--secondary-sage)] text-[var(--deep-green)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:bg-[#F3F5F2]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[var(--border-hairline)] space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 rounded-xl border border-[var(--border-hairline)] text-sm font-medium text-[var(--text-secondary)]"
              >
                Exit to Landing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="hidden lg:flex items-center justify-between gap-6 px-8 py-4 border-b border-[var(--border-hairline)] bg-[var(--surface-white)]">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span>{isSenior ? 'Senior Workspace' : 'Family Workspace'}</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-[var(--text-primary)]">
              {VIEW_TITLES[state.currentView]}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <span>Offline-first demo · Browser localStorage</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => navigate('accessibility')}
              className="underline decoration-[var(--border-hairline)] hover:text-[var(--deep-green)] whitespace-nowrap"
            >
              Display &amp; Accessibility
            </button>
          </div>
        </div>

        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
