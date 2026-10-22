import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  Language,
  TextSize,
  Medicine,
  Appointment,
  WellbeingCheckIn,
  ConsentSettings,
  ActivityEvent,
  SeniorProfile,
  FamilyProfile,
  WellbeingMood,
  HelpRequest,
} from '../types';
import {
  INITIAL_SENIOR_PROFILE,
  INITIAL_FAMILY_PROFILE,
  getTodayDateString,
} from '../data/demoData';
import { translations } from '../data/translations';
import { StorageService } from '../services/storage';
import { RoutineInsightsService, RoutineAnalysisResult } from '../services/routineInsightsService';

export type ActivePage =
  | 'welcome'
  | 'dashboard'
  | 'assistant'
  | 'medicines'
  | 'appointments'
  | 'wellbeing'
  | 'family'
  | 'privacy'
  | 'settings';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;

  // Senior & Family Profiles
  seniorProfile: SeniorProfile;
  familyProfile: FamilyProfile;
  updateSeniorProfile: (updates: Partial<SeniorProfile>) => void;

  // Medicines
  medicines: Medicine[];
  addMedicine: (med: Omit<Medicine, 'id' | 'scheduledDate' | 'status' | 'updatedAt'>) => void;
  updateMedicine: (med: Medicine) => void;
  deleteMedicine: (id: string) => void;
  toggleMedicineTaken: (id: string) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  updateAppointment: (apt: Appointment) => void;
  deleteAppointment: (id: string) => void;
  toggleAppointmentCompleted: (id: string) => void;

  // Wellbeing
  wellbeingLogs: WellbeingCheckIn[];
  addWellbeingCheckIn: (response: WellbeingMood, note?: string) => void;
  todayWellbeing: WellbeingCheckIn | undefined;

  // Consent & Privacy (Single source of truth)
  consentSettings: ConsentSettings;
  updateConsent: (key: keyof Omit<ConsentSettings, 'authorizedFamilyMember' | 'relationship' | 'lastUpdated'>, value: boolean) => void;

  // Activities
  activityLogs: ActivityEvent[];
  addActivityLog: (desc: string, descHi: string, category: ActivityEvent['visibilityCategory']) => void;

  // Accessibility & Visual Preferences
  fontSize: TextSize;
  setFontSize: (size: TextSize) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  accessibilityMode: boolean;
  setAccessibilityMode: (enabled: boolean) => void;
  voiceSpeechEnabled: boolean;
  setVoiceSpeechEnabled: (enabled: boolean) => void;

  // Offline-First Status
  isOnline: boolean;

  // One-Tap Help Requests (Feature 1)
  helpRequests: HelpRequest[];
  activeHelpRequest: HelpRequest | undefined;
  triggerHelpRequest: (note?: string) => void;
  resolveHelpRequest: (id: string) => void;
  cancelHelpRequest: (id: string) => void;

  // Routine Change Insights (Feature 3)
  routineAnalysis: RoutineAnalysisResult;

  // Feedback Notifications
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => StorageService.getActiveRole());
  const [activePage, setActivePage] = useState<ActivePage>('welcome');
  const [seniorProfile, setSeniorProfileState] = useState<SeniorProfile>(() => StorageService.getProfile());
  const [familyProfile] = useState<FamilyProfile>(INITIAL_FAMILY_PROFILE);

  const [language, setLanguageState] = useState<Language>(() => seniorProfile.preferredLanguage || 'en');
  const [fontSize, setFontSizeState] = useState<TextSize>(() => seniorProfile.fontSize || 'standard');
  const [highContrast, setHighContrastState] = useState<boolean>(() => seniorProfile.highContrast || false);
  const [accessibilityMode, setAccessibilityModeState] = useState<boolean>(() => seniorProfile.accessibilityMode ?? false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabledState] = useState<boolean>(() => seniorProfile.voiceSpeechEnabled ?? true);

  const [medicines, setMedicinesState] = useState<Medicine[]>(() => StorageService.getMedicines());
  const [appointments, setAppointmentsState] = useState<Appointment[]>(() => StorageService.getAppointments());
  const [wellbeingLogs, setWellbeingLogsState] = useState<WellbeingCheckIn[]>(() => StorageService.getWellbeingLogs());
  const [consentSettings, setConsentSettingsState] = useState<ConsentSettings>(() => StorageService.getConsentSettings());
  const [activityLogs, setActivityLogsState] = useState<ActivityEvent[]>(() => StorageService.getActivityLogs());
  const [helpRequests, setHelpRequestsState] = useState<HelpRequest[]>(() => StorageService.getHelpRequests());

  // Offline / Online state tracker (Feature 2)
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Internet connection detected. Local storage active.', 'info');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Offline Mode: Your data remains fully available on this device.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply HTML accessibility classes whenever font size, high contrast, or accessibility mode changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-standard', 'font-large', 'font-xlarge', 'high-contrast', 'accessibility-mode');
    
    if (accessibilityMode) {
      root.classList.add('accessibility-mode', 'high-contrast', 'font-xlarge');
    } else {
      root.classList.add(`font-${fontSize}`);
      if (highContrast) {
        root.classList.add('high-contrast');
      }
    }
  }, [fontSize, highContrast, accessibilityMode]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const t = (key: keyof typeof translations.en): string => {
    const dict = translations[language] || translations.en;
    return (dict as any)[key] || translations.en[key] || String(key);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    StorageService.saveActiveRole(newRole);
    if (newRole === 'senior') {
      setActivePage('dashboard');
    } else {
      setActivePage('family');
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const updated = { ...seniorProfile, preferredLanguage: lang };
    setSeniorProfileState(updated);
    StorageService.saveProfile(updated);
  };

  const setFontSize = (size: TextSize) => {
    setFontSizeState(size);
    const updated = { ...seniorProfile, fontSize: size };
    setSeniorProfileState(updated);
    StorageService.saveProfile(updated);
  };

  const setHighContrast = (contrast: boolean) => {
    setHighContrastState(contrast);
    const updated = { ...seniorProfile, highContrast: contrast };
    setSeniorProfileState(updated);
    StorageService.saveProfile(updated);
  };

  const setAccessibilityMode = (enabled: boolean) => {
    setAccessibilityModeState(enabled);
    const updated = {
      ...seniorProfile,
      accessibilityMode: enabled,
      highContrast: enabled ? true : highContrast,
      fontSize: enabled ? ('xlarge' as TextSize) : fontSize,
    };
    setSeniorProfileState(updated);
    StorageService.saveProfile(updated);
    StorageService.saveAccessibilityMode(enabled);

    showToast(
      enabled
        ? language === 'hi'
          ? 'वरिष्ठ नागरिक सुलभता मोड सक्रिय'
          : 'Senior Accessibility Mode enabled'
        : language === 'hi'
        ? 'सामान्य मोड सक्रिय'
        : 'Standard display mode restored',
      'info'
    );
  };

  const setVoiceSpeechEnabled = (enabled: boolean) => {
    setVoiceSpeechEnabledState(enabled);
    const updated = { ...seniorProfile, voiceSpeechEnabled: enabled };
    setSeniorProfileState(updated);
    StorageService.saveProfile(updated);
  };

  const updateSeniorProfile = (updates: Partial<SeniorProfile>) => {
    const updated = { ...seniorProfile, ...updates };
    setSeniorProfileState(updated);
    StorageService.saveProfile(updated);
    showToast(language === 'hi' ? 'प्रोफ़ाइल अपडेट की गई' : 'Profile updated', 'success');
  };

  const addActivityLog = (
    desc: string,
    descHi: string,
    category: ActivityEvent['visibilityCategory']
  ) => {
    const newEvent: ActivityEvent = {
      id: `act_${Date.now()}`,
      eventType: category.toUpperCase(),
      timestamp: new Date().toISOString(),
      description: desc,
      descriptionHi: descHi,
      visibilityCategory: category,
      actor: role,
    };
    const updated = [newEvent, ...activityLogs].slice(0, 50);
    setActivityLogsState(updated);
    StorageService.saveActivityLogs(updated);
  };

  // One-Tap Help Handlers (Feature 1)
  const activeHelpRequest = helpRequests.find((r) => r.status === 'active');

  const triggerHelpRequest = (note?: string) => {
    const newReq: HelpRequest = {
      id: `help_${Date.now()}`,
      status: 'active',
      requestedAt: new Date().toISOString(),
      note: note || '',
      contactName: seniorProfile.emergencyContact.name,
      contactPhone: seniorProfile.emergencyContact.phone,
      isSimulatedDemo: true,
    };

    const updated = [newReq, ...helpRequests.filter((r) => r.status !== 'active')];
    setHelpRequestsState(updated);
    StorageService.saveHelpRequests(updated);

    addActivityLog(
      `One-Tap Help requested: Simulated alert logged for ${seniorProfile.emergencyContact.name}`,
      `सहायता अनुरोध दर्ज: ${seniorProfile.emergencyContact.name} के लिए सिमुलेटेड अलर्ट`,
      'help'
    );

    showToast(t('helpTriggeredToast'), 'warning');
  };

  const resolveHelpRequest = (id: string) => {
    const updated = helpRequests.map((r) =>
      r.id === id ? { ...r, status: 'resolved' as const, resolvedAt: new Date().toISOString() } : r
    );
    setHelpRequestsState(updated);
    StorageService.saveHelpRequests(updated);

    addActivityLog(
      'Help request marked as resolved (Senior confirmed okay)',
      'सहायता अनुरोध हल हुआ चिह्नित किया गया (सब ठीक है)',
      'help'
    );

    showToast(t('helpResolvedToast'), 'success');
  };

  const cancelHelpRequest = (id: string) => {
    const updated = helpRequests.map((r) =>
      r.id === id ? { ...r, status: 'cancelled' as const } : r
    );
    setHelpRequestsState(updated);
    StorageService.saveHelpRequests(updated);

    addActivityLog(
      'Help request was cancelled by senior',
      'सहायता अनुरोध रद्द किया गया',
      'help'
    );

    showToast(t('helpCancelledToast'), 'info');
  };

  // Medicine operations
  const addMedicine = (med: Omit<Medicine, 'id' | 'scheduledDate' | 'status' | 'updatedAt'>) => {
    const newMed: Medicine = {
      ...med,
      id: `med_${Date.now()}`,
      scheduledDate: getTodayDateString(0),
      status: 'upcoming',
      updatedAt: new Date().toISOString(),
    };
    const updated = [...medicines, newMed];
    setMedicinesState(updated);
    StorageService.saveMedicines(updated);
    addActivityLog(
      `Added new medicine: ${newMed.name} (${newMed.reminderTime})`,
      `नई दवा जोड़ी गई: ${newMed.name} (${newMed.reminderTime})`,
      'medicine'
    );
    showToast(
      language === 'hi' ? `${newMed.name} सहेज ली गई है` : `${newMed.name} added to schedule`,
      'success'
    );
  };

  const updateMedicine = (med: Medicine) => {
    const updated = medicines.map((m) => (m.id === med.id ? { ...med, updatedAt: new Date().toISOString() } : m));
    setMedicinesState(updated);
    StorageService.saveMedicines(updated);
    showToast(
      language === 'hi' ? `${med.name} में बदलाव सुरक्षित किए गए` : `${med.name} updated`,
      'success'
    );
  };

  const deleteMedicine = (id: string) => {
    const target = medicines.find((m) => m.id === id);
    const updated = medicines.filter((m) => m.id !== id);
    setMedicinesState(updated);
    StorageService.saveMedicines(updated);
    if (target) {
      addActivityLog(
        `Removed medicine reminder for ${target.name}`,
        `${target.name} के लिए रिमाइंडर हटाया गया`,
        'medicine'
      );
    }
    showToast(
      language === 'hi' ? 'दवा हटा दी गई है' : 'Medicine removed from schedule',
      'info'
    );
  };

  const toggleMedicineTaken = (id: string) => {
    const med = medicines.find((m) => m.id === id);
    if (!med) return;

    const isNowTaken = med.status !== 'taken';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = medicines.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          status: isNowTaken ? ('taken' as const) : ('upcoming' as const),
          takenAt: isNowTaken ? nowTime : undefined,
          updatedAt: new Date().toISOString(),
        };
      }
      return m;
    });

    setMedicinesState(updated);
    StorageService.saveMedicines(updated);

    if (isNowTaken) {
      addActivityLog(
        `${med.name} confirmed taken at ${nowTime}`,
        `${med.name} समय ${nowTime} पर ले ली गई`,
        'medicine'
      );
      showToast(
        language === 'hi'
          ? `शानदार! आपने ${med.name} ले ली है`
          : `Great! ${med.name} marked as taken.`,
        'success'
      );
    } else {
      showToast(
        language === 'hi'
          ? `${med.name} को आगामी के रूप में चिह्नित किया गया`
          : `${med.name} status reset to upcoming`,
        'info'
      );
    }
  };

  // Appointment operations
  const addAppointment = (apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newApt: Appointment = {
      ...apt,
      id: `apt_${Date.now()}`,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };
    const updated = [...appointments, newApt];
    setAppointmentsState(updated);
    StorageService.saveAppointments(updated);
    addActivityLog(
      `Scheduled appointment with ${newApt.doctorName} on ${newApt.date}`,
      `${newApt.doctorName} के साथ ${newApt.date} को मुलाकात निर्धारित की गई`,
      'appointment'
    );
    showToast(
      language === 'hi' ? 'डॉक्टर मुलाकात जोड़ दी गई' : 'Appointment scheduled',
      'success'
    );
  };

  const updateAppointment = (apt: Appointment) => {
    const updated = appointments.map((a) => (a.id === apt.id ? apt : a));
    setAppointmentsState(updated);
    StorageService.saveAppointments(updated);
    showToast(
      language === 'hi' ? 'मुलाकात विवरण अपडेट हुआ' : 'Appointment updated',
      'success'
    );
  };

  const deleteAppointment = (id: string) => {
    const target = appointments.find((a) => a.id === id);
    const updated = appointments.filter((a) => a.id !== id);
    setAppointmentsState(updated);
    StorageService.saveAppointments(updated);
    if (target) {
      addActivityLog(
        `Cancelled appointment with ${target.doctorName}`,
        `${target.doctorName} के साथ मुलाकात रद्द की गई`,
        'appointment'
      );
    }
    showToast(
      language === 'hi' ? 'मुलाकात हटा दी गई है' : 'Appointment removed',
      'info'
    );
  };

  const toggleAppointmentCompleted = (id: string) => {
    const target = appointments.find((a) => a.id === id);
    if (!target) return;
    const isNowCompleted = target.status !== 'completed';
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: isNowCompleted ? ('completed' as const) : ('upcoming' as const) } : a
    );
    setAppointmentsState(updated);
    StorageService.saveAppointments(updated);
    showToast(
      isNowCompleted
        ? language === 'hi'
          ? 'मुलाकात पूर्ण चिह्नित की गई'
          : 'Appointment marked completed'
        : language === 'hi'
        ? 'मुलाकात फिर से आगामी के रूप में सेट हुई'
        : 'Appointment marked upcoming',
      'info'
    );
  };

  // Wellbeing operations
  const addWellbeingCheckIn = (response: WellbeingMood, note?: string) => {
    const todayStr = getTodayDateString(0);
    const newLog: WellbeingCheckIn = {
      id: `wb_${Date.now()}`,
      response,
      note: note || '',
      createdAt: new Date().toISOString(),
      date: todayStr,
      sharingPermissionApplied: consentSettings.wellbeingSummarySharing,
    };

    // Filter out previous checkin for today if already present
    const filtered = wellbeingLogs.filter((w) => w.date !== todayStr);
    const updated = [newLog, ...filtered];
    setWellbeingLogsState(updated);
    StorageService.saveWellbeingLogs(updated);

    const moodLabels = {
      well: language === 'hi' ? 'बिल्कुल ठीक' : 'Feeling Well',
      okay: language === 'hi' ? 'सामान्य' : 'Feeling Okay',
      support: language === 'hi' ? 'मदद चाहिए' : 'Need Support',
    };

    addActivityLog(
      `Daily wellbeing recorded: ${moodLabels[response]}`,
      `दैनिक स्वास्थ्य स्थिति दर्ज: ${moodLabels[response]}`,
      'wellbeing'
    );

    showToast(
      language === 'hi' ? 'आज का स्वास्थ्य हाल-चाल दर्ज हुआ!' : 'Wellbeing check-in saved!',
      'success'
    );
  };

  const todayStr = getTodayDateString(0);
  const todayWellbeing = wellbeingLogs.find((w) => w.date === todayStr);

  // Derived Routine Insights Analysis (Feature 3)
  const routineAnalysis = RoutineInsightsService.analyzeRoutine({
    medicines,
    appointments,
    wellbeingLogs,
  });

  // Consent operations (Single source of truth)
  const updateConsent = (
    key: keyof Omit<ConsentSettings, 'authorizedFamilyMember' | 'relationship' | 'lastUpdated'>,
    value: boolean
  ) => {
    const updated: ConsentSettings = {
      ...consentSettings,
      [key]: value,
      lastUpdated: new Date().toISOString(),
    };
    setConsentSettingsState(updated);
    StorageService.saveConsentSettings(updated);

    const keyLabels: Record<string, string> = {
      medicineStatusSharing: 'Medicine status sharing',
      wellbeingSummarySharing: 'Wellbeing summary sharing',
      appointmentSharing: 'Appointment sharing',
      activitySharing: 'Activity timeline sharing',
    };
    const keyLabelsHi: Record<string, string> = {
      medicineStatusSharing: 'दवा स्थिति साझाकरण',
      wellbeingSummarySharing: 'स्वास्थ्य सारांश साझाकरण',
      appointmentSharing: 'डॉक्टर मुलाकात साझाकरण',
      activitySharing: 'गतिविधि समयरेखा साझाकरण',
    };

    addActivityLog(
      `Privacy setting updated: ${keyLabels[key]} set to ${value ? 'ALLOWED' : 'REVOKED'}`,
      `गोपनीयता सेटिंग बदली: ${keyLabelsHi[key]} को ${value ? 'स्वीकृत' : 'अस्वीकृत'} किया`,
      'consent'
    );

    showToast(
      value
        ? language === 'hi'
          ? `${keyLabelsHi[key]} की अनुमति दी गई`
          : `${keyLabels[key]} enabled for Ananya`
        : language === 'hi'
        ? `${keyLabelsHi[key]} की अनुमति वापस ली गई`
        : `${keyLabels[key]} revoked (Private)`,
      'info'
    );
  };

  const resetDemoData = () => {
    StorageService.resetAllToDefaults();
    setSeniorProfileState(INITIAL_SENIOR_PROFILE);
    setMedicinesState(StorageService.getMedicines());
    setAppointmentsState(StorageService.getAppointments());
    setWellbeingLogsState(StorageService.getWellbeingLogs());
    setConsentSettingsState(StorageService.getConsentSettings());
    setActivityLogsState(StorageService.getActivityLogs());
    setHelpRequestsState([]);
    setLanguageState('en');
    setFontSizeState('standard');
    setHighContrastState(false);
    setAccessibilityModeState(false);
    setVoiceSpeechEnabledState(true);
    showToast('Demo data restored to pristine state', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activePage,
        setActivePage,
        language,
        setLanguage,
        t,
        seniorProfile,
        familyProfile,
        updateSeniorProfile,
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        toggleMedicineTaken,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        toggleAppointmentCompleted,
        wellbeingLogs,
        addWellbeingCheckIn,
        todayWellbeing,
        consentSettings,
        updateConsent,
        activityLogs,
        addActivityLog,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        accessibilityMode,
        setAccessibilityMode,
        voiceSpeechEnabled,
        setVoiceSpeechEnabled,
        isOnline,
        helpRequests,
        activeHelpRequest,
        triggerHelpRequest,
        resolveHelpRequest,
        cancelHelpRequest,
        routineAnalysis,
        toasts,
        showToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
