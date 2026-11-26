import { SaanjhState } from '../types/saanjh';

export const ASSETS = {
  heroLiving: '/src/assets/images/hero_saanjh_living_1795630618126.jpg',
  familyConnection: '/src/assets/images/landing_family_connection_1795630618883.jpg',
  meeraAvatar: '/src/assets/images/avatar_meera_sharma_1795630619060.jpg',
  ananyaAvatar: '/src/assets/images/avatar_ananya_sharma_1795630619787.jpg',
};

export function getOffsetDateISO(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime12h(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function createInitialSeedState(): SaanjhState {
  const today = getOffsetDateISO(0);
  const d1 = getOffsetDateISO(-1);
  const d2 = getOffsetDateISO(-2);
  const d3 = getOffsetDateISO(-3);
  const d4 = getOffsetDateISO(-4);
  const d5 = getOffsetDateISO(-5);
  const d6 = getOffsetDateISO(-6);

  return {
    isAuthenticated: false,
    activeRole: 'senior',
    currentView: 'landing',
    seniorProfile: {
      name: 'Meera Sharma',
      age: 68,
      city: 'Pune, Maharashtra',
      avatarUrl: ASSETS.meeraAvatar,
      phoneLabel: 'Demo Profile · Local Only',
      emergencyNote: 'Prefers evening walks at 5:30 PM; allergic to penicillin.',
      preferredLanguage: 'en',
    },
    familyProfile: {
      name: 'Ananya Sharma',
      relationship: 'Daughter',
      city: 'Bengaluru, Karnataka',
      avatarUrl: ASSETS.ananyaAvatar,
      phoneLabel: 'Family Care Circle · Local Demo',
    },
    medicines: [
      {
        id: 'med-1',
        name: 'Amlodipine',
        dosage: '5 mg · 1 tablet',
        instructions: 'Take after breakfast with a full glass of water.',
        time: '08:30',
        timeSlot: 'Morning',
        active: true,
        takenToday: true,
        completedAt: '08:42',
        verificationType: 'user-confirmed',
        history: [
          { date: today, status: 'taken', confirmedAt: '08:42', verificationMethod: 'user-confirmed' },
          { date: d1, status: 'taken', confirmedAt: '08:35', verificationMethod: 'user-confirmed' },
          { date: d2, status: 'taken', confirmedAt: '08:50', verificationMethod: 'user-confirmed' },
          { date: d3, status: 'taken', confirmedAt: '08:40', verificationMethod: 'user-confirmed' },
          { date: d4, status: 'taken', confirmedAt: '09:05', verificationMethod: 'user-confirmed' },
          { date: d5, status: 'taken', confirmedAt: '08:30', verificationMethod: 'user-confirmed' },
          { date: d6, status: 'taken', confirmedAt: '08:45', verificationMethod: 'user-confirmed' },
        ],
      },
      {
        id: 'med-2',
        name: 'Vitamin D3 + Calcium',
        dosage: '1000 IU · 1 tablet',
        instructions: 'Take right after lunch for better absorption.',
        time: '13:30',
        timeSlot: 'Afternoon',
        active: true,
        takenToday: false,
        verificationType: 'unconfirmed',
        history: [
          { date: today, status: 'pending', verificationMethod: 'unconfirmed' },
          { date: d1, status: 'taken', confirmedAt: '13:45', verificationMethod: 'user-confirmed' },
          { date: d2, status: 'missed', verificationMethod: 'unconfirmed' },
          { date: d3, status: 'taken', confirmedAt: '13:38', verificationMethod: 'user-confirmed' },
          { date: d4, status: 'taken', confirmedAt: '14:00', verificationMethod: 'user-confirmed' },
          { date: d5, status: 'missed', verificationMethod: 'unconfirmed' },
          { date: d6, status: 'taken', confirmedAt: '13:50', verificationMethod: 'user-confirmed' },
        ],
      },
      {
        id: 'med-3',
        name: 'Metformin SR',
        dosage: '500 mg · 1 tablet',
        instructions: 'Take with evening tea or dinner.',
        time: '20:00',
        timeSlot: 'Evening',
        active: true,
        takenToday: false,
        verificationType: 'unconfirmed',
        history: [
          { date: today, status: 'pending', verificationMethod: 'unconfirmed' },
          { date: d1, status: 'taken', confirmedAt: '20:15', verificationMethod: 'user-confirmed' },
          { date: d2, status: 'taken', confirmedAt: '20:10', verificationMethod: 'user-confirmed' },
          { date: d3, status: 'taken', confirmedAt: '20:05', verificationMethod: 'user-confirmed' },
          { date: d4, status: 'missed', verificationMethod: 'unconfirmed' },
          { date: d5, status: 'taken', confirmedAt: '20:20', verificationMethod: 'user-confirmed' },
          { date: d6, status: 'taken', confirmedAt: '20:12', verificationMethod: 'user-confirmed' },
        ],
      },
      {
        id: 'med-4',
        name: 'Rosuvastatin',
        dosage: '10 mg · 1 tablet',
        instructions: 'Take at bedtime with warm water.',
        time: '21:45',
        timeSlot: 'Night',
        active: true,
        takenToday: false,
        verificationType: 'unconfirmed',
        history: [
          { date: today, status: 'pending', verificationMethod: 'unconfirmed' },
          { date: d1, status: 'taken', confirmedAt: '21:50', verificationMethod: 'user-confirmed' },
          { date: d2, status: 'taken', confirmedAt: '22:00', verificationMethod: 'user-confirmed' },
          { date: d3, status: 'taken', confirmedAt: '21:48', verificationMethod: 'user-confirmed' },
          { date: d4, status: 'taken', confirmedAt: '21:55', verificationMethod: 'user-confirmed' },
          { date: d5, status: 'taken', confirmedAt: '21:45', verificationMethod: 'user-confirmed' },
          { date: d6, status: 'taken', confirmedAt: '22:05', verificationMethod: 'user-confirmed' },
        ],
      },
    ],
    appointments: [
      {
        id: 'apt-1',
        doctorName: 'Dr. Arvind Kulkarni',
        specialty: 'General Physician',
        clinic: 'Sahyadri Neighbourhood Clinic, Kothrud',
        date: getOffsetDateISO(2),
        time: '10:30',
        notes: 'Routine blood pressure review and prescription renewal. Bring morning blood pressure notebook.',
        status: 'upcoming',
      },
      {
        id: 'apt-2',
        doctorName: 'Dr. Nandini Deshmukh',
        specialty: 'Ophthalmologist',
        clinic: 'Deenanath Eye Care Centre',
        date: getOffsetDateISO(9),
        time: '16:00',
        notes: 'Annual reading glasses checkup. Ananya may join on video call.',
        status: 'upcoming',
      },
      {
        id: 'apt-3',
        doctorName: 'Dr. Arvind Kulkarni',
        specialty: 'General Physician',
        clinic: 'Sahyadri Neighbourhood Clinic, Kothrud',
        date: getOffsetDateISO(-14),
        time: '11:00',
        notes: 'Quarterly check-in completed smoothly. Keep walking 25 minutes daily.',
        status: 'completed',
      },
    ],
    appointmentPreps: [
      {
        id: 'prep-1',
        appointmentId: 'apt-1',
        concerns: [
          'Mild knee stiffness after longer walks on Tuesday.',
          'Want to confirm if Vitamin D3 timing after lunch is ideal.',
        ],
        questions: [
          'Should I continue the same 5 mg Amlodipine dosage for the next 3 months?',
          'Are any blood tests needed before the next quarterly review?',
        ],
        summaryText:
          'Visit preparation for Dr. Arvind Kulkarni: Review mild knee stiffness after walks, confirm Vitamin D3 lunch timing, and ask about renewing Amlodipine 5 mg and upcoming routine lab work.',
        approved: false,
        updatedAt: `${d1} 18:10`,
      },
    ],
    wellbeingHistory: [
      {
        id: 'wb-1',
        date: d1,
        time: '09:15',
        mood: 'peaceful',
        note: 'Watered the tulsi and hibiscus plants on the balcony. Slept well.',
      },
      {
        id: 'wb-2',
        date: d2,
        time: '10:05',
        mood: 'tired',
        note: 'Knees felt a little stiff after yesterday’s market walk, rested in the afternoon.',
      },
      {
        id: 'wb-3',
        date: d4,
        time: '09:40',
        mood: 'good',
        note: 'Spoke with Ananya over morning tea. Had moong dal khichdi for lunch.',
      },
      {
        id: 'wb-4',
        date: d5,
        time: '11:20',
        mood: 'good',
        note: 'Enjoyed listening to old classical music in the afternoon.',
      },
      {
        id: 'wb-5',
        date: d6,
        time: '09:00',
        mood: 'peaceful',
        note: 'Calm Sunday morning with neighbours.',
      },
      {
        id: 'wb-6',
        date: getOffsetDateISO(-9),
        time: '09:30',
        mood: 'good',
        note: 'Went to the local park with Kavita.',
      },
      {
        id: 'wb-7',
        date: getOffsetDateISO(-12),
        time: '10:15',
        mood: 'peaceful',
        note: 'Cooked methi paratha and read the morning paper.',
      },
      {
        id: 'wb-8',
        date: getOffsetDateISO(-15),
        time: '09:50',
        mood: 'tired',
        note: 'Woke up early; took a quiet afternoon nap.',
      },
      {
        id: 'wb-9',
        date: getOffsetDateISO(-18),
        time: '09:10',
        mood: 'good',
        note: 'Video call with Rohan and kids.',
      },
      {
        id: 'wb-10',
        date: getOffsetDateISO(-21),
        time: '10:00',
        mood: 'peaceful',
        note: 'Enjoyed warm ginger tea on the terrace.',
      },
      {
        id: 'wb-11',
        date: getOffsetDateISO(-24),
        time: '09:20',
        mood: 'low',
        note: 'Rainy afternoon kept me indoors.',
      },
      {
        id: 'wb-12',
        date: getOffsetDateISO(-27),
        time: '09:45',
        mood: 'good',
        note: 'Felt refreshed after morning stretching.',
      },
    ],
    trustedContacts: [
      {
        id: 'tc-1',
        name: 'Ananya Sharma',
        relationship: 'Daughter · Primary Family Contact',
        phoneLabel: '+91 98XXX XX410 (Demo)',
        notes: 'Usually reachable after 10:00 AM; prefers WhatsApp/call.',
        isDefault: true,
      },
      {
        id: 'tc-2',
        name: 'Rohan Sharma',
        relationship: 'Son · Mumbai',
        phoneLabel: '+91 98XXX XX722 (Demo)',
        notes: 'Available evenings and weekends.',
        isDefault: false,
      },
      {
        id: 'tc-3',
        name: 'Kavita Joshi',
        relationship: 'Sister · Nearby in Pune',
        phoneLabel: '+91 97XXX XX119 (Demo)',
        notes: 'Lives 15 minutes away in Prabhat Road.',
        isDefault: false,
      },
    ],
    helpRequests: [],
    privacy: {
      medicines: true,
      appointments: true,
      wellbeing: true,
      insights: true,
      generalActivity: true,
      careCircle: true,
      documents: true,
    },
    privacyLogs: [
      {
        id: 'pl-1',
        timestamp: `${d3} 10:00`,
        category: 'medicines',
        action: 'granted',
        note: 'Initial family sharing set for Care Circle',
      },
    ],
    accessibility: {
      largeText: false,
      highContrast: false,
      reducedMotion: false,
      largeTouchTargets: false,
      simplifiedNav: false,
      voiceAutoRead: true,
    },
    familyMembers: [
      {
        id: 'fm-1',
        name: 'Ananya Sharma',
        relationship: 'Daughter',
        city: 'Bengaluru',
        role: 'Primary Coordinator',
        contactLabel: 'ananya.sharma@example.com (Demo)',
        status: 'active',
        invitedAt: getOffsetDateISO(-30),
      },
      {
        id: 'fm-2',
        name: 'Rohan Sharma',
        relationship: 'Son',
        city: 'Mumbai',
        role: 'Care Circle Member',
        contactLabel: 'rohan.sharma@example.com (Demo)',
        status: 'active',
        invitedAt: getOffsetDateISO(-25),
      },
      {
        id: 'fm-3',
        name: 'Kavita Joshi',
        relationship: 'Sister',
        city: 'Pune',
        role: 'Care Circle Member',
        contactLabel: 'kavita.joshi@example.com (Demo)',
        status: 'active',
        invitedAt: getOffsetDateISO(-12),
      },
    ],
    careTasks: [
      {
        id: 'ct-1',
        title: 'Refill Amlodipine 5 mg and Metformin SR strip',
        assignedToId: 'fm-3',
        dueDate: getOffsetDateISO(1),
        category: 'Medicines',
        notes: 'Pick up from Wellness Pharmacy near Kothrud stand.',
        status: 'in-progress',
      },
      {
        id: 'ct-2',
        title: 'Join Dr. Kulkarni clinic visit on speakerphone',
        assignedToId: 'fm-1',
        dueDate: getOffsetDateISO(2),
        category: 'Clinic Visit',
        notes: 'Review Meera’s approved visit summary beforehand.',
        status: 'pending',
      },
      {
        id: 'ct-3',
        title: 'Weekly Sunday afternoon video call with grandchildren',
        assignedToId: 'fm-2',
        dueDate: getOffsetDateISO(4),
        category: 'Check-in Call',
        notes: 'Around 5:00 PM after Meera’s evening tea.',
        status: 'pending',
      },
    ],
    sharedVisits: [
      {
        id: 'sv-1',
        memberId: 'fm-3',
        title: 'Evening tea & pharmacy drop-off',
        date: getOffsetDateISO(1),
        time: '17:00',
        purpose: 'Deliver refilled strips and spend an hour chatting.',
        status: 'planned',
      },
      {
        id: 'sv-2',
        memberId: 'fm-1',
        title: 'Weekend visit to Pune',
        date: getOffsetDateISO(6),
        time: '11:00',
        purpose: 'Staying Saturday–Sunday to organize prescriptions.',
        status: 'planned',
      },
    ],
    routineActivities: [
      {
        id: 'ra-1',
        title: 'Morning warm water (1 glass)',
        category: 'hydration',
        date: today,
        time: '07:30',
        notes: 'Gentle start before breakfast.',
        status: 'completed',
        completedAt: '07:40',
      },
      {
        id: 'ra-2',
        title: 'Mid-morning water & fruit',
        category: 'hydration',
        date: today,
        time: '11:00',
        notes: '1 glass water with seasonal papaya or apple.',
        status: 'completed',
        completedAt: '11:10',
      },
      {
        id: 'ra-3',
        title: 'Afternoon rest & hydration',
        category: 'rest',
        date: today,
        time: '15:00',
        notes: '20 minutes quiet rest and 1 glass of water.',
        status: 'pending',
      },
      {
        id: 'ra-4',
        title: 'Evening park walk',
        category: 'activity',
        date: today,
        time: '17:30',
        notes: '20–25 minute gentle walk at comfortable pace.',
        status: 'pending',
      },
    ],
    documents: [
      {
        id: 'doc-1',
        title: 'Blood Pressure & Diabetes Prescription',
        category: 'Prescription',
        documentDate: getOffsetDateISO(-14),
        source: 'Dr. Arvind Kulkarni · Sahyadri Clinic',
        description:
          'Active daily prescription for Amlodipine 5 mg, Metformin SR 500 mg, Rosuvastatin 10 mg, and Vitamin D3.',
        attachmentName: 'kulkarni_prescription_nov.pdf (demo metadata)',
        sharedWithFamily: true,
      },
      {
        id: 'doc-2',
        title: 'Quarterly HbA1c & Lipid Profile Report',
        category: 'Lab Report',
        documentDate: getOffsetDateISO(-18),
        source: 'Deenanath Diagnostics, Pune',
        description:
          'Routine quarterly blood panel brought to Dr. Kulkarni’s consultation.',
        attachmentName: 'lab_panel_q4.pdf (demo metadata)',
        sharedWithFamily: true,
      },
      {
        id: 'doc-3',
        title: 'Personal Care & Insurance Card Note',
        category: 'Insurance / ID',
        documentDate: getOffsetDateISO(-40),
        source: 'Personal Records',
        description:
          'Senior citizen health policy number and clinic registration ID.',
        sharedWithFamily: false,
      },
    ],
    activities: [
      {
        id: 'act-1',
        timestamp: `${today} 08:42`,
        category: 'medicines',
        title: 'Morning medicine confirmed',
        detail: 'Meera marked Amlodipine 5 mg as taken.',
      },
      {
        id: 'act-2',
        timestamp: `${d1} 09:15`,
        category: 'wellbeing',
        title: 'Daily wellbeing check-in saved',
        detail: 'Meera shared that she was feeling Peaceful.',
      },
      {
        id: 'act-3',
        timestamp: `${d2} 16:30`,
        category: 'appointments',
        title: 'Appointment confirmed',
        detail: 'Visit with Dr. Arvind Kulkarni scheduled.',
      },
    ],
    assistantMessages: [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Namaste Meera ji. I am Saanjh, your local daily care companion. You can ask me about your medicines today, your next doctor appointment, or say a reminder like "Remind me to drink water at 4 PM" to turn it into a task.',
        language: 'en',
        timestamp: '08:30',
        dataSources: ['Local routine records'],
      },
    ],
    demoChecklistCompleted: [],
  };
}
