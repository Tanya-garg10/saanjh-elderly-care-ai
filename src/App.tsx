import React from 'react';
import { SaanjhProvider, useSaanjh } from './context/SaanjhContext';
import { AppShell } from './components/AppShell';
import { LandingPage } from './views/LandingPage';
import { AuthView } from './views/AuthView';
import { RoleSelectionView } from './views/RoleSelectionView';
import { SeniorDashboard } from './views/SeniorDashboard';
import { FamilyDashboard } from './views/FamilyDashboard';
import { VoiceAssistantView } from './views/VoiceAssistantView';
import { RoutinePlannerView } from './views/RoutinePlannerView';
import { MedicinesView } from './views/MedicinesView';
import { AppointmentsView } from './views/AppointmentsView';
import { WellbeingView } from './views/WellbeingView';
import { RoutineInsightsView } from './views/RoutineInsightsView';
import { DocumentVaultView } from './views/DocumentVaultView';
import { CareCircleView } from './views/CareCircleView';
import { HelpSupportView } from './views/HelpSupportView';
import { PrivacyConsentView } from './views/PrivacyConsentView';
import { AccessibilitySettingsView } from './views/AccessibilitySettingsView';
import { ProfilePreferencesView } from './views/ProfilePreferencesView';

const SaanjhRouter: React.FC = () => {
  const { state } = useSaanjh();

  if (state.currentView === 'landing') {
    return <LandingPage />;
  }
  if (state.currentView === 'auth') {
    return <AuthView />;
  }
  if (state.currentView === 'role-select') {
    return <RoleSelectionView />;
  }

  return (
    <AppShell>
      {state.currentView === 'senior-dashboard' && <SeniorDashboard />}
      {state.currentView === 'family-dashboard' && <FamilyDashboard />}
      {state.currentView === 'voice-assistant' && <VoiceAssistantView />}
      {state.currentView === 'routine-planner' && <RoutinePlannerView />}
      {state.currentView === 'medicines' && <MedicinesView />}
      {state.currentView === 'appointments' && <AppointmentsView />}
      {state.currentView === 'wellbeing' && <WellbeingView />}
      {state.currentView === 'insights' && <RoutineInsightsView />}
      {state.currentView === 'document-vault' && <DocumentVaultView />}
      {state.currentView === 'care-circle' && <CareCircleView />}
      {state.currentView === 'help' && <HelpSupportView />}
      {state.currentView === 'privacy' && <PrivacyConsentView />}
      {state.currentView === 'accessibility' && <AccessibilitySettingsView />}
      {state.currentView === 'profile' && <ProfilePreferencesView />}
    </AppShell>
  );
};

export default function App() {
  return (
    <SaanjhProvider>
      <SaanjhRouter />
    </SaanjhProvider>
  );
}
