import {
  Medicine,
  Appointment,
  WellbeingCheckIn,
  ConsentSettings,
  AssistantMessage,
  Language,
} from '../types';
import { RoutineInsightsService } from './routineInsightsService';

export interface AssistantContextData {
  medicines: Medicine[];
  appointments: Appointment[];
  wellbeingLogs: WellbeingCheckIn[];
  consentSettings: ConsentSettings;
  seniorName: string;
  language: Language;
  isOnline?: boolean;
}

export class AssistantService {
  /**
   * Processes queries in English, Hindi, and natural Hinglish.
   * Reads live application state (medicines, appointments, wellbeing check-ins, privacy consent).
   */
  public static async processQuery(
    userText: string,
    context: AssistantContextData
  ): Promise<AssistantMessage> {
    const rawLower = userText.toLowerCase().trim();
    const isHinglishOrHindi = context.language === 'hi' || this.detectHindiOrHinglish(rawLower);

    // 0. Immediate One-Tap Help / Emergency intent
    if (
      this.matchesAny(rawLower, [
        'help',
        'madad',
        'help chahiye',
        'emergency',
        'sos',
        'ananya ko phone',
        'ananya se baat',
        'call daughter',
        'call daughter demo',
        'call ananya',
        'urgent',
        'bachao',
        'musibat',
        'contact ananya',
      ])
    ) {
      const text = isHinglishOrHindi
        ? `मीरा जी, बिल्कुल घबराएं नहीं। आपकी बेटी अनन्या शर्मा (+91 98765 43210) आपकी आपातकालीन संपर्क हैं। आप नीचे दिए गए बटन से तुरंत सहायता अनुरोध स्क्रीन खोल सकती हैं।`
        : `Meera ji, please stay calm and comfortable. Your daughter Ananya Sharma (+91 98765 43210) is your configured family contact. You can tap the button below to view or simulate help options.`;

      return {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggested: {
          type: 'help',
          label: isHinglishOrHindi ? 'मदद अनुरोध खोलें' : 'Open Help Options',
          payload: 'help',
        },
      };
    }

    // 1. Next Medicine & Routine Timing intent (English, Hindi, Hinglish)
    if (
      this.matchesAny(rawLower, [
        'next medicine',
        'next pill',
        'when is my medicine',
        'upcoming medicine',
        'agli medicine',
        'agli dava',
        'agli dawai',
        'dawa kab',
        'dawai kab',
        'medicine kab hai',
        'tablet kab',
        'mera next medicine',
        'medicine ka time',
        'dawa ka time',
        'next tablet kaunsi hai',
        'metformin',
        'amlodipine',
        'atorvastatin',
        'calcium',
        'kaunsi dawa bachi hai',
        'dawaai kab khani hai',
        'tablet time',
        'dawai schedule',
      ])
    ) {
      const upcomingMeds = context.medicines.filter((m) => m.status === 'upcoming');
      if (upcomingMeds.length === 0) {
        return {
          id: `ast_${Date.now()}`,
          sender: 'assistant',
          text: isHinglishOrHindi
            ? 'बहुत बढ़िया! आज की सभी निर्धारित दवाएं आप ले चुकी हैं। आज के लिए कोई भी दवाई बाकी नहीं है।'
            : 'Good news! All scheduled medicines for today have already been confirmed taken. You have no pending medicines today.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionSuggested: {
            type: 'navigate',
            label: isHinglishOrHindi ? 'दवाइयां देखें' : 'View Medicines',
            payload: 'medicines',
          },
        };
      }

      const nextMed = upcomingMeds[0];
      const text = isHinglishOrHindi
        ? `आपकी अगली दवा ${nextMed.name} (${nextMed.dosage || ''}) है, जो ${nextMed.reminderTime} पर निर्धारित है। निर्देश: "${nextMed.instructions || 'पानी के साथ लें'}"।`
        : `Your next scheduled medicine is ${nextMed.name} (${nextMed.dosage || ''}) at ${nextMed.reminderTime}. Instructions: "${nextMed.instructions || 'Take as advised'}".`;

      return {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggested: {
          type: 'medicine',
          label: isHinglishOrHindi ? `${nextMed.name} ले ली है` : `Mark ${nextMed.name} Taken`,
          payload: nextMed.id,
        },
      };
    }

