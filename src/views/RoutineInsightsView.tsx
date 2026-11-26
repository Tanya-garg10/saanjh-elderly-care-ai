import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Info } from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { formatShortDate, getOffsetDateISO } from '../data/seedData';

export const RoutineInsightsView: React.FC = () => {
  const { state, insights } = useSaanjh();

  // Compute 7-day bar chart strictly from real recorded medicine history
  const sevenDayMedData = useMemo(() => {
    const activeMeds = state.medicines.filter((m) => m.active);
    const days = [-6, -5, -4, -3, -2, -1, 0].map((offset) => getOffsetDateISO(offset));

    return days.map((iso) => {
      let confirmed = 0;
      let unconfirmed = 0;
      activeMeds.forEach((med) => {
        const entry = med.history.find((h) => h.date === iso);
        if (entry?.status === 'taken') confirmed += 1;
        else if (entry) unconfirmed += 1;
      });
      return {
        day: formatShortDate(iso),
        confirmed,
        unconfirmed,
      };
    });
  }, [state.medicines]);

  return (
    <div className="space-y-8">
      <header className="pb-5 border-b border-[var(--border-hairline)]">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Routine Insights
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Transparent observations calculated strictly from your recorded medicines, appointments,
          and check-ins.
        </p>
      </header>

      <div className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] px-5 py-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[var(--deep-green)] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Every observation below includes why it appears. Saanjh uses neutral, descriptive
          language and never draws medical conclusions or invents insights from missing days.
        </p>
      </div>

      {/* 7-day Medicine Confirmation Chart */}
      <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
        <div className="pb-4 border-b border-[var(--border-hairline)]">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            7-Day Recorded Medicine Confirmations
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Count of active schedules manually confirmed vs. unconfirmed each day
          </p>
        </div>

        <div className="h-64 w-full mt-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sevenDayMedData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EAE5" />
              <XAxis dataKey="day" tick={{ fill: '#5C6762', fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#5C6762', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #E8EAE5',
                  backgroundColor: '#FFFFFF',
                  fontSize: 13,
                }}
              />
              <Bar dataKey="confirmed" name="User-confirmed" fill="#365B4B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="unconfirmed" name="Unconfirmed" fill="#C98F78" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Transparent Insights List */}
      <section aria-labelledby="insights-list-heading" className="space-y-4">
        <h2
          id="insights-list-heading"
          className="font-display text-lg font-semibold text-[var(--text-primary)]"
        >
          Current Observations ({insights.length})
        </h2>

        {insights.length === 0 ? (
          <div className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-8 text-center">
            <p className="text-base text-[var(--text-secondary)]">
              Not enough recorded activity yet to surface routine patterns.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {insights.map((ins) => (
              <article
                key={ins.id}
                className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
                    <span className="capitalize font-medium text-[var(--deep-green)]">
                      {ins.category}
                    </span>
                    <span className="tabular-nums">{ins.timeframe}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold text-[var(--text-primary)]">
                    {ins.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {ins.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--border-hairline)]">
                  <p className="text-xs font-medium text-[var(--text-primary)]">Why this appears</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {ins.explanation}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
