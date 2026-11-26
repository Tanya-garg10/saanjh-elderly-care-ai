import React from 'react';
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  FileText,
} from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { formatDisplayDate, formatTime12h, getOffsetDateISO } from '../data/seedData';
import { SafeImage } from '../components/SafeImage';

const PrivateNoticeCard: React.FC<{ title: string; categoryLabel: string }> = ({
  title,
  categoryLabel,
}) => (
  <div className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
    <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--border-hairline)]">
      <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Private</span>
      </span>
    </div>
    <div className="py-6">
      <p className="text-base font-medium text-[var(--text-primary)]">
        {categoryLabel} sharing is paused by Meera.
      </p>
      <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
        Saanjh enforces consent boundaries immediately. No {categoryLabel.toLowerCase()} records
        are shown here while permission is turned off.
      </p>
    </div>
  </div>
);

export const FamilyDashboard: React.FC = () => {
  const { state, insights, switchRole, navigate } = useSaanjh();
  const {
    privacy,
    seniorProfile,
    familyProfile,
    medicines,
    appointments,
    wellbeingHistory,
    activities,
    careTasks,
    sharedVisits,
    documents,
  } = state;
  const today = getOffsetDateISO(0);

  const activeMeds = medicines.filter((m) => m.active);
  const upcomingAppointments = appointments
    .filter((a) => a.status === 'upcoming' && a.date >= today)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const sharedDocuments = documents.filter((d) => d.sharedWithFamily);
  const sharedCount = Object.values(privacy).filter(Boolean).length;
  const totalCategories = Object.keys(privacy).length;

  return (
    <div className="space-y-8">
      {/* Family Header & Senior Overview */}
      <header className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <SafeImage
            src={seniorProfile.avatarUrl}
            alt={seniorProfile.name}
            className="w-16 h-16 rounded-full object-cover border border-[var(--border-hairline)] shrink-0"
            fallbackLabel="Meera"
          />
          <div>
            <p className="text-xs font-medium text-[var(--deep-green)]">
              Viewing as {familyProfile.name} ({familyProfile.relationship})
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-0.5">
              {seniorProfile.name}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1 tabular-nums">
              Age {seniorProfile.age} · {seniorProfile.city} · Sharing {sharedCount} of{' '}
              {totalCategories} categories
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('care-circle')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] transition-colors whitespace-nowrap"
          >
            <Users className="w-4 h-4 text-[var(--deep-green)]" aria-hidden="true" />
            <span>Open Care Circle</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('privacy')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-[var(--deep-green)]" aria-hidden="true" />
            <span>Consent Status</span>
          </button>

          <button
            type="button"
            onClick={() => switchRole('senior')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] transition-colors whitespace-nowrap"
          >
            <span>Switch to Meera&apos;s View</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Consent Guarantee Banner */}
      <div className="rounded-2xl bg-[var(--secondary-sage)] border border-[var(--border-hairline)] px-5 py-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--deep-green)] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">
          Every section below is strictly filtered by Meera&apos;s Privacy &amp; Consent settings.
          Categories labeled <span className="font-semibold">Shared by Meera</span> are visible;
          paused categories remain hidden until Meera re-enables them.
        </p>
      </div>

      {/* Main Content Grid strictly respecting consent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shared Medicines */}
        <div className="lg:col-span-6">
          {!privacy.medicines ? (
            <PrivateNoticeCard title="Medicine Updates" categoryLabel="Medicine updates" />
          ) : (
            <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--border-hairline)]">
                <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Medicine Updates
                </h2>
                <span className="text-xs font-medium text-[var(--deep-green)]">
                  Shared by Meera
                </span>
              </div>

              <div className="divide-y divide-[var(--border-hairline)] mt-2">
                {activeMeds.length === 0 ? (
                  <p className="py-4 text-sm text-[var(--text-secondary)]">
                    No active medicine schedules listed.
                  </p>
                ) : (
                  activeMeds.map((med) => (
                    <div key={med.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {med.name}{' '}
                          <span className="font-normal text-[var(--text-secondary)]">
                            · {med.dosage}
                          </span>
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5 tabular-nums">
                          Scheduled {formatTime12h(med.time)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium shrink-0">
                        {med.takenToday ? (
                          <span className="inline-flex items-center gap-1 text-[var(--deep-green)]">
                            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                            <span>User-confirmed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
                            <Clock className="w-4 h-4" aria-hidden="true" />
                            <span>Pending today</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>

        {/* Shared Appointments */}
        <div className="lg:col-span-6">
          {!privacy.appointments ? (
            <PrivateNoticeCard
              title="Appointment Information"
              categoryLabel="Appointment information"
            />
          ) : (
            <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--border-hairline)]">
                <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Appointment Information
                </h2>
                <span className="text-xs font-medium text-[var(--deep-green)]">
                  Shared by Meera
                </span>
              </div>

              <div className="divide-y divide-[var(--border-hairline)] mt-2">
                {upcomingAppointments.length === 0 ? (
                  <p className="py-4 text-sm text-[var(--text-secondary)]">
                    No upcoming appointments scheduled.
                  </p>
                ) : (
                  upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="py-3.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {apt.doctorName}
                        </p>
                        <span className="text-xs text-[var(--text-secondary)] tabular-nums">
                          {formatDisplayDate(apt.date)} · {formatTime12h(apt.time)}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {apt.specialty} · {apt.clinic}
                      </p>
                      {apt.notes && (
                        <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                          {apt.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>

        {/* Shared Wellbeing */}
        <div className="lg:col-span-6">
          {!privacy.wellbeing ? (
            <PrivateNoticeCard title="Wellbeing Updates" categoryLabel="Wellbeing check-ins" />
          ) : (
            <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--border-hairline)]">
                <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Wellbeing Updates
                </h2>
                <span className="text-xs font-medium text-[var(--deep-green)]">
                  Shared by Meera
                </span>
              </div>

              <div className="divide-y divide-[var(--border-hairline)] mt-2">
                {wellbeingHistory.slice(0, 4).map((entry) => (
                  <div key={entry.id} className="py-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold text-[var(--text-primary)] capitalize">
                        Feeling {entry.mood}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)] tabular-nums">
                        {formatDisplayDate(entry.date)} · {formatTime12h(entry.time)}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                        {entry.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Shared Routine Insights */}
        <div className="lg:col-span-6">
          {!privacy.insights ? (
            <PrivateNoticeCard title="Routine Insights" categoryLabel="Routine insights" />
          ) : (
            <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--border-hairline)]">
                <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Selected Routine Insights
                </h2>
                <span className="text-xs font-medium text-[var(--deep-green)]">
                  Shared by Meera
                </span>
              </div>

              <div className="divide-y divide-[var(--border-hairline)] mt-2">
                {insights.length === 0 ? (
                  <p className="py-4 text-sm text-[var(--text-secondary)]">
                    No routine observations recorded yet.
                  </p>
                ) : (
                  insights.map((ins) => (
                    <div key={ins.id} className="py-3.5">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{ins.title}</p>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{ins.summary}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        Why this appears: {ins.explanation}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>

        {/* Shared Care Circle Summary */}
        <div className="lg:col-span-6">
          {!privacy.careCircle ? (
            <PrivateNoticeCard
              title="Family Care Circle"
              categoryLabel="Family Care Circle coordination"
            />
          ) : (
            <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--border-hairline)]">
                <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Family Care Circle Tasks &amp; Visits
                </h2>
                <button
                  type="button"
                  onClick={() => navigate('care-circle')}
                  className="text-xs font-medium text-[var(--deep-green)] hover:underline"
                >
                  Manage Circle
                </button>
              </div>
              <div className="mt-3 space-y-3 text-sm">
                <p className="text-xs text-[var(--text-secondary)] tabular-nums">
                  {state.familyMembers.length} members ·{' '}
                  {careTasks.filter((t) => t.status !== 'completed').length} open tasks ·{' '}
                  {sharedVisits.filter((v) => v.status === 'planned').length} planned visits
                </p>
                <div className="divide-y divide-[var(--border-hairline)]">
                  {careTasks.slice(0, 3).map((task) => {
                    const member = state.familyMembers.find((m) => m.id === task.assignedToId);
                    return (
                      <div key={task.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {member?.name ?? 'Member'} · Due {formatDisplayDate(task.dueDate)}
                          </p>
                        </div>
                        <span className="text-xs capitalize text-[var(--deep-green)] shrink-0">
                          {task.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Shared Health Documents */}
        <div className="lg:col-span-6">
          {!privacy.documents ? (
            <PrivateNoticeCard
              title="Shared Health Documents"
              categoryLabel="Health Document Vault"
            />
          ) : (
            <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--border-hairline)]">
                <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Shared Health Documents
                </h2>
                <span className="text-xs font-medium text-[var(--deep-green)]">
                  Shared by Meera
                </span>
              </div>
              <div className="divide-y divide-[var(--border-hairline)] mt-2">
                {sharedDocuments.length === 0 ? (
                  <p className="py-4 text-sm text-[var(--text-secondary)]">
                    No individual documents are marked for family sharing.
                  </p>
                ) : (
                  sharedDocuments.map((doc) => (
                    <div key={doc.id} className="py-3 flex items-start gap-3">
                      <FileText
                        className="w-4 h-4 text-[var(--deep-green)] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {doc.title}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] tabular-nums">
                          {doc.category} · {formatDisplayDate(doc.documentDate)} · {doc.source}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>

        {/* General Activity */}
        <div className="lg:col-span-12">
          {!privacy.generalActivity ? (
            <PrivateNoticeCard
              title="Recent Activity"
              categoryLabel="General activity updates"
            />
          ) : (
            <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--border-hairline)]">
                <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Recent Activity
                </h2>
                <span className="text-xs font-medium text-[var(--deep-green)]">
                  Shared by Meera
                </span>
              </div>

              <div className="divide-y divide-[var(--border-hairline)] mt-2">
                {activities
                  .filter((act) => {
                    if (act.category === 'medicines' && !privacy.medicines) return false;
                    if (act.category === 'appointments' && !privacy.appointments) return false;
                    if (act.category === 'wellbeing' && !privacy.wellbeing) return false;
                    if (act.category === 'care-circle' && !privacy.careCircle) return false;
                    if (act.category === 'documents' && !privacy.documents) return false;
                    return true;
                  })
                  .slice(0, 6)
                  .map((act) => (
                    <div
                      key={act.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {act.title}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">{act.detail}</p>
                      </div>
                      <span className="text-xs text-[var(--text-secondary)] tabular-nums shrink-0">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