    // 2. Today's Schedule & Routine intent (English, Hindi, Hinglish)
    if (
      this.matchesAny(rawLower, [
        'today schedule',
        'today routine',
        'what is my schedule',
        'my day',
        'aaj ka schedule',
        'aaj kya karna hai',
        'aaj ka din',
        'routine kya hai',
        'aaj ka routine',
        'schedule check karo',
        'mera routine batao',
        'din kaisa hai',
        'aaj kya bacha hai',
      ])
    ) {
      const totalMeds = context.medicines.length;
      const takenMeds = context.medicines.filter((m) => m.status === 'taken').length;
      const upcomingApts = context.appointments.filter((a) => a.status === 'upcoming');

      let text = '';
      if (isHinglishOrHindi) {
        text = `आज आपके पास कुल ${totalMeds} दवाएं हैं, जिनमें से ${takenMeds} ली जा चुकी हैं।`;
        if (upcomingApts.length > 0) {
          text += ` इसके अलावा ${upcomingApts[0].doctorName} के साथ ${upcomingApts[0].time} पर आपकी मुलाकात है (${upcomingApts[0].clinicName})।`;
        } else {
          text += ` आज कोई डॉक्टर अपॉइंटमेंट नहीं है।`;
        }
      } else {
        text = `For today, you have ${totalMeds} medicines scheduled (${takenMeds} confirmed taken).`;
        if (upcomingApts.length > 0) {
          text += ` You also have an upcoming appointment with ${upcomingApts[0].doctorName} at ${upcomingApts[0].time} (${upcomingApts[0].clinicName}).`;
        } else {
          text += ` No doctor appointments are scheduled for today.`;
        }
      }

      return {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggested: {
          type: 'navigate',
          label: isHinglishOrHindi ? 'शेड्यूल देखें' : 'View Schedule',
          payload: 'dashboard',
        },
      };
    }

    // 3. Doctor / Clinic Appointments intent (English, Hindi, Hinglish)
    if (
      this.matchesAny(rawLower, [
        'appointment',
        'doctor',
        'clinic',
        'hospital',
        'kulkarni',
        'mehra',
        'doctor se kab milna',
        'mulaqat',
        'clinic kab jana',
        'doc appointment kab hai',
        'doctor appointment',
        'hospital kab jana hai',
        'checkup kab hai',
      ])
    ) {
      const upcoming = context.appointments.filter((a) => a.status === 'upcoming');
      if (upcoming.length === 0) {
        return {
          id: `ast_${Date.now()}`,
          sender: 'assistant',
          text: isHinglishOrHindi
            ? 'आपके पास अभी कोई आगामी डॉक्टर अपॉइंटमेंट दर्ज नहीं है। क्या आप कोई नई मुलाकात जोड़ना चाहती हैं?'
            : 'You currently have no upcoming doctor appointments scheduled. Would you like to add one?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionSuggested: {
            type: 'navigate',
            label: isHinglishOrHindi ? 'अपॉइंटमेंट जोड़ें' : 'Add Appointment',
            payload: 'appointments',
          },
        };
      }

      const nextApt = upcoming[0];
      const text = isHinglishOrHindi
        ? `आपकी आगामी मुलाकात ${nextApt.doctorName} (${nextApt.specialty || 'डॉक्टर'}) के साथ ${nextApt.date} को ${nextApt.time} बजे है, स्थान: ${nextApt.clinicName}।`
        : `Your next appointment is with ${nextApt.doctorName} (${nextApt.specialty || 'Doctor'}) on ${nextApt.date} at ${nextApt.time} at ${nextApt.clinicName}.`;

