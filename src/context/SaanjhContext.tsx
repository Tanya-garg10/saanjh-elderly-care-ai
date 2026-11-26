import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AccessibilitySettings,
  ActivityEvent,
  AppView,
  Appointment,
  AppointmentPrep,
  AssistantLanguage,
  CareTask,
  CareTaskStatus,
  FamilyMember,
  HealthDocument,
  Medicine,
  MoodOption,
  PrivacyPermissions,
  RoutineActivity,
  RoutineInsight,
  SaanjhState,
  SharedVisit,
  TrustedContact,
  UserRole,
} from '../types/saanjh';
import {
  createInitialSeedState,
  formatDisplayDate,
  getCurrentTimeHHMM,
  getOffsetDateISO,
} from '../data/seedData';
import { generateRuleBasedReply } from '../utils/assistantEngine';

const STORAGE_KEY = 'saanjh_care_state_v1';

interface SaanjhContextValue {
  state: SaanjhState;
  insights: RoutineInsight[];
  navigate: (view: AppView) => void;
  loginAsDemo: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  toggleMedicineTaken: (id: string) => void;
  addMedicine: (med: Omit<Medicine, 'id' | 'takenToday' | 'verificationType' | 'history'>) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  saveAppointmentPrep: (prep: Omit<AppointmentPrep, 'id' | 'updatedAt'>) => void;
  saveWellbeingCheckIn: (mood: MoodOption, note: string) => void;
  addTrustedContact: (contact: Omit<TrustedContact, 'id'>) => void;
  deleteTrustedContact: (id: string) => void;
  submitHelpRequest: (reason: string, message: string, trustedContactId?: string) => void;
  acknowledgeHelpRequestDemo: (id: string) => void;
  togglePrivacyPermission: (category: keyof PrivacyPermissions) => void;
  revokeAllPrivacyPermissions: () => void;
  updateAccessibility: (updates: Partial<AccessibilitySettings>) => void;
  updateSeniorProfile: (updates: Partial<SaanjhState['seniorProfile']>) => void;
  inviteFamilyMember: (member: Omit<FamilyMember, 'id' | 'status' | 'invitedAt'>) => void;
  addCareTask: (task: Omit<CareTask, 'id'>) => void;
  updateCareTaskStatus: (id: string, status: CareTaskStatus) => void;
  deleteCareTask: (id: string) => void;
  addSharedVisit: (visit: Omit<SharedVisit, 'id'>) => void;
  toggleSharedVisitStatus: (id: string) => void;
  deleteSharedVisit: (id: string) => void;
  addRoutineActivity: (activity: Omit<RoutineActivity, 'id'>) => void;
  updateRoutineActivity: (id: string, updates: Partial<RoutineActivity>) => void;
  postponeRoutineActivity: (id: string, minutes?: number) => void;
  deleteRoutineActivity: (id: string) => void;
  addDocument: (doc: Omit<HealthDocument, 'id'>) => void;
  updateDocument: (id: string, updates: Partial<HealthDocument>) => void;
  deleteDocument: (id: string) => void;
  sendAssistantMessage: (text: string, language: AssistantLanguage) => string;
  toggleDemoStep: (stepId: string) => void;
  resetDemoData: () => void;
}

const SaanjhContext = createContext<SaanjhContextValue | null>(null);

function loadPersistedState(): SaanjhState {
  const defaults = createInitialSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<SaanjhState>;
    if (!parsed || !parsed.seniorProfile || !Array.isArray(parsed.medicines)) {
      return defaults;
    }
    return {
      ...defaults,
      ...parsed,
      privacy: {
        ...defaults.privacy,
        ...(parsed.privacy ?? {}),
      },
      accessibility: {
        ...defaults.accessibility,
        ...(parsed.accessibility ?? {}),
      },
      familyMembers: parsed.familyMembers ?? defaults.familyMembers,
      careTasks: parsed.careTasks ?? defaults.careTasks,
      sharedVisits: parsed.sharedVisits ?? defaults.sharedVisits,
      appointmentPreps: parsed.appointmentPreps ?? defaults.appointmentPreps,
      routineActivities: parsed.routineActivities ?? defaults.routineActivities,
      documents: parsed.documents ?? defaults.documents,
      trustedContacts: parsed.trustedContacts ?? defaults.trustedContacts,
    };
  } catch {
    return defaults;
  }
}

