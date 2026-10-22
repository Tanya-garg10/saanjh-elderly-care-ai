export type UserRole = 'senior' | 'family';

export type Language = 'en' | 'hi';

export type TextSize = 'standard' | 'large' | 'xlarge';

export type MedicineStatus = 'upcoming' | 'taken' | 'missed';

export type MedicineTimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Medicine {
  id: string;
  name: string;
  dosage?: string;
  reminderTime: string; // "08:30 AM" or "08:30"
  timeSlot: MedicineTimeSlot;
  instructions: string; // e.g., "After breakfast with water"
  scheduledDate: string; // "YYYY-MM-DD"
  status: MedicineStatus;
  takenAt?: string;
  updatedAt: string;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  doctorName: string;
  specialty?: string;
  clinicName: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "11:30 AM"
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export type WellbeingMood = 'well' | 'okay' | 'support';

export interface WellbeingCheckIn {
  id: string;
  response: WellbeingMood;
  note?: string;
  createdAt: string; // ISO string
  date: string; // "YYYY-MM-DD"
  sharingPermissionApplied: boolean;
}

export interface ConsentSettings {
  medicineStatusSharing: boolean;
  wellbeingSummarySharing: boolean;
  appointmentSharing: boolean;
  activitySharing: boolean;
  authorizedFamilyMember: string;
  relationship: string;
  lastUpdated: string;
}

export type ActivityCategory = 'medicine' | 'wellbeing' | 'appointment' | 'consent' | 'system' | 'help';

export interface ActivityEvent {
  id: string;
  eventType: string;
  timestamp: string;
  description: string;
  descriptionHi?: string;
  visibilityCategory: ActivityCategory;
  actor: 'senior' | 'family' | 'system';
}

export interface SeniorProfile {
  id: string;
  displayName: string;
  displayNameHi: string;
  age: number;
  city: string;
  cityHi: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredLanguage: Language;
  fontSize: TextSize;
  highContrast: boolean;
  accessibilityMode: boolean;
  reducedMotion: boolean;
  voiceSpeechEnabled: boolean;
}

export interface FamilyProfile {
  id: string;
  displayName: string;
  displayNameHi: string;
  relationship: string;
  city: string;
  cityHi: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionSuggested?: {
    type: 'navigate' | 'checkin' | 'medicine' | 'privacy' | 'help' | 'emergency';
    label: string;
    payload?: string;
  };
}

export interface HelpRequest {
  id: string;
  status: 'active' | 'resolved' | 'cancelled';
  requestedAt: string;
  note?: string;
  contactName: string;
  contactPhone: string;
  isSimulatedDemo: boolean;
  resolvedAt?: string;
}

export interface RoutineInsight {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  reason: string;
  reasonHi: string;
  dates: string[];
  severity: 'info' | 'observation' | 'attention';
  detectedAt: string;
}
