import { Medicine, Appointment, WellbeingCheckIn, RoutineInsight } from '../types';

export interface RoutineAnalysisResult {
  insights: RoutineInsight[];
  hasSufficientData: boolean;
  totalLogsAnalyzed: number;
  dataNotice: string;
  dataNoticeHi: string;
}

export class RoutineInsightsService {
  /**
   * Transparent, rule-based routine analyzer.
   * Strictly non-diagnostic and non-predictive.
   * Only generates pattern observations when minimum historical data is met.
   */
  public static analyzeRoutine(data: {
    medicines: Medicine[];
    appointments: Appointment[];
    wellbeingLogs: WellbeingCheckIn[];
  }): RoutineAnalysisResult {
    const { medicines, wellbeingLogs } = data;
    const insights: RoutineInsight[] = [];

    // Safeguard: Minimum data threshold (3 entries required)
    if (!wellbeingLogs || wellbeingLogs.length < 3) {
      return {
        insights: [],
        hasSufficientData: false,
        totalLogsAnalyzed: wellbeingLogs ? wellbeingLogs.length : 0,
        dataNotice: 'Analyzing routine patterns — at least 3 completed check-ins are required to identify trends neutrally without premature conclusions.',
        dataNoticeHi: 'दिनचर्या पैटर्न का विश्लेषण — बिना किसी जल्दबाजी के निष्पक्ष अवलोकन के लिए कम से कम 3 स्वास्थ्य रिकॉर्ड आवश्यक हैं।',
      };
    }

    const recentLogs = wellbeingLogs.slice(0, 5);
    const supportOrOkayLogs = recentLogs.filter(
      (log) => log.response === 'support' || log.response === 'okay'
    );

    // Rule 1: Wellbeing Variation Pattern
    if (supportOrOkayLogs.length >= 2) {
      const dates = supportOrOkayLogs.map((l) => l.date);
      const hasSupport = supportOrOkayLogs.some((l) => l.response === 'support');

      insights.push({
        id: 'ins_wellbeing_variation',
        title: 'Routine change worth checking: Wellbeing variation',
        titleHi: 'दिनचर्या में बदलाव: स्वास्थ्य में उतार-चढ़ाव',
        description:
          'Multiple recent check-ins reflect mild discomfort, fatigue, or needing support. A gentle conversation with family or mentioning this at your next clinic visit can be reassuring.',
        descriptionHi:
          'हाल के रिकॉर्ड में हल्की थकान या मदद की आवश्यकता दर्ज की गई है। परिवार से बातचीत करना या अगली क्लिनिक यात्रा में इसका उल्लेख करना सहायक हो सकता है।',
        reason: `${supportOrOkayLogs.length} of your last ${recentLogs.length} self-reported check-ins indicated 'Feeling Okay' or 'Need Support'.`,
        reasonHi: `पिछले ${recentLogs.length} स्वास्थ्य रिकॉर्ड में से ${supportOrOkayLogs.length} में 'सामान्य' या 'मदद चाहिए' दर्ज किया गया।`,
        dates,
        severity: hasSupport ? 'attention' : 'observation',
        detectedAt: new Date().toISOString(),
      });
    } else {
      // Consistent Positive Routine
      const wellDates = recentLogs.filter((l) => l.response === 'well').map((l) => l.date);
      insights.push({
        id: 'ins_steady_routine',
        title: 'Consistent Routine Observed',
        titleHi: 'स्थिर और नियमित दिनचर्या',
        description:
          'Your recent check-ins demonstrate steady energy and comfortable routines. Keep following your daily schedule.',
        descriptionHi:
          'आपके हाल के रिकॉर्ड स्थिर ऊर्जा और अच्छी दिनचर्या दर्शाते हैं। अपने सामान्य कार्यक्रम का पालन करते रहें।',
        reason: `Recent check-ins show consistent positive wellbeing reflections across ${wellDates.length} recorded days.`,
        reasonHi: `हाल के रिकॉर्ड ${wellDates.length} दिनों में लगातार सकारात्मक स्वास्थ्य स्थिति दर्शाते हैं।`,
        dates: wellDates,
        severity: 'info',
        detectedAt: new Date().toISOString(),
      });
    }

    // Rule 2: Medicine Timing Status
    const totalScheduled = medicines.length;
    const takenCount = medicines.filter((m) => m.status === 'taken').length;
    const upcomingMeds = medicines.filter((m) => m.status === 'upcoming');

    if (totalScheduled > 0 && takenCount === totalScheduled) {
      insights.push({
        id: 'ins_med_complete',
        title: 'Medicine Schedule: Fully Adhered Today',
        titleHi: 'दवा कार्यक्रम: आज की सभी दवाएं पूर्ण',
        description: 'All scheduled medicines for today have been confirmed taken.',
        descriptionHi: 'आज के लिए निर्धारित सभी दवाएं ली जा चुकी हैं।',
        reason: `${takenCount} of ${totalScheduled} daily reminders confirmed taken.`,
        reasonHi: `आज के ${totalScheduled} में से ${takenCount} रिमाइंडर पूरे हो चुके हैं।`,
        dates: [new Date().toISOString().split('T')[0]],
        severity: 'info',
        detectedAt: new Date().toISOString(),
      });
    } else if (upcomingMeds.length > 0) {
      insights.push({
        id: 'ins_med_pending',
        title: 'Routine observation: Pending Reminders',
        titleHi: 'दिनचर्या अवलोकन: आज की दवाएं बाकी हैं',
        description: `You have ${upcomingMeds.length} scheduled medicine reminder(s) remaining for today.`,
        descriptionHi: `आज के लिए आपकी ${upcomingMeds.length} दवा(एं) अभी बाकी हैं।`,
        reason: `${upcomingMeds.map((m) => m.name).join(', ')} scheduled for today.`,
        reasonHi: `${upcomingMeds.map((m) => m.name).join(', ')} आज के लिए निर्धारित हैं।`,
        dates: [new Date().toISOString().split('T')[0]],
        severity: 'observation',
        detectedAt: new Date().toISOString(),
      });
    }

    return {
      insights,
      hasSufficientData: true,
      totalLogsAnalyzed: wellbeingLogs.length,
      dataNotice: 'Transparent rule-based routine observations derived from local check-in dates and reminder logs. Not clinical medical advice.',
      dataNoticeHi: 'स्थानीय रिकॉर्ड और तारीखों पर आधारित पारदर्शी नियम-आधारित अवलोकन। यह चिकित्सीय सलाह नहीं है।',
    };
  }
}
