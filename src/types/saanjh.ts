export type UserRole = 'senior' | 'family';

export type AppView =
  | 'landing'
  | 'auth'
  | 'role-select'
  | 'senior-dashboard'
  | 'family-dashboard'
  | 'voice-assistant'
  | 'routine-planner'
  | 'medicines'
  | 'appointments'
  | 'wellbeing'
  | 'insights'
  | 'document-vault'
  | 'care-circle'
  | 'help'
  | 'privacy'
  | 'accessibility'
  | 'profile';

export type AssistantLanguage = 'en' | 'hi' | 'hinglish';

export type MoodOption = 'peaceful' | 'good' | 'tired' | 'low' | 'anxious';

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface MedicineHistoryEntry {
  date: string; // YYYY-MM-DD
  status: 'taken' | 'missed' | 'pending';
  confirmedAt?: string;
  verificationMethod: 'user-confirmed' | 'unconfirmed';
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  time: string; // e.g. "08:00"
  timeSlot: TimeSlot;
  active: boolean;
  takenToday: boolean;
  completedAt?: string;
  verificationType: 'user-confirmed' | 'unconfirmed';
  history: MedicineHistoryEntry[];
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes: string;
  status: AppointmentStatus;
}

export interface AppointmentPrep {
  id: string;
  appointmentId: string;
  concerns: string[];
  questions: string[];
  summaryText: string;
  approved: boolean;
  updatedAt: string;
}

export interface WellbeingCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mood: MoodOption;
  note: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phoneLabel: string;
  notes: string;
  isDefault: boolean;
}

export interface HelpRequest {
  id: string;
  createdAt: string;
  reason: string;
  message: string;
  trustedContactId?: string;
  trustedContactName?: string;
  status: 'saved-locally' | 'acknowledged-demo';
  transmissionNotice: string;
}

export interface PrivacyPermissionLog {
  id: string;
  timestamp: string;
  category: keyof PrivacyPermissions;
  action: 'granted' | 'revoked';
  note: string;
}

export interface PrivacyPermissions {
  medicines: boolean;
  appointments: boolean;
  wellbeing: boolean;
  insights: boolean;
  generalActivity: boolean;
  careCircle: boolean;
  documents: boolean;
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  largeTouchTargets: boolean;
  simplifiedNav: boolean;
  voiceAutoRead: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  city: string;
  avatarUrl: string;
  phoneLabel: string;
  emergencyNote: string;
  preferredLanguage: AssistantLanguage;
}

export interface FamilyProfile {
  name: string;
  relationship: string;
  city: string;
  avatarUrl: string;
  phoneLabel: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  city: string;
  role: 'Primary Coordinator' | 'Care Circle Member';
  contactLabel: string;
  status: 'active' | 'invited';
  invitedAt: string;
}

export type CareTaskStatus = 'pending' | 'in-progress' | 'completed';

export interface CareTask {
  id: string;
  title: string;
  assignedToId: string;
  dueDate: string; // YYYY-MM-DD
  category: 'Medicines' | 'Clinic Visit' | 'Errands' | 'Check-in Call';
  notes: string;
  status: CareTaskStatus;
}

export interface SharedVisit {
  id: string;
  memberId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  purpose: string;
  status: 'planned' | 'completed';
}

export type RoutineActivityCategory = 'hydration' | 'activity' | 'rest' | 'custom';

export interface RoutineActivity {
  id: string;
  title: string;
  category: RoutineActivityCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes: string;
  status: 'pending' | 'completed' | 'postponed';
  completedAt?: string;
}

export type DocumentCategory =
  | 'Prescription'
  | 'Lab Report'
  | 'Clinic Summary'
  | 'Insurance / ID'
  | 'Other';

export interface HealthDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  documentDate: string; // YYYY-MM-DD
  source: string;
  description: string;
  attachmentName?: string;
  sharedWithFamily: boolean;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  category:
    | 'medicines'
    | 'appointments'
    | 'wellbeing'
    | 'privacy'
    | 'help'
    | 'care-circle'
    | 'routine'
    | 'documents';
  title: string;
  detail: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: AssistantLanguage;
  timestamp: string;
  dataSources?: string[];
}

export interface RoutineInsight {
  id: string;
  category: 'medicines' | 'wellbeing' | 'appointments';
  title: string;
  summary: string;
  explanation: string;
  timeframe: string;
}

export interface SaanjhState {
  isAuthenticated: boolean;
  activeRole: UserRole;
  currentView: AppView;
  seniorProfile: UserProfile;
  familyProfile: FamilyProfile;
  medicines: Medicine[];
  appointments: Appointment[];
  appointmentPreps: AppointmentPrep[];
  wellbeingHistory: WellbeingCheckIn[];
  trustedContacts: TrustedContact[];
  helpRequests: HelpRequest[];
  privacy: PrivacyPermissions;
  privacyLogs: PrivacyPermissionLog[];
  accessibility: AccessibilitySettings;
  familyMembers: FamilyMember[];
  careTasks: CareTask[];
  sharedVisits: SharedVisit[];
  routineActivities: RoutineActivity[];
  documents: HealthDocument[];
  activities: ActivityEvent[];
  assistantMessages: AssistantMessage[];
  demoChecklistCompleted: string[];
}
