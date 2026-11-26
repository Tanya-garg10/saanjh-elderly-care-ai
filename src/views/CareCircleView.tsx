import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { formatDisplayDate, formatTime12h, getOffsetDateISO } from '../data/seedData';
import { CareTask, CareTaskStatus } from '../types/saanjh';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const CareCircleView: React.FC = () => {
  const {
    state,
    navigate,
    inviteFamilyMember,
    addCareTask,
    updateCareTaskStatus,
    deleteCareTask,
    addSharedVisit,
    toggleSharedVisitStatus,
    deleteSharedVisit,
  } = useSaanjh();

  const [activeTab, setActiveTab] = useState<'tasks' | 'visits' | 'members'>('tasks');

  // Invite Member Form
  const [inviteOpen, setInviteOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRel, setMemberRel] = useState('');
  const [memberCity, setMemberCity] = useState('');
  const [memberRole, setMemberRole] = useState<'Primary Coordinator' | 'Care Circle Member'>(
    'Care Circle Member'
  );
  const [memberContact, setMemberContact] = useState('');
  const [memberError, setMemberError] = useState('');

  // Add Task Form
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(state.familyMembers[0]?.id ?? '');
  const [taskDue, setTaskDue] = useState(getOffsetDateISO(2));
  const [taskCategory, setTaskCategory] = useState<CareTask['category']>('Medicines');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskError, setTaskError] = useState('');

  // Add Visit Form
  const [visitOpen, setVisitOpen] = useState(false);
  const [visitMemberId, setVisitMemberId] = useState(state.familyMembers[0]?.id ?? '');
  const [visitTitle, setVisitTitle] = useState('');
  const [visitDate, setVisitDate] = useState(getOffsetDateISO(3));
  const [visitTime, setVisitTime] = useState('16:30');
  const [visitPurpose, setVisitPurpose] = useState('');
  const [visitError, setVisitError] = useState('');

  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const isSenior = state.activeRole === 'senior';
  const careCircleAllowed = state.privacy.careCircle;

  const getMemberName = (id: string) =>
    state.familyMembers.find((m) => m.id === id)?.name ?? 'Family Member';

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberRel.trim()) {
      setMemberError('Please enter a name and relationship.');
      return;
    }
    inviteFamilyMember({
      name: memberName.trim(),
      relationship: memberRel.trim(),
      city: memberCity.trim() || 'India',
      role: memberRole,
      contactLabel: memberContact.trim() || 'Demo Invite · Local Only',
    });
    setMemberName('');
    setMemberRel('');
    setMemberCity('');
    setMemberContact('');
    setMemberError('');
    setInviteOpen(false);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskAssignee) {
      setTaskError('Please enter a task description and select an assignee.');
      return;
    }
    addCareTask({
      title: taskTitle.trim(),
      assignedToId: taskAssignee,
      dueDate: taskDue,
      category: taskCategory,
      notes: taskNotes.trim(),
      status: 'pending',
    });
    setTaskTitle('');
    setTaskNotes('');
    setTaskError('');
    setTaskOpen(false);
  };

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitTitle.trim() || !visitMemberId) {
      setVisitError('Please enter a visit title and choose who is visiting.');
      return;
    }
    addSharedVisit({
      memberId: visitMemberId,
      title: visitTitle.trim(),
      date: visitDate,
      time: visitTime,
      purpose: visitPurpose.trim() || 'Family visit',
      status: 'planned',
    });
    setVisitTitle('');
    setVisitPurpose('');
    setVisitError('');
    setVisitOpen(false);
  };

  // Respect senior-approved sharing permission when viewed in Family mode
  if (!isSenior && !careCircleAllowed) {
    return (
      <div className="space-y-6">
        <header className="pb-5 border-b border-[var(--border-hairline)]">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Family Care Circle
          </h1>
        </header>
        <div className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-8 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>Private · Care Circle sharing paused by Meera</span>
          </div>
          <p className="text-base text-[var(--text-primary)] font-medium">
            Meera has paused Care Circle coordination visibility right now.
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Caregiving tasks, member schedules, and shared visit entries remain hidden until Meera
            re-enables Care Circle sharing in the Privacy &amp; Consent Center.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Family Care Circle
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Coordinate errands, clinic accompaniment, and family visits without clutter or overlap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('privacy')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-[var(--deep-green)]" aria-hidden="true" />
            <span>{careCircleAllowed ? 'Shared with Circle' : 'Private'}</span>
          </button>

          <button
            type="button"
            onClick={() => setInviteOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            <span>Invite Family Member</span>
          </button>
        </div>
      </header>

      {/* Invite Member Form */}
      {inviteOpen && (
        <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Invite a Family Member (Local Demo)
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Adds a member locally for prototype coordination. Production invites require verified
            email/SMS delivery.
          </p>
          <form onSubmit={handleInviteSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fm-name" className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <input
                id="fm-name"
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="e.g. Vikram Joshi"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>
            <div>
              <label htmlFor="fm-rel" className="block text-sm font-medium mb-1">
                Relationship *
              </label>
              <input
                id="fm-rel"
                type="text"
                value={memberRel}
                onChange={(e) => setMemberRel(e.target.value)}
                placeholder="e.g. Nephew"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>
            <div>
              <label htmlFor="fm-city" className="block text-sm font-medium mb-1">
                City
              </label>
              <input
                id="fm-city"
                type="text"
                value={memberCity}
                onChange={(e) => setMemberCity(e.target.value)}
                placeholder="e.g. Pune"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>
            <div>
              <label htmlFor="fm-role" className="block text-sm font-medium mb-1">
                Circle Role
              </label>
              <select
                id="fm-role"
                value={memberRole}
                onChange={(e) =>
                  setMemberRole(e.target.value as 'Primary Coordinator' | 'Care Circle Member')
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              >
                <option value="Care Circle Member">Care Circle Member</option>
                <option value="Primary Coordinator">Primary Coordinator</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="fm-contact" className="block text-sm font-medium mb-1">
                Email or Phone Label
              </label>
              <input
                id="fm-contact"
                type="text"
                value={memberContact}
                onChange={(e) => setMemberContact(e.target.value)}
                placeholder="e.g. vikram@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>
            {memberError && <p className="md:col-span-2 text-sm text-[#A6513A]">{memberError}</p>}
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-hairline)] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium"
              >
                Send Demo Invite
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Segmented Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-white)] border border-[var(--border-hairline)]">
          {(
            [
              { id: 'tasks', label: `Care Tasks (${state.careTasks.length})` },
              { id: 'visits', label: `Shared Visits (${state.sharedVisits.length})` },
              { id: 'members', label: `Members (${state.familyMembers.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[var(--deep-green)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'tasks' && (
          <button
            type="button"
            onClick={() => setTaskOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] whitespace-nowrap"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Assign Task</span>
          </button>
        )}

        {activeTab === 'visits' && (
          <button
            type="button"
            onClick={() => setVisitOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Schedule Visit</span>
          </button>
        )}
      </div>

      {/* CARE TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="space-y-5">
          {taskOpen && (
            <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
              <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                New Caregiving Task
              </h2>
              <form onSubmit={handleTaskSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="ct-title" className="block text-sm font-medium mb-1">
                    Task Description *
                  </label>
                  <input
                    id="ct-title"
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Pick up monthly eye drops from pharmacy"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
                  />
                </div>
                <div>
                  <label htmlFor="ct-assignee" className="block text-sm font-medium mb-1">
                    Assign To *
                  </label>
                  <select
                    id="ct-assignee"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
                  >
                    {state.familyMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.relationship})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="ct-category" className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    id="ct-category"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as CareTask['category'])}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
                  >
                    <option value="Medicines">Medicines</option>
                    <option value="Clinic Visit">Clinic Visit</option>
                    <option value="Errands">Errands</option>
                    <option value="Check-in Call">Check-in Call</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ct-due" className="block text-sm font-medium mb-1">
                    Target Date
                  </label>
                  <input
                    id="ct-due"
                    type="date"
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="ct-notes" className="block text-sm font-medium mb-1">
                    Notes
                  </label>
                  <input
                    id="ct-notes"
                    type="text"
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    placeholder="Helpful context..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
                  />
                </div>
                {taskError && <p className="md:col-span-2 text-sm text-[#A6513A]">{taskError}</p>}
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setTaskOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--border-hairline)] text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
            {state.careTasks.length === 0 ? (
              <p className="p-8 text-center text-sm text-[var(--text-secondary)]">
                No caregiving tasks assigned yet.
              </p>
            ) : (
              state.careTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                      {task.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] tabular-nums">
                      Assigned to <span className="font-medium text-[var(--text-primary)]">{getMemberName(task.assignedToId)}</span>
                      <span aria-hidden="true"> · </span>
                      {task.category}
                      <span aria-hidden="true"> · </span>
                      Due {formatDisplayDate(task.dueDate)}
                    </p>
                    {task.notes && (
                      <p className="text-sm text-[var(--text-secondary)] pt-1">{task.notes}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <select
                      aria-label={`Status for ${task.title}`}
                      value={task.status}
                      onChange={(e) =>
                        updateCareTaskStatus(task.id, e.target.value as CareTaskStatus)
                      }
                      className="px-3 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-xs font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setDeleteTaskId(task.id)}
                      aria-label={`Delete ${task.title}`}
                      className="p-2 rounded-xl border border-[var(--border-hairline)] text-[#A6513A] hover:bg-[#F9F1ED]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      )}

      {/* SHARED VISITS TAB */}
      {activeTab === 'visits' && (
        <div className="space-y-5">
          {visitOpen && (
            <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
              <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Add to Shared Visit Calendar
              </h2>
              <form onSubmit={handleVisitSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sv-title" className="block text-sm font-medium mb-1">
                    Visit Title *
                  </label>
                  <input
                    id="sv-title"
                    type="text"
                    value={visitTitle}
                    onChange={(e) => setVisitTitle(e.target.value)}
                    placeholder="e.g. Afternoon tea & check-in"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
                  />
                </div>
                <div>
                  <label htmlFor="sv-member" className="block text-sm font-medium mb-1">
                    Who is Visiting? *
                  </label>
                  <select
                    id="sv-member"
                    value={visitMemberId}
                    onChange={(e) => setVisitMemberId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
                  >
                    {state.familyMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.relationship})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="sv-date" className="block text-sm font-medium mb-1">
                    Date
                  </label>
                  <input
                    id="sv-date"
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="sv-time" className="block text-sm font-medium mb-1">
                    Time
                  </label>
                  <input
                    id="sv-time"
                    type="time"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] tabular-nums"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="sv-purpose" className="block text-sm font-medium mb-1">
                    Purpose / Notes
                  </label>
                  <input
                    id="sv-purpose"
                    type="text"
                    value={visitPurpose}
                    onChange={(e) => setVisitPurpose(e.target.value)}
                    placeholder="e.g. Bringing groceries and catching up"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
                  />
                </div>
                {visitError && <p className="md:col-span-2 text-sm text-[#A6513A]">{visitError}</p>}
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setVisitOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--border-hairline)] text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium"
                  >
                    Add Visit
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
            {state.sharedVisits.length === 0 ? (
              <p className="p-8 text-center text-sm text-[var(--text-secondary)]">
                No family visits scheduled yet.
              </p>
            ) : (
              [...state.sharedVisits]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((visit) => (
                  <div
                    key={visit.id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                        {visit.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 tabular-nums">
                        {getMemberName(visit.memberId)} · {formatDisplayDate(visit.date)} at{' '}
                        {formatTime12h(visit.time)} ·{' '}
                        <span className="capitalize">{visit.status}</span>
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] mt-1.5">{visit.purpose}</p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleSharedVisitStatus(visit.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium ${
                          visit.status === 'completed'
                            ? 'bg-[var(--secondary-sage)] text-[var(--deep-green)]'
                            : 'bg-[var(--deep-green)] text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{visit.status === 'completed' ? 'Completed' : 'Mark Completed'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteSharedVisit(visit.id)}
                        aria-label={`Delete visit ${visit.title}`}
                        className="p-2 rounded-xl border border-[var(--border-hairline)] text-[#A6513A] hover:bg-[#F9F1ED]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </section>
        </div>
      )}

      {/* MEMBERS TAB */}
      {activeTab === 'members' && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {state.familyMembers.map((member) => {
            const assignedTasks = state.careTasks.filter((t) => t.assignedToId === member.id);
            const openTasks = assignedTasks.filter((t) => t.status !== 'completed').length;
            return (
              <article
                key={member.id}
                className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Users className="w-5 h-5 text-[var(--deep-green)]" aria-hidden="true" />
                  <span className="text-xs font-medium text-[var(--text-secondary)] capitalize">
                    {member.status === 'invited' ? 'Demo Invited' : 'Active'}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {member.relationship} · {member.city}
                  </p>
                </div>
                <div className="pt-3 border-t border-[var(--border-hairline)] text-xs text-[var(--text-secondary)] space-y-1">
                  <p>{member.role}</p>
                  <p>{member.contactLabel}</p>
                  <p className="tabular-nums font-medium text-[var(--text-primary)]">
                    {openTasks} open task{openTasks === 1 ? '' : 's'} assigned
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <ConfirmDialog
        open={Boolean(deleteTaskId)}
        title="Delete caregiving task?"
        description="This removes the task from the Family Care Circle list."
        confirmLabel="Delete Task"
        destructive
        onCancel={() => setDeleteTaskId(null)}
        onConfirm={() => {
          if (deleteTaskId) deleteCareTask(deleteTaskId);
          setDeleteTaskId(null);
        }}
      />
    </div>
  );
};
