import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#26352F]/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="confirm-dialog-title"
            className="text-lg font-semibold text-[var(--text-primary)]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--secondary-sage)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] transition-colors whitespace-nowrap shrink-0"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors whitespace-nowrap shrink-0 ${
              destructive
                ? 'bg-[#A6513A] hover:bg-[#8E432F]'
                : 'bg-[var(--deep-green)] hover:bg-[#2A493C]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
