import {
  SeniorProfile,
  Medicine,
  Appointment,
  WellbeingCheckIn,
  ConsentSettings,
  ActivityEvent,
  HelpRequest,
} from '../types';
import {
  INITIAL_SENIOR_PROFILE,
  INITIAL_MEDICINES,
  INITIAL_APPOINTMENTS,
  INITIAL_WELLBEING_LOGS,
  INITIAL_CONSENT_SETTINGS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/demoData';

const STORAGE_KEYS = {
  PROFILE: 'saanjh_profile_v1',
  MEDICINES: 'saanjh_medicines_v1',
  APPOINTMENTS: 'saanjh_appointments_v1',
  WELLBEING: 'saanjh_wellbeing_v1',
  CONSENT: 'saanjh_consent_v1',
  ACTIVITIES: 'saanjh_activities_v1',
  ACTIVE_ROLE: 'saanjh_role_v1',
  HELP_REQUESTS: 'saanjh_help_requests_v1',
  ACCESSIBILITY: 'saanjh_accessibility_v1',
};

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[Saanjh Storage] Error reading ${key}, falling back to defaults`, err);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[Saanjh Storage] Failed to write ${key}`, err);
  }
}

export const StorageService = {
  getProfile(): SeniorProfile {
    return safeGetItem<SeniorProfile>(STORAGE_KEYS.PROFILE, INITIAL_SENIOR_PROFILE);
  },
  saveProfile(profile: SeniorProfile): void {
    safeSetItem(STORAGE_KEYS.PROFILE, profile);
  },

  getMedicines(): Medicine[] {
    return safeGetItem<Medicine[]>(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES);
  },
  saveMedicines(medicines: Medicine[]): void {
    safeSetItem(STORAGE_KEYS.MEDICINES, medicines);
  },

  getAppointments(): Appointment[] {
    return safeGetItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },
  saveAppointments(appointments: Appointment[]): void {
    safeSetItem(STORAGE_KEYS.APPOINTMENTS, appointments);
  },

  getWellbeingLogs(): WellbeingCheckIn[] {
    return safeGetItem<WellbeingCheckIn[]>(STORAGE_KEYS.WELLBEING, INITIAL_WELLBEING_LOGS);
  },
  saveWellbeingLogs(logs: WellbeingCheckIn[]): void {
    safeSetItem(STORAGE_KEYS.WELLBEING, logs);
  },

  getConsentSettings(): ConsentSettings {
    return safeGetItem<ConsentSettings>(STORAGE_KEYS.CONSENT, INITIAL_CONSENT_SETTINGS);
  },
  saveConsentSettings(settings: ConsentSettings): void {
    safeSetItem(STORAGE_KEYS.CONSENT, settings);
  },

  getActivityLogs(): ActivityEvent[] {
    return safeGetItem<ActivityEvent[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITY_LOGS);
  },
  saveActivityLogs(activities: ActivityEvent[]): void {
    safeSetItem(STORAGE_KEYS.ACTIVITIES, activities);
  },

  getActiveRole(): 'senior' | 'family' {
    return safeGetItem<'senior' | 'family'>(STORAGE_KEYS.ACTIVE_ROLE, 'senior');
  },
  saveActiveRole(role: 'senior' | 'family'): void {
    safeSetItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  },

  getHelpRequests(): HelpRequest[] {
    return safeGetItem<HelpRequest[]>(STORAGE_KEYS.HELP_REQUESTS, []);
  },
  saveHelpRequests(requests: HelpRequest[]): void {
    safeSetItem(STORAGE_KEYS.HELP_REQUESTS, requests);
  },

  getAccessibilityMode(): boolean {
    return safeGetItem<boolean>(STORAGE_KEYS.ACCESSIBILITY, false);
  },
  saveAccessibilityMode(enabled: boolean): void {
    safeSetItem(STORAGE_KEYS.ACCESSIBILITY, enabled);
  },

  resetAllToDefaults(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.MEDICINES);
      localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
      localStorage.removeItem(STORAGE_KEYS.WELLBEING);
      localStorage.removeItem(STORAGE_KEYS.CONSENT);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
      localStorage.removeItem(STORAGE_KEYS.HELP_REQUESTS);
      localStorage.removeItem(STORAGE_KEYS.ACCESSIBILITY);
    } catch (err) {
      console.warn('[Saanjh Storage] Reset error', err);
    }
  },
};
