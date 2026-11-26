import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Info } from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import {
  formatDisplayDate,
  formatShortDate,
  formatTime12h,
  getOffsetDateISO,
} from '../data/seedData';
import { MoodOption } from '../types/saanjh';

const MOODS: { value: MoodOption; label: string; description: string; score: number }[] = [
  { value: 'peaceful', label: 'Peaceful', description: 'Calm, rested, and settled', score: 5 },
  { value: 'good', label: 'Good', description: 'Steady, comfortable energy', score: 4 },
  { value: 'tired', label: 'Tired', description: 'Ready for extra rest today', score: 3 },
  { value: 'low', label: 'Low', description: 'Quiet or feeling low energy', score: 2 },
  { value: 'anxious', label: 'Anxious', description: 'Worried or unsettled', score: 1 },
];

const SCORE_TO_LABEL: Record<number, string> = {
  5: 'Peaceful',
  4: 'Good',
  3: 'Tired',
  2: 'Low',
  1: 'Anxious',
};

export const WellbeingView: React.FC = () => {
  const { state, saveWellbeingCheckIn } = useSaanjh();
  const today = getOffsetDateISO(0);
  const todayEntry = state.wellbeingHistory.find((w) => w.date === today);

  const [selectedMood, setSelectedMood] = useState<MoodOption>(todayEntry?.mood ?? 'peaceful');
  const [note, setNote] = useState(todayEntry?.note ?? '');
  const [savedNotice, setSavedNotice] = useState('');
  const [range, setRange] = useState<'weekly' | 'monthly'>('weekly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveWellbeingCheckIn(selectedMood, note);
    setSavedNotice('Your wellbeing check-in was saved locally.');
    setTimeout(() => setSavedNotice(''), 3500);
  };

  const rangeEntries = useMemo(() => {
    const cutoff = getOffsetDateISO(range === 'weekly' ? -6 : -29);
    return [...state.wellbeingHistory]
      .filter((w) => w.date >= cutoff && w.date <= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [state.wellbeingHistory, range, today]);

  const chartData = useMemo(() => {
    const scoreMap = new Map(MOODS.map((m) => [m.value, m.score]));
    return rangeEntries.map((entry) => ({
      dateLabel: formatShortDate(entry.date),
      score: scoreMap.get(entry.mood) ?? 3,
      moodLabel: entry.mood,
    }));
  }, [rangeEntries]);

  const neutralSummary = useMemo(() => {
    if (rangeEntries.length === 0) {
      return {
        count: 0,
        mostFrequent: 'None recorded',
        observation: `No check-ins recorded in this ${range === 'weekly' ? '7-day' : '30-day'} window yet.`,
      };
    }
    const counts: Record<string, number> = {};
    rangeEntries.forEach((w) => {
      counts[w.mood] = (counts[w.mood] || 0) + 1;
    });
    const topMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return {
      count: rangeEntries.length,
      mostFrequent: topMood,
      observation: `You recorded ${rangeEntries.length} check-in${rangeEntries.length === 1 ? '' : 's'} over the past ${range === 'weekly' ? '7' : '30'} days. Most commonly noted feeling: ${topMood}.`,
    };
  }, [rangeEntries, range]);

  return (
    <div className="space-y-8">
      <header className="pb-5 border-b border-[var(--border-hairline)]">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Wellbeing &amp; Personal Trends
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Record daily reflections and explore weekly or monthly summaries from your saved notes.
        </p>
      </header>

      {/* Non-diagnostic Notice */}
      <div className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] px-5 py-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[var(--deep-green)] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Your wellbeing notes and trends are personal reflections, never a medical or mental-health
          diagnosis. Only shared with family if Wellbeing sharing is enabled in Privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Check-in Form */}
        <section className="lg:col-span-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            How are you feeling today?
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {formatDisplayDate(today)}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-2" role="radiogroup" aria-label="Select today's feeling">
              {MOODS.map((m) => {
                const active = selectedMood === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelectedMood(m.value)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                      active
                        ? 'border-[var(--deep-green)] bg-[var(--secondary-sage)] text-[var(--deep-green)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-[var(--text-primary)] hover:bg-[#F1F3EF]'
                    }`}
                  >
                    <span className="font-medium text-sm">{m.label}</span>
                    <span className="text-xs text-[var(--text-secondary)]">{m.description}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label htmlFor="wb-note" className="block text-sm font-medium mb-1.5">
                Optional Note
              </label>
              <textarea
                id="wb-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything you'd like to remember about today..."
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] transition-colors"
            >
              {todayEntry ? 'Update Today’s Check-in' : 'Save Check-in'}
            </button>

            {savedNotice && (
              <p role="status" className="text-sm font-medium text-[var(--deep-green)]">
                {savedNotice}
              </p>
            )}
          </form>
        </section>

        {/* Weekly / Monthly Trends & History */}
        <div className="lg:col-span-7 space-y-6">
          <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-hairline)]">
              <div>
                <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Personal Wellbeing Trends
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {neutralSummary.observation}
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-ivory)] border border-[var(--border-hairline)] w-fit shrink-0">
                <button
                  type="button"
                  onClick={() => setRange('weekly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                    range === 'weekly'
                      ? 'bg-[var(--deep-green)] text-white'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  Weekly (7d)
                </button>
                <button
                  type="button"
                  onClick={() => setRange('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                    range === 'monthly'
                      ? 'bg-[var(--deep-green)] text-white'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  Monthly (30d)
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 pb-4 border-b border-[var(--border-hairline)]">
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Recorded Check-ins</p>
                <p className="mt-1 font-display text-xl font-bold text-[var(--text-primary)] tabular-nums">
                  {neutralSummary.count}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Most Recorded Feeling</p>
                <p className="mt-1 font-display text-xl font-bold text-[var(--text-primary)] capitalize">
                  {neutralSummary.mostFrequent}
                </p>
              </div>
            </div>

            {chartData.length < 2 ? (
              <p className="py-12 text-center text-sm text-[var(--text-secondary)]">
                Save at least 2 check-ins in this window to view a visual trend.
              </p>
            ) : (
              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="wellbeingFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#789887" stopOpacity={0.32} />
                        <stop offset="95%" stopColor="#789887" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8EAE5" />
                    <XAxis dataKey="dateLabel" tick={{ fill: '#5C6762', fontSize: 12 }} />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={(val) => SCORE_TO_LABEL[val] ?? ''}
                      tick={{ fill: '#5C6762', fontSize: 11 }}
                      width={72}
                    />
                    <Tooltip
                      formatter={(val) => {
                        const num = typeof val === 'number' ? val : Number(val);
                        return [SCORE_TO_LABEL[num] ?? String(val ?? ''), 'Feeling'];
                      }}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #E8EAE5',
                        backgroundColor: '#FFFFFF',
                        fontSize: 13,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#365B4B"
                      strokeWidth={2}
                      fill="url(#wellbeingFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Mood History */}
          <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] pb-3 border-b border-[var(--border-hairline)]">
              Check-in History ({range === 'weekly' ? 'Past 7 Days' : 'Past 30 Days'})
            </h2>

            {rangeEntries.length === 0 ? (
              <p className="py-6 text-sm text-[var(--text-secondary)]">
                No check-ins recorded in this timeframe yet.
              </p>
            ) : (
              <div className="divide-y divide-[var(--border-hairline)]">
                {[...rangeEntries]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((entry) => (
                    <div key={entry.id} className="py-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-base font-semibold text-[var(--text-primary)] capitalize">
                          {entry.mood}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] tabular-nums">
                          {formatDisplayDate(entry.date)} · {formatTime12h(entry.time)}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
