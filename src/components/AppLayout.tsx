import React, { useState, ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import { Modal } from './Modal';
import { ToastContainer } from './Toast';
import { ShieldCheck, Info } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { role, activePage, setActivePage, language, t } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F7F1] flex flex-col antialiased">
      {/* Top Demo banner */}
      <div className="bg-[#294B3A] text-white text-[12px] sm:text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-4xl mx-auto text-center justify-center w-full">
          <span className="font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#65866E] text-[10px]">
            Demo Mode
          </span>
          <span className="truncate">
            {t('demoModeNotice')}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-[#1E2E24]/60 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-full bg-white h-full z-10 shadow-2xl">
              <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>

      {/* Floating Voice Assistant Modal */}
      {isVoiceModalOpen && (
        <Modal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          title={t('assistantTitle')}
          subtitle={t('assistantSubtitle')}
          maxWidth="max-w-2xl"
        >
          <VoiceAssistantModal onClose={() => setIsVoiceModalOpen(false)} />
        </Modal>
      )}

      {/* Global Toast notifications */}
      <ToastContainer />
    </div>
  );
};
