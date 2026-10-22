import React from 'react';
import { useApp, ActivePage } from '../context/AppContext';
import {
  CalendarDays,
  Pill,
  Calendar,
  Heart,
  Mic,
  ShieldCheck,
  Settings,
  Users,
  HeartHandshake,
  ArrowLeftRight,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

interface NavItem {
  page: ActivePage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { activePage, setActivePage, role, setRole, language, t } = useApp();

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    if (onCloseMobile) onCloseMobile();
  };

  const isSenior = role === 'senior';

  const seniorNavItems: NavItem[] = [
    { page: 'dashboard', label: t('navHome'), icon: CalendarDays },
    { page: 'assistant', label: t('navAssistant'), icon: Mic, highlight: true },
    { page: 'medicines', label: t('navMedicines'), icon: Pill },
    { page: 'appointments', label: t('navAppointments'), icon: Calendar },
    { page: 'wellbeing', label: t('navWellbeing'), icon: Heart },
    { page: 'privacy', label: t('navPrivacy'), icon: ShieldCheck },
    { page: 'settings', label: t('navSettings'), icon: Settings },
  ];

  const familyNavItems: NavItem[] = [
    { page: 'family', label: t('navFamilyOverview'), icon: Users },
    { page: 'privacy', label: t('navPrivacy'), icon: ShieldCheck },
    { page: 'settings', label: t('navSettings'), icon: Settings },
  ];

  const items = isSenior ? seniorNavItems : familyNavItems;

  return (
    <aside className="w-72 bg-[#FFFFFF] border-r border-[#E7E9E2] flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#E7E9E2]">
        <div
          onClick={() => handleNav('welcome')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Welcome / Role Selection"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#65866E] flex items-center justify-center text-white shadow-sm group-hover:bg-[#294B3A] transition-colors">
            <HeartHandshake className="w-6 h-6 text-[#F3DCCB]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#26372D] tracking-tight group-hover:text-[#294B3A] transition-colors">
                {t('appTitle')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#65866E]/15 text-[#294B3A]">
                {t('demoModeBadge')}
              </span>
            </div>
            <p className="text-xs text-[#778078] line-clamp-1 mt-0.5">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Current Role Chip */}
        <div className="mt-4 p-2.5 rounded-xl bg-[#F8F7F1] border border-[#E7E9E2] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#778078] block">
              Active Profile:
            </span>
            <span className="text-xs font-bold text-[#26372D]">
              {isSenior ? 'Meera Sharma (Senior)' : 'Ananya Sharma (Family)'}
            </span>
          </div>
          <button
            onClick={() => setRole(isSenior ? 'family' : 'senior')}
            className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-[#FFFFFF] text-[#294B3A] border border-[#E7E9E2] rounded-lg hover:border-[#65866E] transition-colors"
            title="Switch demo persona"
          >
            <ArrowLeftRight className="w-3 h-3 text-[#65866E]" />
            <span>Switch</span>
          </button>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = activePage === item.page;
          const Icon = item.icon;

          return (
            <button
              key={item.page}
              onClick={() => handleNav(item.page)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left text-base font-semibold transition-all ${
                isActive
                  ? 'bg-[#294B3A] text-white shadow-xs'
                  : item.highlight
                  ? 'bg-[#65866E]/10 text-[#294B3A] hover:bg-[#65866E]/20'
                  : 'text-[#26372D] hover:bg-[#F8F7F1]'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive
                    ? 'text-[#F3DCCB]'
                    : item.highlight
                    ? 'text-[#65866E]'
                    : 'text-[#778078]'
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {item.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-[#65866E]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer reassurance */}
      <div className="p-4 m-4 rounded-xl bg-[#F8F7F1] border border-[#E7E9E2]/80 text-xs text-[#778078]">
        <div className="flex items-center gap-2 font-bold text-[#294B3A] mb-1">
          <ShieldCheck className="w-4 h-4 text-[#65866E]" />
          <span>Consent First</span>
        </div>
        <p className="leading-relaxed">
          {language === 'hi'
            ? 'वरिष्ठ नागरिक की अनुमति के बिना कुछ भी साझा नहीं होता।'
            : 'No information is shared with family without your explicit permission.'}
        </p>
      </div>
    </aside>
  );
};
