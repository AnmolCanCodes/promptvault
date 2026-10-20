import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { promptService } from '../services/promptService';
import Button from '../components/Button';
import Input from '../components/Input';

const PromptEditor = () => {
  const { id, collectionId: urlCollectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const collectionId = urlCollectionId || location.state?.collectionId;
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState('');

  const fetchPrompt = useCallback(async () => {
    try {
      setFetchLoading(true);

      const prompt = await promptService.getPrompt(id);

      setFormData({
        title: prompt.title || '',
        content: prompt.content || '',
      });
    } catch {
      setError('Unable to load this prompt. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing && id) {
      queueMicrotask(fetchPrompt);
    }
  }, [fetchPrompt, id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Both the prompt title and content are required.');
      return;
    }

    if (!isEditing && !collectionId) {
      setError('Collection ID is required to create a prompt.');
      return;
    }

    setLoading(true);

    try {
      if (isEditing && id) {
        await promptService.updatePrompt(
          id,
          formData.title,
          formData.content
        );
      } else {
        await promptService.createPrompt(
          collectionId,
          formData.title,
          formData.content
        );
      }

      navigate(`/collections/${collectionId}`);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to save prompt. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/collections/${collectionId}`);
  };

  const wordCount = formData.content.trim()
    ? formData.content.trim().split(/\s+/).length
    : 0;

  if (fetchLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-xs font-medium text-(--color-text-muted)">
          <span className="spinner" />
          Retrieving your prompt...
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 py-9 sm:px-8 lg:py-12">

      {/* =====================================
          TOP NAVIGATION
      ===================================== */}

      <button
        type="button"
        onClick={handleCancel}
        className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold text-(--color-text-muted) transition-colors hover:text-(--color-primary)"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to collection
      </button>

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <section className="mb-8 border-b border-(--color-border) pb-7">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary)" />

          <span className="text-[10px] font-bold tracking-[0.17em] uppercase text-(--color-text-muted)">
            PROMPT WORKSPACE
          </span>

          <span className="text-[10px] text-(--color-text-subtle)">/</span>

          <span className="text-[10px] font-semibold tracking-wider uppercase text-(--color-primary)">
            {isEditing ? 'EDITING' : 'NEW DOCUMENT'}
          </span>
        </div>

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.055em] text-(--color-text) sm:text-[38px]">
              {isEditing ? 'Refine your prompt.' : 'Capture a good idea.'}
            </h1>

            <p className="mt-2 max-w-xl text-[13px] leading-6 text-(--color-text-muted)">
              {isEditing
                ? 'Make changes to your saved prompt. Your updated version will be stored in your collection.'
                : 'Give your prompt a memorable name and write something worth keeping.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-medium text-(--color-text-subtle)">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-success)" />
            Local editing session
          </div>
        </div>
      </section>

      {/* =====================================
          ERROR MESSAGE
      ===================================== */}

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-md border border-(--color-error)/20 bg-(--color-error-bg) p-4"
        >
          <svg
            viewBox="0 0 24 24"
            className="mt-0.5 h-4 w-4 shrink-0 text-(--color-error)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5m0 3h.01" />
          </svg>

          <p className="text-xs font-medium text-(--color-error)">
            {error}
          </p>
        </div>
      )}

      {/* =====================================
          EDITOR FORM
      ===================================== */}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Document metadata */}
        <section className="rounded-md border border-(--color-border) bg-(--color-bg-elevated) p-5 sm:p-6">

          <div className="mb-5 flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-(--color-text-muted)">
              DOCUMENT DETAILS
            </span>

            <span className="font-mono text-[10px] text-(--color-text-subtle)">
              01 / 02
            </span>
          </div>

          <Input
            label="Prompt title"
            placeholder="e.g. SaaS landing page copywriter"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={150}
            required
          />

          <p className="mt-2 text-right font-mono text-[10px] text-(--color-text-subtle)">
            {formData.title.length} / 150
          </p>
        </section>

        {/* Main editor */}
        <section className="overflow-hidden rounded-md border border-(--color-border-strong) bg-(--color-bg-elevated)">

          {/* Editor toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--color-border) bg-(--color-bg-subtle) px-4 py-3 sm:px-5">

            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-(--color-primary)"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
                <path d="M14 3.5v5h4M9 13h6M9 17h6" />
              </svg>

              <span className="text-[10px] font-bold tracking-[0.13em] uppercase text-(--color-text-secondary)">
                PROMPT CONTENT
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded border border-(--color-border) bg-(--color-bg-elevated) px-2 py-1 font-mono text-[9px] text-(--color-text-muted)">
                PLAIN TEXT
              </span>

              <span className="font-mono text-[10px] text-(--color-text-subtle)">
                UTF-8
              </span>
            </div>
          </div>

          {/* Writing surface */}
          <div className="relative">

            <div className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-12 select-none border-r border-(--color-border) bg-(--color-bg)/60 pt-6 text-center font-mono text-[10px] leading-[1.85rem] text-(--color-text-subtle) sm:block">
              {Array.from(
                { length: Math.max(12, formData.content.split('\n').length) },
                (_, i) => (
                  <div key={i + 1}>{i + 1}</div>
                )
              )}
            </div>

            <textarea
              name="content"
              aria-label="Prompt content"
              placeholder={`You are an expert in [your field].

Your task is to...

Context:
[Provide the relevant context]

Requirements:
1. ...
2. ...
3. ...

Expected output:
[Describe what a good result looks like]`}
              value={formData.content}
              onChange={handleChange}
              className="
                block min-h-[420px] w-full resize-y
                border-0 bg-transparent
                px-5 py-6
                font-mono text-[13px] leading-[1.85rem]
                text-(--color-text)
                placeholder:text-(--color-text-subtle)
                placeholder:opacity-70
                focus:border-0 focus:ring-0 focus:shadow-none
                sm:pl-[68px] sm:pr-7
              "
              rows={18}
              required
            />
          </div>

          {/* Editor footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--color-border) bg-(--color-bg-subtle) px-4 py-3 sm:px-5">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-(--color-text-muted)">
                {formData.content.length} CHARACTERS
              </span>

              <span className="h-3 w-px bg-(--color-border-strong)" />

              <span className="font-mono text-[10px] text-(--color-text-muted)">
                {wordCount} WORDS
              </span>
            </div>

            <span className="text-[10px] text-(--color-text-subtle)">
              {formData.content.split('\n').length} lines
            </span>
          </div>
        </section>

        {/* =====================================
            SAVE ACTIONS
        ===================================== */}

        <div className="flex flex-col-reverse justify-between gap-4 border-t border-(--color-border) pt-5 sm:flex-row sm:items-center">

          <p className="max-w-xs text-[11px] leading-5 text-(--color-text-muted)">
            {isEditing
              ? 'Your changes will update the existing prompt.'
              : 'Your prompt will be saved to the selected collection.'}
          </p>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="large"
              disabled={loading}
              className="min-w-[145px]"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditing ? 'Save changes' : 'Save prompt'}

                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default PromptEditor;