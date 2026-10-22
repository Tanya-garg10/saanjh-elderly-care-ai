/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/AppLayout';
import { Welcome } from './pages/Welcome';
import { SeniorDashboard } from './pages/SeniorDashboard';
import { VoiceAssistantPage } from './pages/VoiceAssistant';
import { Medicines } from './pages/Medicines';
import { Appointments } from './pages/Appointments';
import { Wellbeing } from './pages/Wellbeing';
import { FamilyDashboard } from './pages/FamilyDashboard';
import { PrivacyCenter } from './pages/PrivacyCenter';
import { Settings } from './pages/Settings';

function AppContent() {
  const { activePage } = useApp();

  if (activePage === 'welcome') {
    return <Welcome />;
  }

  return (
    <AppLayout>
      {activePage === 'dashboard' && <SeniorDashboard />}
      {activePage === 'assistant' && <VoiceAssistantPage />}
      {activePage === 'medicines' && <Medicines />}
      {activePage === 'appointments' && <Appointments />}
      {activePage === 'wellbeing' && <Wellbeing />}
      {activePage === 'family' && <FamilyDashboard />}
      {activePage === 'privacy' && <PrivacyCenter />}
      {activePage === 'settings' && <Settings />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
