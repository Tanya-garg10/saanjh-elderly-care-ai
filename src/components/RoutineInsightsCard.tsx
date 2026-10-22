import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface RoutineInsightsCardProps {
  isFamilyView?: boolean;
}

export const RoutineInsightsCard: React.FC<RoutineInsightsCardProps> = ({ isFamilyView = false }) => {
  const { routineAnalysis, consentSettings, language, t } = useApp();

  // If in family view, verify that wellbeing or activity consent is permitted!
  if (isFamilyView && !consentSettings.wellbeingSummarySharing && !consentSettings.activitySharing) {
    return (
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E7E9E2]">
          <TrendingUp className="w-5 h-5 text-[#778078]" />
          <h3 className="font-bold text-base text-[#26372D]">{t('routineInsightsTitle')}</h3>
        </div>
        <div className="py-6 text-center text-xs text-[#778078]">
          {language === 'hi'
            ? 'मीरा जी की सहमति सेटिंग्स के अनुसार दिनचर्या अवलोकन अभी साझा नहीं किए गए हैं।'
            : 'Routine observations are kept private under Meera’s active consent settings.'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E7E9E2]">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-[#65866E]/15 rounded-xl text-[#294B3A]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#26372D]">
              {t('routineInsightsTitle')}
            </h3>
            <p className="text-xs text-[#778078] mt-0.5">
              {t('routineInsightsSubtitle')}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F8F7F1] text-[#778078] border border-[#E7E9E2] self-start sm:self-auto">
          Rule-Based Logic
        </span>
      </div>

      {/* Insufficient data state */}
      {!routineAnalysis.hasSufficientData ? (
        <div className="p-5 rounded-2xl bg-[#F8F7F1] border border-[#E7E9E2] text-center space-y-2">
          <Info className="w-6 h-6 text-[#778078] mx-auto" />
          <h4 className="font-bold text-sm text-[#26372D]">
            {t('insufficientDataTitle')}
          </h4>
          <p className="text-xs text-[#778078] max-w-md mx-auto leading-relaxed">
            {language === 'hi' ? routineAnalysis.dataNoticeHi : routineAnalysis.dataNotice}
          </p>
        </div>
      ) : (
        /* List of rule-based insights */
        <div className="space-y-4">
          {routineAnalysis.insights.map((insight) => {
            const isAttention = insight.severity === 'attention';
            const isObs = insight.severity === 'observation';

            let cardBg = 'bg-[#F8F7F1] border-[#E7E9E2]';
            let Icon = CheckCircle2;
            let iconColor = 'text-[#65866E]';

            if (isAttention) {
              cardBg = 'bg-amber-50/80 border-amber-200';
              Icon = AlertCircle;
              iconColor = 'text-amber-700';
            } else if (isObs) {
              cardBg = 'bg-emerald-50/50 border-emerald-200';
              Icon = Info;
              iconColor = 'text-emerald-700';
            }

            return (
              <div
                key={insight.id}
                className={`p-4 sm:p-5 rounded-2xl border ${cardBg} space-y-3 shadow-xs`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#26372D]">
                        {language === 'hi' ? insight.titleHi : insight.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#778078] mt-1 leading-relaxed">
                        {language === 'hi' ? insight.descriptionHi : insight.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#E7E9E2] text-[#778078] shrink-0">
                    {insight.severity}
                  </span>
                </div>

                {/* Reason & Dates transparent breakdown */}
                <div className="mt-2 pt-2 border-t border-[#E7E9E2]/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-[#26372D]">{t('whyObserved')} </span>
                    <span className="text-[#778078]">
                      {language === 'hi' && insight.reasonHi ? insight.reasonHi : insight.reason}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-[#26372D]">{t('datesInvolved')} </span>
                    <span className="text-[#778078]">
                      {insight.dates.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Non-diagnostic disclaimer */}
      <div className="pt-2 text-[11px] text-[#778078] leading-relaxed flex items-center gap-1.5 border-t border-[#E7E9E2]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#65866E] shrink-0" />
        <span>{t('nonDiagnosticDisclaimer')}</span>
      </div>
    </div>
  );
};