export const SaanjhProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SaanjhState>(() => loadPersistedState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('a11y-large-text', state.accessibility.largeText);
    root.classList.toggle('a11y-high-contrast', state.accessibility.highContrast);
    root.classList.toggle('a11y-reduced-motion', state.accessibility.reducedMotion);
    root.classList.toggle('a11y-large-targets', state.accessibility.largeTouchTargets);
  }, [state.accessibility]);

  const insights = useMemo<RoutineInsight[]>(() => {
    const list: RoutineInsight[] = [];
    const today = getOffsetDateISO(0);
    const yesterday = getOffsetDateISO(-1);

    const todayWellbeing = state.wellbeingHistory.find((w) => w.date === today);
    const recent7DaysCount = state.wellbeingHistory.filter(
      (w) => w.date >= getOffsetDateISO(-6) && w.date <= today
    ).length;

    if (!todayWellbeing && state.wellbeingHistory.length > 0) {
      list.push({
        id: 'ins-checkin-today',
        category: 'wellbeing',
        title: 'Today’s wellbeing check-in is still open',
        summary: 'No wellbeing reflection has been saved yet for today.',
        explanation: `Appears because ${recent7DaysCount} check-ins were recorded over the past 7 days, and today (${formatDisplayDate(today)}) does not have an entry yet.`,
        timeframe: 'Today',
      });
    } else if (state.wellbeingHistory.length >= 3) {
      const tiredOrLow = state.wellbeingHistory
        .slice(0, 5)
        .filter((w) => w.mood === 'tired' || w.mood === 'low' || w.mood === 'anxious');
      if (tiredOrLow.length > 0) {
        list.push({
          id: 'ins-wellbeing-shift',
          category: 'wellbeing',
          title: 'Your check-in pattern changed this week',
          summary: `${tiredOrLow.length} of your recent ${Math.min(5, state.wellbeingHistory.length)} check-ins noted feeling ${tiredOrLow.map((w) => w.mood).join(' or ')}.`,
          explanation:
            'Appears directly from the mood labels you selected in Daily Wellbeing. This is a gentle summary of your notes, not a medical assessment.',
          timeframe: 'Past 7 days',
        });
      }
    }

    const activeMeds = state.medicines.filter((m) => m.active);
    if (activeMeds.length > 0) {
      const takenTodayCount = activeMeds.filter((m) => m.takenToday).length;
      const missedYesterday = activeMeds.filter((m) =>
        m.history.some((h) => h.date === yesterday && h.status === 'missed')
      );
      const totalRecordedEntries = activeMeds.reduce((acc, m) => acc + m.history.length, 0);
      const confirmedEntries = activeMeds.reduce(
        (acc, m) => acc + m.history.filter((h) => h.status === 'taken').length,
        0
      );

      if (totalRecordedEntries > 0) {
        const pct = Math.round((confirmedEntries / totalRecordedEntries) * 100);
        list.push({
          id: 'ins-med-adherence',
          category: 'medicines',
          title: `${takenTodayCount} of ${activeMeds.length} active reminders confirmed today`,
          summary: `Across the last 7 days, ${confirmedEntries} of ${totalRecordedEntries} scheduled entries (${pct}%) were marked as taken by the user.`,
          explanation:
            'Calculated directly from your manual "Mark as Taken" confirmations in the Medicine Schedule.',
          timeframe: 'Past 7 days',
        });
      }

      if (missedYesterday.length > 0) {
        list.push({
          id: 'ins-med-missed-recent',
          category: 'medicines',
          title: 'Changes in recorded medicine reminder completion',
          summary: `${missedYesterday.map((m) => m.name).join(', ')} had an unconfirmed entry yesterday.`,
          explanation:
            'Appears because one or more active schedules had a "missed" status in yesterday’s log.',
          timeframe: 'Yesterday',
        });
      }
    }

    const upcoming = state.appointments
      .filter((a) => a.status === 'upcoming' && a.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (upcoming.length > 0) {
      const next = upcoming[0];
      list.push({
        id: 'ins-upcoming-apt',
        category: 'appointments',
        title: `Upcoming visit with ${next.doctorName}`,
        summary: `Scheduled for ${formatDisplayDate(next.date)} at ${next.clinic}.`,
        explanation:
          'Appears because you have an appointment marked "upcoming" in your Appointments list.',
        timeframe: formatDisplayDate(next.date),
      });
    }

    return list;
  }, [state.medicines, state.wellbeingHistory, state.appointments]);

  const navigate = (view: AppView) => {
    setState((prev) => ({ ...prev, currentView: view }));
    window.scrollTo({ top: 0, behavior: state.accessibility.reducedMotion ? 'auto' : 'smooth' });
  };

  const loginAsDemo = (role: UserRole) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      activeRole: role,
      currentView: role === 'senior' ? 'senior-dashboard' : 'family-dashboard',
    }));
  };

  const switchRole = (role: UserRole) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      activeRole: role,
      currentView: role === 'senior' ? 'senior-dashboard' : 'family-dashboard',
    }));
  };

  const logout = () => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      currentView: 'landing',
    }));
  };

  const toggleMedicineTaken = (id: string) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    setState((prev) => {
      const target = prev.medicines.find((m) => m.id === id);
      if (!target) return prev;
      const nextTaken = !target.takenToday;

      const updatedMeds = prev.medicines.map((med) => {
        if (med.id !== id) return med;
        const hasTodayEntry = med.history.some((h) => h.date === today);
        const updatedHistory = hasTodayEntry
          ? med.history.map((h) =>
              h.date === today
                ? {
                    ...h,
                    status: (nextTaken ? 'taken' : 'pending') as 'taken' | 'pending',
                    confirmedAt: nextTaken ? nowTime : undefined,
                    verificationMethod: (nextTaken ? 'user-confirmed' : 'unconfirmed') as
                      | 'user-confirmed'
                      | 'unconfirmed',
                  }
                : h
            )
          : [
              {
                date: today,
                status: (nextTaken ? 'taken' : 'pending') as 'taken' | 'pending',
                confirmedAt: nextTaken ? nowTime : undefined,
                verificationMethod: (nextTaken ? 'user-confirmed' : 'unconfirmed') as
                  | 'user-confirmed'
                  | 'unconfirmed',
              },
              ...med.history,
            ];

        return {
          ...med,
          takenToday: nextTaken,
          completedAt: nextTaken ? nowTime : undefined,
          verificationType: (nextTaken ? 'user-confirmed' : 'unconfirmed') as
            | 'user-confirmed'
            | 'unconfirmed',
          history: updatedHistory,
        };
      });

      const activity: ActivityEvent = {
        id: `act-${Date.now()}`,
        timestamp: `${today} ${nowTime}`,
        category: 'medicines',
        title: nextTaken ? `Confirmed ${target.name}` : `Marked ${target.name} as pending`,
        detail: nextTaken
          ? `${prev.seniorProfile.name} confirmed taking ${target.name} (${target.dosage}).`
          : `${prev.seniorProfile.name} reset today’s confirmation for ${target.name}.`,
      };

      return {
        ...prev,
        medicines: updatedMeds,
        activities: [activity, ...prev.activities].slice(0, 20),
      };
    });
  };

  const addMedicine = (med: Omit<Medicine, 'id' | 'takenToday' | 'verificationType' | 'history'>) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    const newMed: Medicine = {
      ...med,
      id: `med-${Date.now()}`,
      takenToday: false,
      verificationType: 'unconfirmed',
      history: [{ date: today, status: 'pending', verificationMethod: 'unconfirmed' }],
    };
    const activity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: `${today} ${nowTime}`,
      category: 'medicines',
      title: `Added ${med.name}`,
      detail: `Scheduled daily at ${med.time} (${med.dosage}).`,
    };
    setState((prev) => ({
      ...prev,
      medicines: [...prev.medicines, newMed],
      activities: [activity, ...prev.activities].slice(0, 20),
    }));
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setState((prev) => ({
      ...prev,
      medicines: prev.medicines.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  };

  const deleteMedicine = (id: string) => {
    setState((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((m) => m.id !== id),
    }));
  };

  const addAppointment = (apt: Omit<Appointment, 'id'>) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    const newApt: Appointment = { ...apt, id: `apt-${Date.now()}` };
    const activity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: `${today} ${nowTime}`,
      category: 'appointments',
      title: `Scheduled visit with ${apt.doctorName}`,
      detail: `${formatDisplayDate(apt.date)} at ${apt.clinic}.`,
    };
    setState((prev) => ({
      ...prev,
      appointments: [...prev.appointments, newApt],
      activities: [activity, ...prev.activities].slice(0, 20),
    }));
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  };

  const deleteAppointment = (id: string) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.filter((a) => a.id !== id),
      appointmentPreps: prev.appointmentPreps.filter((p) => p.appointmentId !== id),
    }));
  };

  const saveAppointmentPrep = (prep: Omit<AppointmentPrep, 'id' | 'updatedAt'>) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    setState((prev) => {
      const existing = prev.appointmentPreps.find((p) => p.appointmentId === prep.appointmentId);
      const updatedPreps = existing
        ? prev.appointmentPreps.map((p) =>
            p.appointmentId === prep.appointmentId
              ? { ...p, ...prep, updatedAt: `${today} ${nowTime}` }
              : p
          )
        : [
            ...prev.appointmentPreps,
            { ...prep, id: `prep-${Date.now()}`, updatedAt: `${today} ${nowTime}` },
          ];
      return {
        ...prev,
        appointmentPreps: updatedPreps,
      };
    });
  };

  const saveWellbeingCheckIn = (mood: MoodOption, note: string) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    setState((prev) => {
      const existingToday = prev.wellbeingHistory.find((w) => w.date === today);
      const updatedHistory = existingToday
        ? prev.wellbeingHistory.map((w) =>
            w.date === today ? { ...w, mood, note: note.trim(), time: nowTime } : w
          )
        : [
            {
              id: `wb-${Date.now()}`,
              date: today,
              time: nowTime,
              mood,
              note: note.trim(),
            },
            ...prev.wellbeingHistory,
          ];

      const activity: ActivityEvent = {
        id: `act-${Date.now()}`,
        timestamp: `${today} ${nowTime}`,
        category: 'wellbeing',
        title: 'Wellbeing check-in saved',
        detail: `${prev.seniorProfile.name} shared feeling ${mood}.`,
      };

      return {
        ...prev,
        wellbeingHistory: updatedHistory,
        activities: [activity, ...prev.activities].slice(0, 20),
      };
    });
  };

  const addTrustedContact = (contact: Omit<TrustedContact, 'id'>) => {
    const newContact: TrustedContact = { ...contact, id: `tc-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      trustedContacts: contact.isDefault
        ? [...prev.trustedContacts.map((c) => ({ ...c, isDefault: false })), newContact]
        : [...prev.trustedContacts, newContact],
    }));
  };

  const deleteTrustedContact = (id: string) => {
    setState((prev) => ({
      ...prev,
      trustedContacts: prev.trustedContacts.filter((c) => c.id !== id),
    }));
  };

  const submitHelpRequest = (reason: string, message: string, trustedContactId?: string) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    setState((prev) => {
      const contact = prev.trustedContacts.find((c) => c.id === trustedContactId);
      const newReq = {
        id: `help-${Date.now()}`,
        createdAt: `${today} ${nowTime}`,
        reason,
        message: message.trim(),
        trustedContactId: contact?.id,
        trustedContactName: contact?.name,
        status: 'saved-locally' as const,
        transmissionNotice:
          'Saved locally on this device only. No live SMS, call, or external alert is transmitted in this offline demo.',
      };
      const activity: ActivityEvent = {
        id: `act-${Date.now()}`,
        timestamp: `${today} ${nowTime}`,
        category: 'help',
        title: 'Support request recorded locally',
        detail: `Reason: ${reason}${contact ? ` · Intended for ${contact.name}` : ''}.`,
      };
      return {
        ...prev,
        helpRequests: [newReq, ...prev.helpRequests],
        activities: [activity, ...prev.activities].slice(0, 20),
      };
    });
  };

  const acknowledgeHelpRequestDemo = (id: string) => {
    setState((prev) => ({
      ...prev,
      helpRequests: prev.helpRequests.map((h) =>
        h.id === id ? { ...h, status: 'acknowledged-demo' } : h
      ),
    }));
  };

  const togglePrivacyPermission = (category: keyof PrivacyPermissions) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    setState((prev) => {
      const nextValue = !prev.privacy[category];
      const activity: ActivityEvent = {
        id: `act-${Date.now()}`,
        timestamp: `${today} ${nowTime}`,
        category: 'privacy',
        title: nextValue ? `Shared ${category}` : `Paused ${category} sharing`,
        detail: nextValue
          ? `${prev.familyProfile.name} can now view ${category}.`
          : `${prev.familyProfile.name} can no longer view ${category}.`,
      };
      return {
        ...prev,
        privacy: { ...prev.privacy, [category]: nextValue },
        privacyLogs: [
          {
            id: `pl-${Date.now()}`,
            timestamp: `${today} ${nowTime}`,
            category,
            action: nextValue ? 'granted' : 'revoked',
            note: nextValue
              ? `Enabled ${category} sharing with family`
              : `Paused ${category} sharing — hidden from Family views`,
          },
          ...prev.privacyLogs,
        ],
        activities: [activity, ...prev.activities].slice(0, 20),
      };
    });
  };

  const revokeAllPrivacyPermissions = () => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    setState((prev) => ({
      ...prev,
      privacy: {
        medicines: false,
        appointments: false,
        wellbeing: false,
        insights: false,
        generalActivity: false,
        careCircle: false,
        documents: false,
      },
      privacyLogs: [
        {
          id: `pl-${Date.now()}`,
          timestamp: `${today} ${nowTime}`,
          category: 'generalActivity',
          action: 'revoked',
          note: `All family sharing categories paused`,
        },
        ...prev.privacyLogs,
      ],
    }));
  };

  const updateAccessibility = (updates: Partial<AccessibilitySettings>) => {
    setState((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, ...updates },
    }));
  };

  const updateSeniorProfile = (updates: Partial<SaanjhState['seniorProfile']>) => {
    setState((prev) => ({
      ...prev,
      seniorProfile: { ...prev.seniorProfile, ...updates },
    }));
  };

  const inviteFamilyMember = (member: Omit<FamilyMember, 'id' | 'status' | 'invitedAt'>) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    const newMember: FamilyMember = {
      ...member,
      id: `fm-${Date.now()}`,
      status: 'invited',
      invitedAt: today,
    };
    const activity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: `${today} ${nowTime}`,
      category: 'care-circle',
      title: `Invited ${member.name} to Care Circle`,
      detail: `${member.relationship} · ${member.city}`,
    };
    setState((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember],
      activities: [activity, ...prev.activities].slice(0, 20),
    }));
  };

  const addCareTask = (task: Omit<CareTask, 'id'>) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    const newTask: CareTask = { ...task, id: `ct-${Date.now()}` };
    const activity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: `${today} ${nowTime}`,
      category: 'care-circle',
      title: `Assigned task: ${task.title}`,
      detail: `Category: ${task.category} · Due ${formatDisplayDate(task.dueDate)}`,
    };
    setState((prev) => ({
      ...prev,
      careTasks: [newTask, ...prev.careTasks],
      activities: [activity, ...prev.activities].slice(0, 20),
    }));
  };

  const updateCareTaskStatus = (id: string, status: CareTaskStatus) => {
    setState((prev) => ({
      ...prev,
      careTasks: prev.careTasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
  };

  const deleteCareTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      careTasks: prev.careTasks.filter((t) => t.id !== id),
    }));
  };

  const addSharedVisit = (visit: Omit<SharedVisit, 'id'>) => {
    const newVisit: SharedVisit = { ...visit, id: `sv-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      sharedVisits: [...prev.sharedVisits, newVisit],
    }));
  };

  const toggleSharedVisitStatus = (id: string) => {
    setState((prev) => ({
      ...prev,
      sharedVisits: prev.sharedVisits.map((v) =>
        v.id === id ? { ...v, status: v.status === 'planned' ? 'completed' : 'planned' } : v
      ),
    }));
  };

  const deleteSharedVisit = (id: string) => {
    setState((prev) => ({
      ...prev,
      sharedVisits: prev.sharedVisits.filter((v) => v.id !== id),
    }));
  };

  const addRoutineActivity = (activity: Omit<RoutineActivity, 'id'>) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    const newItem: RoutineActivity = { ...activity, id: `ra-${Date.now()}` };
    const event: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: `${today} ${nowTime}`,
      category: 'routine',
      title: `Added routine activity: ${activity.title}`,
      detail: `Scheduled for ${formatDisplayDate(activity.date)} at ${activity.time}`,
    };
    setState((prev) => ({
      ...prev,
      routineActivities: [...prev.routineActivities, newItem],
      activities: [event, ...prev.activities].slice(0, 20),
    }));
  };

  const updateRoutineActivity = (id: string, updates: Partial<RoutineActivity>) => {
    const nowTime = getCurrentTimeHHMM();
    setState((prev) => ({
      ...prev,
      routineActivities: prev.routineActivities.map((r) => {
        if (r.id !== id) return r;
        const completedAt =
          updates.status === 'completed' ? nowTime : updates.status ? undefined : r.completedAt;
        return { ...r, ...updates, completedAt };
      }),
    }));
  };

  const postponeRoutineActivity = (id: string, minutes = 60) => {
    setState((prev) => ({
      ...prev,
      routineActivities: prev.routineActivities.map((r) => {
        if (r.id !== id) return r;
        const [h, m] = r.time.split(':').map(Number);
        const total = (h * 60 + m + minutes) % (24 * 60);
        const nextH = String(Math.floor(total / 60)).padStart(2, '0');
        const nextM = String(total % 60).padStart(2, '0');
        return { ...r, time: `${nextH}:${nextM}`, status: 'postponed' };
      }),
    }));
  };

  const deleteRoutineActivity = (id: string) => {
    setState((prev) => ({
      ...prev,
      routineActivities: prev.routineActivities.filter((r) => r.id !== id),
    }));
  };

  const addDocument = (doc: Omit<HealthDocument, 'id'>) => {
    const today = getOffsetDateISO(0);
    const nowTime = getCurrentTimeHHMM();
    const newDoc: HealthDocument = { ...doc, id: `doc-${Date.now()}` };
    const activity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: `${today} ${nowTime}`,
      category: 'documents',
      title: `Saved document: ${doc.title}`,
      detail: `${doc.category} · ${doc.sharedWithFamily ? 'Shared with family' : 'Private'}`,
    };
    setState((prev) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
      activities: [activity, ...prev.activities].slice(0, 20),
    }));
  };

  const updateDocument = (id: string, updates: Partial<HealthDocument>) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const deleteDocument = (id: string) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }));
  };

  const sendAssistantMessage = (text: string, language: AssistantLanguage): string => {
    const cleanText = text.trim();
    if (!cleanText) return '';
    const nowTime = getCurrentTimeHHMM();
    const reply = generateRuleBasedReply(cleanText, language, state);

    const userMsg = {
      id: `msg-u-${Date.now()}`,
      sender: 'user' as const,
      text: cleanText,
      language,
      timestamp: nowTime,
    };

    const assistantMsg = {
      id: `msg-a-${Date.now() + 1}`,
      sender: 'assistant' as const,
      text: reply.text,
      language,
      timestamp: nowTime,
      dataSources: reply.dataSources,
    };

    setState((prev) => ({
      ...prev,
      assistantMessages: [...prev.assistantMessages, userMsg, assistantMsg],
    }));

    return reply.text;
  };

  const toggleDemoStep = (stepId: string) => {
    setState((prev) => {
      const exists = prev.demoChecklistCompleted.includes(stepId);
      return {
        ...prev,
        demoChecklistCompleted: exists
          ? prev.demoChecklistCompleted.filter((s) => s !== stepId)
          : [...prev.demoChecklistCompleted, stepId],
      };
    });
  };

  const resetDemoData = () => {
    const fresh = createInitialSeedState();
    setState({
      ...fresh,
      isAuthenticated: state.isAuthenticated,
      activeRole: state.activeRole,
      currentView: state.isAuthenticated ? state.currentView : 'landing',
    });
  };

  return (
    <SaanjhContext.Provider
      value={{
        state,
        insights,
        navigate,
        loginAsDemo,
        switchRole,
        logout,
        toggleMedicineTaken,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        saveAppointmentPrep,
        saveWellbeingCheckIn,
        addTrustedContact,
        deleteTrustedContact,
        submitHelpRequest,
        acknowledgeHelpRequestDemo,
        togglePrivacyPermission,
        revokeAllPrivacyPermissions,
        updateAccessibility,
        updateSeniorProfile,
        inviteFamilyMember,
        addCareTask,
        updateCareTaskStatus,
        deleteCareTask,
        addSharedVisit,
        toggleSharedVisitStatus,
        deleteSharedVisit,
        addRoutineActivity,
        updateRoutineActivity,
        postponeRoutineActivity,
        deleteRoutineActivity,
        addDocument,
        updateDocument,
        deleteDocument,
        sendAssistantMessage,
        toggleDemoStep,
        resetDemoData,
      }}
    >
      {children}
    </SaanjhContext.Provider>
  );
};

export function useSaanjh() {
  const ctx = useContext(SaanjhContext);
  if (!ctx) throw new Error('useSaanjh must be used inside SaanjhProvider');
  return ctx;
}
