import {
  SeniorProfile,
  FamilyProfile,
  Medicine,
  Appointment,
  WellbeingCheckIn,
  ConsentSettings,
  ActivityEvent,
} from '../types';

export const INITIAL_SENIOR_PROFILE: SeniorProfile = {
  id: 'senior_meera_sharma_01',
  displayName: 'Meera Sharma',
  displayNameHi: 'मीरा शर्मा',
  age: 74,
  city: 'South Delhi',
  cityHi: 'दक्षिण दिल्ली',
  emergencyContact: {
    name: 'Ananya Sharma',
    relationship: 'Daughter (बेटी)',
    phone: '+91 98765 43210 (Demo Only)',
  },
  preferredLanguage: 'en',
  fontSize: 'standard',
  highContrast: false,
  accessibilityMode: false,
  reducedMotion: false,
  voiceSpeechEnabled: true,
};

export const INITIAL_FAMILY_PROFILE: FamilyProfile = {
  id: 'family_ananya_sharma_01',
  displayName: 'Ananya Sharma',
  displayNameHi: 'अनन्या शर्मा',
  relationship: 'Daughter',
  city: 'Mumbai',
  cityHi: 'मुंबई',
};

// Returns today's date formatted as YYYY-MM-DD
export function getTodayDateString(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med_01',
    name: 'Metformin',
    dosage: '500 mg',
    reminderTime: '08:30 AM',
    timeSlot: 'morning',
    instructions: 'Take 1 tablet after breakfast with warm water',
    scheduledDate: getTodayDateString(0),
    status: 'taken',
    takenAt: '08:42 AM',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'med_02',
    name: 'Calcium + Vitamin D3',
    dosage: '500 mg / 400 IU',
    reminderTime: '10:30 AM',
    timeSlot: 'morning',
    instructions: 'Chew 1 tablet with milk or water',
    scheduledDate: getTodayDateString(0),
    status: 'taken',
    takenAt: '10:35 AM',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'med_03',
    name: 'Amlodipine',
    dosage: '5 mg',
    reminderTime: '01:30 PM',
    timeSlot: 'afternoon',
    instructions: 'Take 1 tablet after lunch for blood pressure regulation',
    scheduledDate: getTodayDateString(0),
    status: 'upcoming',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'med_04',
    name: 'Atorvastatin',
    dosage: '10 mg',
    reminderTime: '08:30 PM',
    timeSlot: 'night',
    instructions: 'Take 1 tablet before bedtime for cholesterol',
    scheduledDate: getTodayDateString(0),
    status: 'upcoming',
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_01',
    doctorName: 'Dr. Rajesh Kulkarni',
    specialty: 'Cardiologist (हृदय रोग विशेषज्ञ)',
    clinicName: 'Fortis Health Center, Greater Kailash',
    date: getTodayDateString(1), // Tomorrow
    time: '11:30 AM',
    notes: 'Routine quarterly checkup & blood pressure review. Bring recent blood sugar report.',
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt_02',
    doctorName: 'Dr. Sunita Mehra',
    specialty: 'Ophthalmologist (नेत्र विशेषज्ञ)',
    clinicName: 'Vision Care Clinic, Saket',
    date: getTodayDateString(-7), // 7 days ago
    time: '04:00 PM',
    notes: 'Annual vision checkup. Cataract assessment confirmed clear vision.',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_WELLBEING_LOGS: WellbeingCheckIn[] = [
  {
    id: 'wb_01',
    response: 'well',
    note: 'Slept soundly for 7 hours. Did 20 minutes light walking in the society park.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    date: getTodayDateString(0),
    sharingPermissionApplied: false,
  },
  {
    id: 'wb_02',
    response: 'okay',
    note: 'Slight knee stiffness in the morning, feeling better after gentle stretching and warm compress.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    date: getTodayDateString(-1),
    sharingPermissionApplied: false,
  },
  {
    id: 'wb_03',
    response: 'well',
    note: 'Had tea on the balcony with Sarla ji. Feeling relaxed and energetic today.',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    date: getTodayDateString(-2),
    sharingPermissionApplied: false,
  },
  {
    id: 'wb_04',
    response: 'support',
    note: 'Felt slight dizziness in the afternoon heat. Drank lemon water and rested on the recliner.',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
    date: getTodayDateString(-3),
    sharingPermissionApplied: false,
  },
  {
    id: 'wb_05',
    response: 'well',
    note: 'Morning prayer and light yoga. Everything feels peaceful.',
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), // 4 days ago
    date: getTodayDateString(-4),
    sharingPermissionApplied: false,
  },
];

// Requirement 12: "Default optional sharing to OFF."
export const INITIAL_CONSENT_SETTINGS: ConsentSettings = {
  medicineStatusSharing: false,
  wellbeingSummarySharing: false,
  appointmentSharing: false,
  activitySharing: false,
  authorizedFamilyMember: 'Ananya Sharma',
  relationship: 'Daughter (बेटी)',
  lastUpdated: new Date().toISOString(),
};

export const INITIAL_ACTIVITY_LOGS: ActivityEvent[] = [
  {
    id: 'act_01',
    eventType: 'MEDICINE_TAKEN',
    timestamp: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
    description: 'Metformin 500 mg confirmed taken at 08:42 AM',
    descriptionHi: 'मेटफॉर्मिन 500 mg सुबह 08:42 पर ली गई',
    visibilityCategory: 'medicine',
    actor: 'senior',
  },
  {
    id: 'act_02',
    eventType: 'MEDICINE_TAKEN',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    description: 'Calcium + Vitamin D3 confirmed taken at 10:35 AM',
    descriptionHi: 'कैल्शियम + विटामिन D3 सुबह 10:35 पर ली गई',
    visibilityCategory: 'medicine',
    actor: 'senior',
  },
  {
    id: 'act_03',
    eventType: 'WELLBEING_LOGGED',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    description: 'Daily wellbeing check-in completed: Feeling Well',
    descriptionHi: 'दैनिक स्वास्थ्य जांच पूर्ण: सब ठीक और अच्छा लग रहा है',
    visibilityCategory: 'wellbeing',
    actor: 'senior',
  },
  {
    id: 'act_04',
    eventType: 'CONSENT_CONFIGURED',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    description: 'Consent preferences verified: Privacy controls active',
    descriptionHi: 'सहमति सेटिंग्स सत्यापित: गोपनीयता नियंत्रण सक्रिय',
    visibilityCategory: 'consent',
    actor: 'senior',
  },
];
