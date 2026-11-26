import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Lock,
  Eye,
  Info,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { formatDisplayDate, getOffsetDateISO } from '../data/seedData';
import { DocumentCategory, HealthDocument } from '../types/saanjh';
import { ConfirmDialog } from '../components/ConfirmDialog';

const CATEGORIES: DocumentCategory[] = [
  'Prescription',
  'Lab Report',
  'Clinic Summary',
  'Insurance / ID',
  'Other',
];

export const DocumentVaultView: React.FC = () => {
  const { state, addDocument, updateDocument, deleteDocument, navigate } = useSaanjh();
  const [categoryFilter, setCategoryFilter] = useState<'All' | DocumentCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<HealthDocument | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Prescription');
  const [documentDate, setDocumentDate] = useState(getOffsetDateISO(0));
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [sharedWithFamily, setSharedWithFamily] = useState(true);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<HealthDocument | null>(null);

  const openAdd = () => {
    setEditingDoc(null);
    setTitle('');
    setCategory('Prescription');
    setDocumentDate(getOffsetDateISO(0));
    setSource('');
    setDescription('');
    setAttachmentName('');
    setSharedWithFamily(true);
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (doc: HealthDocument) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setCategory(doc.category);
    setDocumentDate(doc.documentDate);
    setSource(doc.source);
    setDescription(doc.description);
    setAttachmentName(doc.attachmentName ?? '');
    setSharedWithFamily(doc.sharedWithFamily);
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !documentDate) {
      setFormError('Please provide a document title and date.');
      return;
    }
    if (editingDoc) {
      updateDocument(editingDoc.id, {
        title: title.trim(),
        category,
        documentDate,
        source: source.trim() || 'Personal entry',
        description: description.trim(),
        attachmentName: attachmentName.trim() || undefined,
        sharedWithFamily,
      });
    } else {
      addDocument({
        title: title.trim(),
        category,
        documentDate,
        source: source.trim() || 'Personal entry',
        description: description.trim(),
        attachmentName: attachmentName.trim() || undefined,
        sharedWithFamily,
      });
    }
    setFormOpen(false);
    setEditingDoc(null);
  };

  const filteredDocs = state.documents
    .filter((d) => {
      if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
      if (
        searchQuery.trim() &&
        !`${d.title} ${d.source} ${d.description}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.documentDate.localeCompare(a.documentDate));

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Health Document Vault
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Organize prescriptions, lab reports, and clinic summaries with clear sharing controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('privacy')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-[var(--deep-green)]" aria-hidden="true" />
            <span>
              Vault Sharing: {state.privacy.documents ? 'Enabled' : 'Paused'}
            </span>
          </button>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Document</span>
          </button>
        </div>
      </header>

      {/* Honest Local MVP Limitation Notice */}
      <div className="rounded-2xl bg-[#F9F1ED] border border-[#E8D5CD] px-5 py-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#9B543C] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">
          <span className="font-semibold">MVP Local Storage Notice:</span> Document entries and
          filenames are saved locally in browser <code>localStorage</code> for demonstration only.
          This prototype does not provide encrypted cloud medical storage or production healthcare
          compliance.
        </p>
      </div>

      {/* Add / Edit Form */}
      {formOpen && (
        <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            {editingDoc ? 'Edit Document Entry' : 'Add Health Document'}
          </h2>
          <form onSubmit={handleSave} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="doc-title" className="block text-sm font-medium mb-1">
                Document Title *
              </label>
              <input
                id="doc-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Eye Checkup Prescription"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div>
              <label htmlFor="doc-cat" className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                id="doc-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="doc-date" className="block text-sm font-medium mb-1">
                Document Date *
              </label>
              <input
                id="doc-date"
                type="date"
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="doc-source" className="block text-sm font-medium mb-1">
                Doctor / Clinic / Lab
              </label>
              <input
                id="doc-source"
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Sahyadri Clinic"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="doc-file" className="block text-sm font-medium mb-1">
                Local File Reference (optional filename)
              </label>
              <input
                id="doc-file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAttachmentName(`${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB metadata)`);
                }}
                className="w-full px-4 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm"
              />
              {attachmentName && (
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Selected reference: {attachmentName}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="doc-desc" className="block text-sm font-medium mb-1">
                Description / Summary
              </label>
              <textarea
                id="doc-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key details from this prescription or report..."
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <input
                id="doc-share"
                type="checkbox"
                checked={sharedWithFamily}
                onChange={(e) => setSharedWithFamily(e.target.checked)}
                className="w-4 h-4 accent-[var(--deep-green)]"
              />
              <label htmlFor="doc-share" className="text-sm text-[var(--text-primary)]">
                Allow Family Dashboard to view this document (when Document Vault sharing is on)
              </label>
            </div>

            {formError && <p className="md:col-span-2 text-sm text-[#A6513A]">{formError}</p>}

            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-hairline)] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium"
              >
                {editingDoc ? 'Save Changes' : 'Save Document'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[var(--surface-white)] border border-[var(--border-hairline)] w-fit">
          {(['All', ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[var(--deep-green)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <label htmlFor="doc-search" className="sr-only">
            Search documents
          </label>
          <input
            id="doc-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm"
          />
        </div>
      </div>

      {/* Document List */}
      <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
        {filteredDocs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-base text-[var(--text-secondary)]">
              No health documents match this filter.
            </p>
            <button
              type="button"
              onClick={openAdd}
              className="mt-4 px-4 py-2 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium"
            >
              Add First Document
            </button>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const effectivelyShared = doc.sharedWithFamily && state.privacy.documents;
            return (
              <article
                key={doc.id}
                className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--deep-green)]" aria-hidden="true" />
                    <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                      {doc.title}
                    </h2>
                    <span className="text-xs text-[var(--text-secondary)]">
                      · {doc.category} · {formatDisplayDate(doc.documentDate)}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)]">{doc.source}</p>
                  {doc.description && (
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {doc.description}
                    </p>
                  )}
                  {doc.attachmentName && (
                    <p className="text-xs text-[var(--deep-green)]">
                      Reference: {doc.attachmentName}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      updateDocument(doc.id, { sharedWithFamily: !doc.sharedWithFamily })
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap ${
                      effectivelyShared
                        ? 'bg-[var(--secondary-sage)] text-[var(--deep-green)]'
                        : 'border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {effectivelyShared ? (
                      <>
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Shared</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          {!state.privacy.documents ? 'Paused Globally' : 'Private'}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(doc)}
                    aria-label={`Edit ${doc.title}`}
                    className="p-2 rounded-xl border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--secondary-sage)]"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(doc)}
                    aria-label={`Delete ${doc.title}`}
                    className="p-2 rounded-xl border border-[var(--border-hairline)] text-[#A6513A] hover:bg-[#F9F1ED]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete health document?"
        description={`Remove "${deleteTarget?.title ?? ''}" from your local document list?`}
        confirmLabel="Delete Document"
        destructive
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteDocument(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};
