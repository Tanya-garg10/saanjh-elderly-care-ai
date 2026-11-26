import { AssistantLanguage, RoutineActivityCategory, SaanjhState } from '../types/saanjh';
import { formatDisplayDate, formatTime12h, getOffsetDateISO } from '../data/seedData';

export interface AssistantReply {
  text: string;
  dataSources: string[];
}

export interface ProposedSmartTask {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  category: RoutineActivityCategory;
  notes: string;
  detectedFrom: string;
}

/**
 * Sanitizes assistant text before passing to Web Speech API (speechSynthesis)
 * so symbols like middle dots (·), slashes, and unit abbreviations are spoken clearly
 * without reading "dot" aloud.
 */
export function cleanTextForSpeech(rawText: string): string {
  return rawText
    .replace(/\s*·\s*/g, ', ')
    .replace(/\bDr\.\s*/gi, 'Doctor ')
    .replace(/\bMr\.\s*/gi, 'Mister ')
    .replace(/\bMrs\.\s*/gi, 'Missus ')
    .replace(/(\d+)\s*mg\b/gi, '$1 milligrams')
    .replace(/(\d+)\s*mcg\b/gi, '$1 micrograms')
    .replace(/(\d+)\s*ml\b/gi, '$1 milliliters')
    .replace(/(\d+)\s*IU\b/g, '$1 international units')
    .replace(/\bSR\b/g, 'sustained release')
    .replace(/[()]/g, ', ')
    .replace(/\s*\/\s*/g, ' or ')
    .replace(/\s+([,.;!?])/g, '$1')
    .replace(/,\s*,+/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Extracts a proposed smart task or reminder from spoken or typed English, Hindi, or Hinglish text.
 * Always returns a proposal for explicit user confirmation before saving.
 */
export function parseSmartTaskFromText(rawInput: string): ProposedSmartTask | null {
  const input = rawInput.trim();
  if (!input) return null;
  const lower = input.toLowerCase();

  // Detect date
  let date = getOffsetDateISO(0);
  if (lower.includes('tomorrow') || /\bkal\b/.test(lower) || lower.includes('कल')) {
    date = getOffsetDateISO(1);
  } else if (lower.includes('day after') || /\bparso\b/.test(lower) || lower.includes('परसों')) {
    date = getOffsetDateISO(2);
  } else {
    const isoMatch = input.match(/\b(\d{4}-\d{2}-\d{2})\b/);
    if (isoMatch) {
      date = isoMatch[1];
    }
  }

  // Detect time
  let time = '17:00';
  const time12Match = lower.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  const time24Match = lower.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  const hindiBajeMatch = lower.match(/\b(\d{1,2})\s*(?:baje|बजे)\b/i);

  if (time12Match) {
    let h = Number(time12Match[1]);
    const m = Number(time12Match[2] || '0');
    const period = time12Match[3].toLowerCase();
    if (period === 'pm' && h < 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  } else if (time24Match) {
    time = `${String(Number(time24Match[1])).padStart(2, '0')}:${time24Match[2]}`;
  } else if (hindiBajeMatch) {
    let h = Number(hindiBajeMatch[1]);
    const isEvening =
      lower.includes('shaam') ||
      lower.includes('evening') ||
      lower.includes('raat') ||
      lower.includes('night') ||
      lower.includes('शाम') ||
      lower.includes('रात');
    const isAfternoon = lower.includes('dopahar') || lower.includes('afternoon');
    if ((isEvening || (isAfternoon && h < 6)) && h < 12) h += 12;
    time = `${String(h).padStart(2, '0')}:00`;
  } else if (lower.includes('morning') || lower.includes('subah') || lower.includes('सुबह')) {
    time = '08:30';
  } else if (lower.includes('afternoon') || lower.includes('dopahar') || lower.includes('दोपहर')) {
    time = '14:00';
  } else if (lower.includes('evening') || lower.includes('shaam') || lower.includes('शाम')) {
    time = '17:30';
  } else if (lower.includes('night') || lower.includes('raat') || lower.includes('रात')) {
    time = '21:00';
  }

  // Detect category
  let category: RoutineActivityCategory = 'custom';
  if (
    lower.includes('water') ||
    lower.includes('hydrat') ||
    lower.includes('pani') ||
    lower.includes('paani') ||
    lower.includes('पानी')
  ) {
    category = 'hydration';
  } else if (
    lower.includes('walk') ||
    lower.includes('exercise') ||
    lower.includes('yoga') ||
    lower.includes('chahal') ||
    lower.includes('टहलना')
  ) {
    category = 'activity';
  } else if (
    lower.includes('rest') ||
    lower.includes('nap') ||
    lower.includes('aaram') ||
    lower.includes('आराम')
  ) {
    category = 'rest';
  }

  // Clean up title
  const cleanedTitle = input
    .replace(
      /^(remind me to|please remind me to|set a reminder to|add a task to|add reminder for|mujhe yaad dilana|yaad dila dena|kal|today|aaj)\s+/i,
      ''
    )
    .replace(/\b(at|par|ko)\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|baje)?\b/gi, '')
    .replace(/\b(tomorrow|today|aaj|kal|parso|day after tomorrow)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[,.\s-]+|[,.\s-]+$/g, '')
    .trim();

  const title =
    cleanedTitle.length >= 3
      ? cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1)
      : input;

  return {
    title,
    date,
    time,
    category,
    notes: `Created from voice/text note: "${input}"`,
    detectedFrom: input,
  };
}

export function generateRuleBasedReply(
  rawQuery: string,
  language: AssistantLanguage,
  state: SaanjhState
): AssistantReply {
  const q = rawQuery.toLowerCase().trim();
  const today = getOffsetDateISO(0);

  const activeMeds = state.medicines.filter((m) => m.active);
  const pendingMeds = activeMeds.filter((m) => !m.takenToday);
  const takenMeds = activeMeds.filter((m) => m.takenToday);

  const upcomingAppointments = state.appointments
    .filter((a) => a.status === 'upcoming' && a.date >= today)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const todayCheckIn = state.wellbeingHistory.find((w) => w.date === today);
  const recentCheckIns = [...state.wellbeingHistory]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  // 1. Medicines query
  if (
    q.includes('medicine') ||
    q.includes('meds') ||
    q.includes('dawa') ||
    q.includes('dawai') ||
    q.includes('tablet') ||
    q.includes('pill') ||
    q.includes('दवा')
  ) {
    if (activeMeds.length === 0) {
      return {
        text:
          language === 'hi'
            ? 'Abhi aapke schedule mein koi active dawa darj nahi hai. Aap Medicines page par jaakar naya schedule jod sakti hain.'
            : language === 'hinglish'
              ? 'Abhi aapke schedule mein koi active medicine nahi hai. Aap Medicines section mein add kar sakti hain.'
              : 'You do not have any active medicines listed right now. You can add one in the Medicines section.',
        dataSources: ['Medicine Schedule (0 active)'],
      };
    }

    const pendingList = pendingMeds
      .map((m) => `${m.name}, ${m.dosage.replace(/\s*·\s*/g, ', ')} at ${formatTime12h(m.time)}`)
      .join('; ');
    const takenList = takenMeds.map((m) => m.name).join(', ');

    if (language === 'hi') {
      const donePart = takenMeds.length > 0 ? `Aapne aaj ${takenList} le li hai. ` : '';
      const remPart =
        pendingMeds.length > 0
          ? `Abhi ${pendingMeds.length} dawa baaki hai: ${pendingList}.`
          : 'Aaj ki sabhi dawaiyan poori ho chuki hain.';
      return {
        text: `${donePart}${remPart}`,
        dataSources: ['Today Medicine Schedule'],
      };
    }

    if (language === 'hinglish') {
      const donePart = takenMeds.length > 0 ? `Aaj aapne ${takenList} mark kar li hai. ` : '';
      const remPart =
        pendingMeds.length > 0
          ? `Aaj ki ${pendingMeds.length} medicines abhi pending hain: ${pendingList}.`
          : 'Bahut badhiya, aaj ki saari medicines complete ho gayi hain.';
      return {
        text: `${donePart}${remPart}`,
        dataSources: ['Today Medicine Schedule'],
      };
    }

    const donePart =
      takenMeds.length > 0 ? `You have already confirmed ${takenList} today. ` : '';
    const remPart =
      pendingMeds.length > 0
        ? `You still have ${pendingMeds.length} scheduled for today: ${pendingList}.`
        : 'All of your scheduled medicines for today are marked as taken.';
    return {
      text: `${donePart}${remPart}`,
      dataSources: ['Today Medicine Schedule'],
    };
  }

  // 2. Appointment query
  if (
    q.includes('appointment') ||
    q.includes('doctor') ||
    q.includes('clinic') ||
    q.includes('visit') ||
    q.includes('kab hai') ||
    q.includes('डॉक्टर')
  ) {
    if (upcomingAppointments.length === 0) {
      return {
        text:
          language === 'hi'
            ? 'Abhi koi aane wali doctor appointment darj nahi hai.'
            : language === 'hinglish'
              ? 'Abhi koi upcoming doctor appointment scheduled nahi hai.'
              : 'You have no upcoming doctor appointments scheduled right now.',
        dataSources: ['Appointments Calendar'],
      };
    }
    const next = upcomingAppointments[0];
    const formattedDate = formatDisplayDate(next.date);
    const formattedTime = formatTime12h(next.time);

    if (language === 'hi') {
      return {
        text: `Aapki agli appointment ${next.doctorName}, ${next.specialty} ke saath ${formattedDate} ko ${formattedTime} baje ${next.clinic} mein hai.${next.notes ? ` Note: ${next.notes}` : ''}`,
        dataSources: ['Upcoming Appointments'],
      };
    }
    if (language === 'hinglish') {
      return {
        text: `Aapki next appointment ${next.doctorName}, ${next.specialty} ke saath ${formattedDate} ko ${formattedTime} par ${next.clinic} mein hai.${next.notes ? ` Note: ${next.notes}` : ''}`,
        dataSources: ['Upcoming Appointments'],
      };
    }
    return {
      text: `Your next appointment is with ${next.doctorName}, ${next.specialty}, on ${formattedDate} at ${formattedTime} at ${next.clinic}.${next.notes ? ` Note: ${next.notes}` : ''}`,
      dataSources: ['Upcoming Appointments'],
    };
  }

  // 3. Wellbeing / Feeling query
  if (
    q.includes('feel') ||
    q.includes('feeling') ||
    q.includes('mood') ||
    q.includes('wellbeing') ||
    q.includes('week') ||
    q.includes('kaisi') ||
    q.includes('tabiyat')
  ) {
    if (recentCheckIns.length === 0) {
      return {
        text:
          language === 'hinglish'
            ? 'Is hafte abhi tak koi wellbeing check-in save nahi hua hai. Aap Daily Wellbeing section mein apna check-in record kar sakti hain.'
            : 'There are no wellbeing check-ins recorded this week yet. You can save how you are feeling today in Daily Wellbeing.',
        dataSources: ['Wellbeing Check-ins'],
      };
    }

    const summaryList = recentCheckIns
      .slice(0, 3)
      .map((w) => `${w.mood} on ${formatDisplayDate(w.date)}`)
      .join(', ');

    if (language === 'hi') {
      return {
        text: `Is hafte aapke ${recentCheckIns.length} check-in darj hain: ${summaryList}. ${todayCheckIn ? `Aaj aapne ${todayCheckIn.mood} darj kiya hai.` : 'Aaj ka check-in abhi baaki hai.'}`,
        dataSources: ['Wellbeing History'],
      };
    }
    if (language === 'hinglish') {
      return {
        text: `Is week aapne ${recentCheckIns.length} check-ins save kiye hain: ${summaryList}. ${todayCheckIn ? `Aaj aapne ${todayCheckIn.mood} select kiya hai.` : 'Aaj ka daily check-in abhi pending hai.'}`,
        dataSources: ['Wellbeing History'],
      };
    }
    return {
      text: `You have ${recentCheckIns.length} recent wellbeing check-ins recorded, including ${summaryList}. ${todayCheckIn ? `Today you noted feeling ${todayCheckIn.mood}.` : 'You have not saved today’s check-in yet.'}`,
      dataSources: ['Wellbeing History'],
    };
  }

  // 4. Privacy / Family sharing query
  if (
    q.includes('privacy') ||
    q.includes('family') ||
    q.includes('ananya') ||
    q.includes('share') ||
    q.includes('sharing')
  ) {
    const sharedCategories = Object.entries(state.privacy)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key);
    const privateCategories = Object.entries(state.privacy)
      .filter(([, enabled]) => !enabled)
      .map(([key]) => key);

    if (language === 'hinglish' || language === 'hi') {
      return {
        text: `${state.familyProfile.name} abhi sirf ${sharedCategories.length > 0 ? sharedCategories.join(', ') : 'koi bhi nahi'} dekh sakti hain. ${privateCategories.length > 0 ? `Private rakhe gaye hain: ${privateCategories.join(', ')}.` : 'Aap Privacy Center se kabhi bhi access badal sakti hain.'}`,
        dataSources: ['Privacy & Consent Center'],
      };
    }

    return {
      text: `${state.familyProfile.name} can currently view: ${sharedCategories.length > 0 ? sharedCategories.join(', ') : 'nothing right now'}. ${privateCategories.length > 0 ? `Kept private: ${privateCategories.join(', ')}.` : 'All sharing categories are currently enabled.'} You can adjust this anytime in Privacy and Consent.`,
      dataSources: ['Privacy & Consent Center'],
    };
  }

  // 5. "What should I do next?" / Today overview
  if (
    q.includes('next') ||
    q.includes('today') ||
    q.includes('do') ||
    q.includes('aaj') ||
    q.includes('kya') ||
    q.includes('routine')
  ) {
    const nextMed = pendingMeds.sort((a, b) => a.time.localeCompare(b.time))[0];
    const nextRoutine = state.routineActivities
      .filter((r) => r.date === today && r.status === 'pending')
      .sort((a, b) => a.time.localeCompare(b.time))[0];
    const steps: string[] = [];

    if (nextMed) {
      const cleanDosage = nextMed.dosage.replace(/\s*·\s*/g, ', ');
      steps.push(
        language === 'hinglish' || language === 'hi'
          ? `${formatTime12h(nextMed.time)} par ${nextMed.name}, ${cleanDosage} lena hai`
          : `Take ${nextMed.name}, ${cleanDosage} at ${formatTime12h(nextMed.time)}`
      );
    }
    if (nextRoutine) {
      steps.push(`${nextRoutine.title} at ${formatTime12h(nextRoutine.time)}`);
    }
    if (!todayCheckIn) {
      steps.push(
        language === 'hinglish' || language === 'hi'
          ? 'Aaj ka Daily Wellbeing check-in complete karein'
          : 'Complete today’s brief Daily Wellbeing check-in'
      );
    }
    if (upcomingAppointments.length > 0) {
      const nextApt = upcomingAppointments[0];
      steps.push(
        language === 'hinglish' || language === 'hi'
          ? `${formatDisplayDate(nextApt.date)} ko ${nextApt.doctorName} se milna hai`
          : `Prepare for your upcoming visit with ${nextApt.doctorName} on ${formatDisplayDate(nextApt.date)}`
      );
    }

    if (steps.length === 0) {
      return {
        text:
          language === 'hinglish' || language === 'hi'
            ? 'Aaj ke saare mukhya kaam poore ho chuke hain. Aaraam karein ya shaam ki walk ka aanand lein.'
            : 'Everything scheduled for today is complete. Enjoy a restful afternoon or your evening walk.',
        dataSources: ['Medicines', 'Routine Planner', 'Wellbeing', 'Appointments'],
      };
    }

    return {
      text:
        language === 'hinglish' || language === 'hi'
          ? `Aaj ke liye aapke agle steps: ${steps.join('; ')}.`
          : `Here is what is next for you today: ${steps.join('; ')}.`,
      dataSources: ['Medicines', 'Routine Planner', 'Wellbeing', 'Appointments'],
    };
  }

  // Fallback transparent rule-based explanation
  if (language === 'hi') {
    return {
      text: 'Main aapki local Saanjh jaankari se madad kar sakti hoon. Kripya dawaiyon, agli doctor appointment, is hafte ki tabiyat, ya family privacy ke baare mein poochhein.',
      dataSources: ['Local Rule-Based Assistant'],
    };
  }
  if (language === 'hinglish') {
    return {
      text: 'Main aapke saved local data se madad kar sakti hoon. Aap pooch sakti hain: "Aaj kaunsi medicines leni hain?", "Mera next doctor appointment kab hai?", ya "What should I do next?"',
      dataSources: ['Local Rule-Based Assistant'],
    };
  }
  return {
    text: 'I answer directly from your saved Saanjh records using a local rule-based assistant, with no external AI cloud connected. Try asking: "What medicines do I need to take today?", "When is my next doctor appointment?", "How am I feeling this week?", or "What should I do next?"',
    dataSources: ['Local Rule-Based Assistant'],
  };
}