      return {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggested: {
          type: 'navigate',
          label: isHinglishOrHindi ? 'अपॉइंटमेंट देखें' : 'View Appointments',
          payload: 'appointments',
        },
      };
    }

    // 4. Wellbeing / Feeling unwell / Hinglish symptom expressions
    if (
      this.matchesAny(rawLower, [
        'tabiyat',
        'theek nahi',
        'bimar',
        'dard',
        'thakan',
        'feeling unwell',
        'feeling sick',
        'not feeling well',
        'tired',
        'dizzy',
        'pain',
        'wellbeing',
        'how are you',
        'kaisa lag raha',
        'mood',
        'feeling good',
        'feeling great',
        'badhiya',
        'aaj tabiyat thodi off hai',
        'sir dard',
        'thoda tired feel ho raha hai',
        'chakkar aa rahe',
        'kamzori lag rahi hai',
        'ghutne me dard',
        'thoda low feel',
        'thik lag raha',
        'fresh feel',
      ])
    ) {
      const isUnwell = this.matchesAny(rawLower, [
        'not feeling well',
        'sick',
        'tired',
        'pain',
        'dizzy',
        'theek nahi',
        'bimar',
        'dard',
        'thakan',
        'kamzori',
        'off hai',
        'chakkar',
        'low feel',
      ]);

      if (isUnwell) {
        return {
          id: `ast_${Date.now()}`,
          sender: 'assistant',
          text: isHinglishOrHindi
            ? 'मुझे सुनकर चिंता हुई मीरा जी। कृपया थोड़ा आराम करें और पानी पिएं। क्या आप आज का स्वास्थ्य हाल-चाल दर्ज करना चाहती हैं या अपनी बेटी अनन्या को सूचित करना चाहती हैं?'
            : 'I’m sorry you are not feeling your best. Please rest comfortably and sip some water. Would you like to record your wellbeing check-in or reach out to your family contact?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionSuggested: {
            type: 'checkin',
            label: isHinglishOrHindi ? 'स्वास्थ्य दर्ज करें' : 'Record Wellbeing',
            payload: 'wellbeing',
          },
        };
      }

      return {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: isHinglishOrHindi
          ? 'यह सुनकर बहुत खुशी हुई! आपका स्वास्थ्य और खुशी सबसे महत्वपूर्ण है। क्या आप आज का स्वास्थ्य हाल-चाल दर्ज करना चाहती हैं?'
          : 'Wonderful to hear that! Your wellbeing and peace of mind are what matter most. Would you like to log your daily check-in now?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggested: {
          type: 'checkin',
          label: isHinglishOrHindi ? 'स्वास्थ्य दर्ज करें' : 'Record Wellbeing',
          payload: 'wellbeing',
        },
      };
    }

    // 5. Privacy & Consent inquiries (Hinglish, Hindi, English)
    if (
      this.matchesAny(rawLower, [
        'privacy',
        'consent',
        'who can see',
        'family see',
        'daughter see',
        'ananya see',
        'share',
        'kaun dekh sakta',
        'kya share ho raha',
        'meri jankari',
        'nijta',
        'privacy settings open karo',
        'ananya ko kya dikh raha hai',
        'mera data kaun dekh sakta hai',
        'permission change karni hai',
        'sharing settings',
      ])
    ) {
      const c = context.consentSettings;
      const sharedItems: string[] = [];
      if (c.medicineStatusSharing) sharedItems.push(isHinglishOrHindi ? 'दवा स्थिति' : 'Medicine Status');
      if (c.wellbeingSummarySharing) sharedItems.push(isHinglishOrHindi ? 'स्वास्थ्य सारांश' : 'Wellbeing Summary');
      if (c.appointmentSharing) sharedItems.push(isHinglishOrHindi ? 'डॉक्टर मुलाकात' : 'Appointments');
      if (c.activitySharing) sharedItems.push(isHinglishOrHindi ? 'गतिविधि समयरेखा' : 'Activity Logs');

      let text = '';
      if (sharedItems.length === 0) {
        text = isHinglishOrHindi
          ? `आपकी पूर्ण निजता सुरक्षित है। अभी आपकी बेटी अनन्या शर्मा के साथ कुछ भी साझा नहीं किया जा रहा है (100% Private)। आप जब चाहें प्राइवेसी सेंटर में जाकर अनुमतियाँ बदल सकती हैं।`
          : `Your privacy is fully protected. Currently, no categories are shared with your daughter Ananya Sharma. Everything remains strictly private unless you choose to share.`;
      } else {
        const listStr = sharedItems.join(', ');
        text = isHinglishOrHindi
          ? `आपकी अनुमति के आधार पर, अनन्या शर्मा केवल यह देख सकती हैं: ${listStr}। आपकी निजी टिप्पणियां और वॉयस बातचीत कभी भी साझा नहीं की जाती हैं।`
          : `Under your current consent settings, Ananya Sharma can only see: ${listStr}. Private notes and voice conversations are never shared. You can revoke access anytime.`;
      }

      return {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggested: {
          type: 'privacy',
          label: isHinglishOrHindi ? 'प्राइवेसी सेटिंग्स' : 'Privacy Settings',
          payload: 'privacy',
        },
      };
    }

    // 6. Routine Change Insights query
    if (
      this.matchesAny(rawLower, [
        'routine insight',
        'insights',
        'kaisa chal raha hai',
        'routine check karo',
        'insights dikhao',
        'trends',
        'pichle din kaise rahe',
        'pattern kya hai',
      ])
    ) {
      const analysis = RoutineInsightsService.analyzeRoutine({
        medicines: context.medicines,
        appointments: context.appointments,
        wellbeingLogs: context.wellbeingLogs,
      });

      if (!analysis.hasSufficientData) {
        const text = isHinglishOrHindi ? analysis.dataNoticeHi : analysis.dataNotice;
        return {
          id: `ast_${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionSuggested: {
            type: 'checkin',
            label: isHinglishOrHindi ? 'स्वास्थ्य दर्ज करें' : 'Record Check-in',
            payload: 'wellbeing',
          },
        };
      }

      const topInsight = analysis.insights[0];
      const text = isHinglishOrHindi
        ? `${topInsight.titleHi}: ${topInsight.descriptionHi} (कारण: ${topInsight.reasonHi || topInsight.reason})`
        : `${topInsight.title}: ${topInsight.description} (Reason: ${topInsight.reason})`;

      return {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggested: {
          type: 'navigate',
          label: isHinglishOrHindi ? 'डैशबोर्ड देखें' : 'View Dashboard',
          payload: 'dashboard',
        },
      };
    }

    // 7. Offline-First Experience query
    if (
      this.matchesAny(rawLower, [
        'offline',
        'internet nahi hai',
        'offline kaam karega',
        'kya ye offline chalega',
        'is this offline',
        'data kahan save hota hai',
        'sync',
      ])
    ) {
      const text = isHinglishOrHindi
        ? `सांझ पूरी तरह ऑफलाइन-फर्स्ट (Offline-First) बनाया गया है। आपकी सभी दवाएं, रिमाइंडर और स्वास्थ्य रिकॉर्ड आपके डिवाइस की मेमोरी में सुरक्षित रहते हैं। इंटरनेट न होने पर भी आप सब कुछ इस्तेमाल कर सकती हैं!`
        : `Saanjh is built offline-first! All your medicines, reminders, and wellbeing records are stored locally on your device. Everything remains completely accessible even without internet connectivity.`;

      return {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggested: {
          type: 'navigate',
          label: isHinglishOrHindi ? 'आज का शेड्यूल' : 'Today Schedule',
          payload: 'dashboard',
        },
      };
    }

    // Default polite response
    return {
      id: `ast_${Date.now()}`,
      sender: 'assistant',
      text: isHinglishOrHindi
        ? `नमस्ते मीरा जी! मैं आपकी सांझ सहायक हूँ। आप मुझसे हिंदी, इंग्लिश या हिंग्लिश में पूछ सकती हैं: "मेरी अगली दवा कब है?", "आज का शेड्यूल क्या है?", "डॉक्टर से कब मिलना है?", या "मुझे मदद चाहिए"।`
        : `Hello Meera ji! I’m your Saanjh care assistant. You can ask in English, Hindi, or Hinglish: "When is my next medicine?", "What's my schedule today?", "When is my doctor appointment?", or "I need help".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionSuggested: {
        type: 'navigate',
        label: isHinglishOrHindi ? 'दवाएं देखें' : 'View Medicines',
        payload: 'medicines',
      },
    };
  }

  private static matchesAny(text: string, phrases: string[]): boolean {
    return phrases.some((p) => text.includes(p));
  }

  private static detectHindiOrHinglish(text: string): boolean {
    // Unicode range for Devanagari is \u0900-\u097F
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    if (hasDevanagari) return true;

    const hinglishWords = [
      'meri',
      'mera',
      'aaj',
      'tabiyat',
      'theek',
      'thik',
      'nahi',
      'hai',
      'kya',
      'kaisa',
      'kaise',
      'dawa',
      'dawai',
      'namaste',
      'kaun',
      'dekhega',
      'karo',
      'karna',
      'chahiye',
      'madad',
      'bachao',
      'ananya',
      'kulkarni',
      'chakkar',
      'dard',
      'thakan',
      'bachi',
      'batao',
      'off',
    ];
    return hinglishWords.some((w) => text.split(/\s+/).includes(w));
  }
}
