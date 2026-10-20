import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collectionService } from '../services/collectionService';
import { promptService } from '../services/promptService';
import Button from '../components/Button';

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 7.5a2 2 0 0 1 2-2H10l2 2h6.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
    <path d="M3.5 10h17" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
  </svg>
);

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchCollectionData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [collectionData, promptsData] = await Promise.all([
        collectionService.getCollection(id),
        promptService.getPrompts(id),
      ]);

      setCollection(collectionData);
      setPrompts(promptsData);
    } catch {
      setError('Unable to load this collection. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    queueMicrotask(fetchCollectionData);
  }, [fetchCollectionData]);

  const isOwner = collection?.user_id === user?.id;

  const handleDeletePrompt = async (promptId) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      await promptService.deletePrompt(promptId);
      await fetchCollectionData();
    } catch {
      setError('Failed to delete prompt. Please try again.');
    }
  };

  const handleEditPrompt = (promptId) => {
    navigate(`/prompts/${promptId}/edit`, {
      state: { collectionId: id },
    });
  };

  const handleCreatePrompt = () => {
    navigate(`/prompts/new/${id}`);
  };

  const handleCopyPrompt = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content || '');
      setCopiedId(prompt.id);

      window.setTimeout(() => {
        setCopiedId((current) =>
          current === prompt.id ? null : current
        );
      }, 1800);
    } catch {
      setError('Unable to copy prompt. Check your browser clipboard permissions.');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Date unavailable';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date unavailable';
    }

    return parsedDate.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-xs font-medium text-(--color-text-muted)">
          <span className="spinner" />
          Opening your collection...
        </div>
      </div>
    );
  }

  if (error && !collection) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-12">
        <div className="rounded-md border border-(--color-error)/20 bg-(--color-error-bg) p-6">
          <h2 className="text-sm font-semibold text-(--color-error)">
            Collection unavailable
          </h2>

          <p className="mt-2 text-xs text-(--color-text-secondary)">
            {error || 'Collection not found.'}
          </p>

          <button
            type="button"
            onClick={fetchCollectionData}
            className="mt-4 text-xs font-bold text-(--color-error) underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!collection) return null;

  return (
    <main className="mx-auto w-full max-w-[1250px] px-5 py-9 sm:px-8 lg:py-12">

      {/* =====================================
          BREADCRUMB
      ===================================== */}

      <button
        type="button"
        onClick={() => navigate('/collections')}
        className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold text-(--color-text-muted) transition-colors hover:text-(--color-primary)"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M19 12H5m7 7-7-7 7-7" />
        </svg>
        All collections
      </button>

      {/* =====================================
          COLLECTION HEADER
      ===================================== */}

      <section className="mb-9 overflow-hidden rounded-md border border-(--color-border) bg-(--color-bg-elevated)">

        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">

          <div className="flex min-w-0 gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md border border-(--color-primary-border) bg-(--color-primary-light) text-(--color-primary)">
              <FolderIcon />
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-(--color-primary)">
                  COLLECTION
                </span>

                <span className="text-[10px] text-(--color-text-subtle)">
                  /
                </span>

                <span className="font-mono text-[10px] text-(--color-text-muted)">
                  {prompts.length} {prompts.length === 1 ? 'DOCUMENT' : 'DOCUMENTS'}
                </span>
              </div>

              <h1 className="break-words text-[28px] font-semibold tracking-[-0.05em] text-(--color-text) sm:text-[34px]">
                {collection.name}
              </h1>

              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-(--color-text-muted)">
                {collection.description || 'No description added yet.'}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded border border-(--color-border) bg-(--color-bg-subtle) px-2.5 py-1.5 text-[10px] font-semibold text-(--color-text-secondary)">
                  <span className={`h-1.5 w-1.5 rounded-full ${isOwner ? 'bg-(--color-success)' : 'bg-(--color-info)'}`} />
                  {isOwner ? 'YOUR COLLECTION' : 'READ ONLY'}
                </span>

                <span className="text-[10px] text-(--color-text-subtle)">
                  {isOwner ? 'You manage this collection' : 'Shared collection'}
                </span>
              </div>
            </div>
          </div>

          {isOwner && (
            <Button
              onClick={handleCreatePrompt}
              className="shrink-0 self-start"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 5v14m-7-7h14" />
              </svg>
              New prompt
            </Button>
          )}
        </div>

        {/* Collection summary strip */}
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-(--color-border) bg-(--color-bg-subtle) px-6 py-3 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider uppercase text-(--color-text-muted)">
              Saved prompts
            </span>
            <span className="font-mono text-xs font-semibold text-(--color-text)">
              {prompts.length}
            </span>
          </div>

          <span className="h-3 w-px bg-(--color-border-strong)" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider uppercase text-(--color-text-muted)">
              Access
            </span>
            <span className="text-[10px] font-semibold text-(--color-text-secondary)">
              {isOwner ? 'Full access' : 'View only'}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================
          ERROR NOTIFICATION
      ===================================== */}

      {error && (
        <div role="alert" className="mb-5 rounded-md border border-(--color-error)/20 bg-(--color-error-bg) p-3 text-xs font-medium text-(--color-error)">
          {error}
        </div>
      )}

      {/* =====================================
          PROMPT LIBRARY HEADER
      ===================================== */}

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-(--color-primary)">
              INSIDE THIS COLLECTION
            </p>

            <h2 className="text-[22px] font-semibold tracking-[-0.045em] text-(--color-text)">
              Saved prompts
            </h2>
          </div>

          <span className="font-mono text-[10px] text-(--color-text-muted)">
            {String(prompts.length).padStart(2, '0')} ITEMS
          </span>
        </div>

        {/* =====================================
            EMPTY STATE
        ===================================== */}

        {prompts.length === 0 && (
          <div className="rounded-md border border-dashed border-(--color-border-strong) bg-(--color-bg-elevated) px-6 py-16 text-center">

            <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-md border border-(--color-border) bg-(--color-bg-subtle) text-(--color-text-secondary)">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
                <path d="M14 3.5v5h4M9 13h6M9 17h6" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold tracking-tight text-(--color-text)">
              Nothing saved here yet.
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-(--color-text-muted)">
              {isOwner
                ? 'Start building this collection by adding your first reusable prompt.'
                : 'This collection does not contain any prompts yet.'}
            </p>

            {isOwner && (
              <div className="mt-6">
                <Button onClick={handleCreatePrompt}>
                  Create first prompt
                  <ArrowIcon />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* =====================================
            PROMPT DOCUMENTS
        ===================================== */}

        {prompts.length > 0 && (
          <div className="space-y-3">
            {prompts.map((prompt, index) => (
              <article
                key={prompt.id}
                className="overflow-hidden rounded-md border border-(--color-border) bg-(--color-bg-elevated) transition-all duration-200 hover:border-(--color-border-strong) hover:shadow-sm"
              >
                {/* Prompt header */}
                <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">

                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-(--color-bg-subtle) text-(--color-text-muted)">
                      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
                        <path d="M14 3.5v5h4" />
                        <path d="M9 13h6M9 17h6" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[9px] text-(--color-text-subtle)">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-(--color-border-strong)" />

                        <span className="text-[9px] font-semibold tracking-wider uppercase text-(--color-text-subtle)">
                          PROMPT
                        </span>
                      </div>

                      <h3 className="break-words text-[15px] font-semibold tracking-[-0.025em] text-(--color-text)">
                        {prompt.title || 'Untitled Prompt'}
                      </h3>

                      <p className="mt-1 text-[10px] text-(--color-text-muted)">
                        Created {formatDate(prompt.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(prompt)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-(--color-border) px-2.5 text-[10px] font-semibold text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-subtle)"
                    >
                      {copiedId === prompt.id ? (
                        <>
                          <span className="text-(--color-success)">✓</span>
                          Copied
                        </>
                      ) : (
                        <>
                          <CopyIcon />
                          Copy
                        </>
                      )}
                    </button>

                    {isOwner && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditPrompt(prompt.id)}
                          className="h-8 rounded-md border border-(--color-border) px-2.5 text-[10px] font-semibold text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-subtle) hover:text-(--color-text)"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="h-8 rounded-md border border-transparent px-2.5 text-[10px] font-semibold text-(--color-error) transition-colors hover:border-(--color-error)/20 hover:bg-(--color-error-bg)"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Prompt preview */}
                <div className="mx-5 mb-5 overflow-hidden rounded-md border border-(--color-border) bg-(--color-bg) sm:mx-6">

                  <div className="flex items-center justify-between border-b border-(--color-border) px-4 py-2.5">
                    <span className="text-[9px] font-bold tracking-[0.13em] uppercase text-(--color-text-subtle)">
                      CONTENT PREVIEW
                    </span>

                    <span className="font-mono text-[9px] text-(--color-text-subtle)">
                      {prompt.content?.length || 0} CHARS
                    </span>
                  </div>

                  <pre className="max-h-[190px] overflow-y-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-[11px] leading-[1.9] text-(--color-text-secondary)">
                    {prompt.content || 'No content available.'}
                  </pre>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-(--color-border) pt-5">
        <p className="text-[10px] text-(--color-text-subtle)">
          PROMPTVAULT / COLLECTION / {collection.name.toUpperCase()}
        </p>
      </footer>
    </main>
  );
};

export default CollectionDetail;