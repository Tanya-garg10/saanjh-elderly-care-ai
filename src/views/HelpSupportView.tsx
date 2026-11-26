import React, { useState } from 'react';
import { LifeBuoy, Info, CheckCircle2, UserPlus, Trash2 } from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { ConfirmDialog } from '../components/ConfirmDialog';

const HELP_REASONS = [
  'Want to talk to family',
  'Need help with a medicine',
  'Feeling tired or unwell',
  'Need help with an errand or appointment',
  'Something else',
];

export const HelpSupportView: React.FC = () => {
  const {
    state,
    submitHelpRequest,
    acknowledgeHelpRequestDemo,
    addTrustedContact,
    deleteTrustedContact,
  } = useSaanjh();

  const defaultContact =
    state.trustedContacts.find((c) => c.isDefault) ?? state.trustedContacts[0];
  const [selectedContactId, setSelectedContactId] = useState<string>(defaultContact?.id ?? '');
  const [selectedReason, setSelectedReason] = useState(HELP_REASONS[0]);
  const [message, setMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Add Trusted Contact form
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRel, setNewRel] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [contactError, setContactError] = useState('');

  const selectedContact = state.trustedContacts.find((c) => c.id === selectedContactId);

  const handleConfirmHelp = () => {
    submitHelpRequest(selectedReason, message, selectedContactId);
    setConfirmOpen(false);
    setMessage('');
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 5000);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRel.trim()) {
      setContactError('Please enter a name and relationship.');
      return;
    }
    addTrustedContact({
      name: newName.trim(),
      relationship: newRel.trim(),
      phoneLabel: newPhone.trim() || 'Demo Contact · Local Only',
      notes: 'Added by Meera',
      isDefault: state.trustedContacts.length === 0,
    });
    setNewName('');
    setNewRel('');
    setNewPhone('');
    setContactError('');
    setContactFormOpen(false);
  };

  return (
    <div className="space-y-8">
      <header className="pb-5 border-b border-[var(--border-hairline)]">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Trusted Contact Help Flow
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Choose a trusted contact and record a calm support request whenever you want assistance.
        </p>
      </header>

      {/* Honest Offline Transmission Notice */}
      <div className="rounded-2xl bg-[#F9F1ED] border border-[#E8D5CD] px-5 py-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#9B543C] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">
          <span className="font-semibold">Local demo notice:</span> Requests recorded here are
          saved locally in your browser&apos;s storage. Saanjh does not send live emergency alerts,
          SMS messages, or phone calls without an external telecommunications backend.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Choose Trusted Contact & Record Help Request */}
        <section className="lg:col-span-6 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                1. Choose Trusted Contact
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Who should this request be addressed to?
              </p>
            </div>
            <button
              type="button"
              onClick={() => setContactFormOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--secondary-sage)] whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add Contact</span>
            </button>
          </div>

          {contactFormOpen && (
            <form
              onSubmit={handleAddContact}
              className="p-4 rounded-xl bg-[var(--bg-ivory)] border border-[var(--border-hairline)] space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tc-name" className="block text-xs font-medium mb-1">
                    Name *
                  </label>
                  <input
                    id="tc-name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dr. Kulkarni Desk"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="tc-rel" className="block text-xs font-medium mb-1">
                    Relationship *
                  </label>
                  <input
                    id="tc-rel"
                    type="text"
                    value={newRel}
                    onChange={(e) => setNewRel(e.target.value)}
                    placeholder="e.g. Neighbour"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="tc-phone" className="block text-xs font-medium mb-1">
                  Phone Label (Demo)
                </label>
                <input
                  id="tc-phone"
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +91 98XXX XX000"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm"
                />
              </div>
              {contactError && <p className="text-xs text-[#A6513A]">{contactError}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setContactFormOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-hairline)] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--deep-green)] text-white text-xs font-medium"
                >
                  Save Contact
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2" role="radiogroup" aria-label="Trusted contacts">
            {state.trustedContacts.map((contact) => {
              const active = selectedContactId === contact.id;
              return (
                <div
                  key={contact.id}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                    active
                      ? 'border-[var(--deep-green)] bg-[var(--secondary-sage)]'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-ivory)]'
                  }`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelectedContactId(contact.id)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {contact.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {contact.relationship} · {contact.phoneLabel}
                    </p>
                  </button>
                  {state.trustedContacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteTrustedContact(contact.id)}
                      aria-label={`Remove ${contact.name}`}
                      className="p-1.5 rounded-lg text-[#A6513A] hover:bg-white/60"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
              2. Reason for Help
            </h2>
            <div className="space-y-2">
              {HELP_REASONS.map((reason) => {
                const active = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                      active
                        ? 'border-[#9B543C] bg-[#F9F1ED] font-medium text-[var(--text-primary)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-[var(--text-primary)] hover:bg-[#F1F3EF]'
                    }`}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="help-message" className="block text-sm font-medium mb-1.5">
              Optional message
            </label>
            <textarea
              id="help-message"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Please call me after 5 PM when you are free..."
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm"
            />
          </div>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="w-full py-4 px-6 rounded-2xl bg-[#A6513A] text-white font-display text-lg font-semibold hover:bg-[#8E432F] transition-colors flex items-center justify-center gap-3"
          >
            <LifeBuoy className="w-6 h-6" aria-hidden="true" />
            <span>I Need Help</span>
          </button>

          {justSubmitted && (
            <div
              role="status"
              className="rounded-xl bg-[var(--secondary-sage)] border border-[var(--border-hairline)] p-4 flex items-start gap-2.5 text-sm text-[var(--deep-green)]"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <p>
                Request saved locally for {selectedContact?.name ?? 'your trusted contact'}. No
                external SMS or emergency alert was sent in this offline demo.
              </p>
            </div>
          )}
        </section>

        {/* Right: Request History */}
        <section className="lg:col-span-6 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] pb-3 border-b border-[var(--border-hairline)]">
            Support Request History
          </h2>

          {state.helpRequests.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                No support requests have been recorded yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-hairline)]">
              {state.helpRequests.map((req) => (
                <div key={req.id} className="py-4 space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">
                      {req.reason}
                    </h3>
                    <span className="text-xs text-[var(--text-secondary)] tabular-nums shrink-0">
                      {req.createdAt}
                    </span>
                  </div>

                  {req.trustedContactName && (
                    <p className="text-xs text-[var(--text-secondary)]">
                      Intended Contact: <span className="font-medium">{req.trustedContactName}</span>
                    </p>
                  )}

                  {req.message && (
                    <p className="text-sm text-[var(--text-secondary)]">{req.message}</p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-xs font-medium text-[#9B543C]">
                      Transmission:{' '}
                      {req.status === 'saved-locally'
                        ? 'Recorded locally only (not transmitted)'
                        : 'Demo acknowledged locally'}
                    </span>

                    {req.status === 'saved-locally' && (
                      <button
                        type="button"
                        onClick={() => acknowledgeHelpRequestDemo(req.id)}
                        className="text-xs font-medium text-[var(--deep-green)] underline"
                      >
                        Mark Demo Acknowledged
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm local support request?"
        description={`This will record "${selectedReason}" for ${selectedContact?.name ?? 'your trusted contact'} in local browser storage. No live alert, SMS, or emergency call is transmitted in this offline prototype.`}
        confirmLabel="Record Request Locally"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmHelp}
      />
    </div>
  );
};
