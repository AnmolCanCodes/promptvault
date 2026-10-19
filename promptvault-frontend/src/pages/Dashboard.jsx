
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collectionService } from '../services/collectionService';
import Button from '../components/Button';

const FolderIcon = ({ className = 'h-5 w-5' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.5 7.5a2 2 0 0 1 2-2H10l2 2h6.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
    <path d="M3.5 10h17" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Dashboard = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await collectionService.getCollections();
      setCollections(data);
    } catch {
      setError('We couldn’t load your collections. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchCollections);
  }, [fetchCollections]);

  const totalPrompts = collections.reduce(
    (total, collection) =>
      total +
      (collection.prompt_count ?? collection.prompts?.length ?? 0),
    0
  );

  const openCollection = (id) => {
    navigate(`/collections/${id}`);
  };

  return (
    <main className="mx-auto w-full max-w-360 px-5 py-9 sm:px-8 lg:px-10">

      {/* =====================================
          PAGE INTRODUCTION
      ===================================== */}

      <section className="mb-9 flex flex-col justify-between gap-5 border-b border-(--color-border) pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary)" />
            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-(--color-text-muted)">
              Your workspace
            </span>
          </div>

          <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.055em] text-(--color-text) sm:text-[38px]">
            Your ideas, <span className="font-normal italic" style={{ fontFamily: 'var(--font-display)' }}>organized.</span>
          </h1>

          <p className="mt-3 max-w-lg text-[13px] leading-6 text-(--color-text-secondary)">
            A home for the prompts worth keeping.
            Organize your thinking, build your library and reuse your best work.
          </p>
        </div>

        <Button
          onClick={() => navigate('/collections')}
          className="shrink-0 self-start sm:self-auto"
        >
          <span>Explore collections</span>
          <ArrowIcon />
        </Button>
      </section>

      {/* =====================================
          LIBRARY OVERVIEW
      ===================================== */}

      <section className="mb-11 grid grid-cols-1 gap-3 sm:grid-cols-2">

        <div className="flex items-center justify-between rounded-md border border-(--color-border) bg-(--color-bg-elevated) px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-(--color-text-muted)">
              Total collections
            </p>

            <p className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.06em] text-(--color-text) tabular-nums">
              {loading ? '—' : collections.length}
            </p>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-md bg-(--color-bg-subtle) text-(--color-text-secondary)">
            <FolderIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border border-(--color-border) bg-(--color-bg-elevated) px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-(--color-text-muted)">
              Prompts saved
            </p>

            <p className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.06em] text-(--color-text) tabular-nums">
              {loading ? '—' : totalPrompts}
            </p>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-md bg-(--color-primary-light) text-(--color-primary)">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
              <path d="M14 3.5v5h4M9 13h6M9 17h6" />
            </svg>
          </div>
        </div>
      </section>

      {/* =====================================
          COLLECTION LIBRARY
      ===================================== */}

      <section>

        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-(--color-primary)">
              THE LIBRARY
            </div>

            <h2 className="text-[22px] font-semibold tracking-[-0.045em] text-(--color-text)">
              Your collections
            </h2>

            <p className="mt-1 text-xs text-(--color-text-muted)">
              Everything you've organized, in one place.
            </p>
          </div>

          {!loading && collections.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className="hidden items-center gap-2 text-xs font-semibold text-(--color-primary) transition-colors hover:text-(--color-primary-hover) sm:flex"
            >
              View all
              <ArrowIcon />
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-65 items-center justify-center rounded-md border border-(--color-border) bg-(--color-bg-elevated)">
            <div className="flex items-center gap-3 text-xs font-medium text-(--color-text-muted)">
              <span className="spinner" />
              Organizing your library...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-md border border-(--color-error)/20 bg-(--color-error-bg) p-6">
            <p className="text-sm font-semibold text-(--color-error)">
              Unable to load your library
            </p>

            <p className="mt-1 text-xs text-(--color-text-secondary)">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchCollections}
              className="mt-4 text-xs font-bold text-(--color-error) underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && collections.length === 0 && (
          <div className="relative overflow-hidden rounded-md border border-dashed border-(--color-border-strong) bg-(--color-bg-elevated) px-6 py-16 text-center sm:py-20">

            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-lg border border-(--color-border) bg-(--color-bg-subtle) text-(--color-text-secondary)">
              <FolderIcon className="h-7 w-7" />
            </div>

            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-(--color-primary)">
              A blank canvas
            </p>

            <h3 className="text-xl font-semibold tracking-tight text-(--color-text)">
              Your library starts here.
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-(--color-text-muted)">
              Create your first collection. Group prompts by project,
              workflow, client or whatever makes sense to you.
            </p>

            <div className="mt-6">
              <Button onClick={() => navigate('/collections')}>
                <span>Create your first collection</span>
                <ArrowIcon />
              </Button>
            </div>
          </div>
        )}

        {/* Collection cards */}
        {!loading && !error && collections.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection, index) => {
              const promptCount =
                collection.prompt_count ??
                collection.prompts?.length ??
                0;

              return (
                <button
                  type="button"
                  key={collection.id}
                  onClick={() => openCollection(collection.id)}
                  className="
                    group relative flex min-h-47.5 flex-col
                    overflow-hidden rounded-md
                    border border-(--color-border)
                    bg-(--color-bg-elevated)
                    p-5 text-left
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:border-(--color-primary-border)
                    hover:shadow-(--shadow-md)
                    focus-visible:outline-2
                    focus-visible:outline-(--color-primary)
                  "
                >
                  {/* Card header */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-(--color-bg-subtle) text-(--color-text-secondary) transition-colors group-hover:bg-(--color-primary-light) group-hover:text-(--color-primary)">
                      <FolderIcon />
                    </div>

                    <span className="font-mono text-[10px] text-(--color-text-subtle)">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Card information */}
                  <div className="flex-1">
                    <h3 className="line-clamp-1 text-[16px] font-semibold tracking-[-0.035em] text-(--color-text) transition-colors group-hover:text-(--color-primary)">
                      {collection.name}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 min-h-9.5 text-xs leading-[1.7] text-(--color-text-muted)">
                      {collection.description || 'A space for your saved prompts.'}
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-(--color-border) pt-3.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
                      {promptCount} {promptCount === 1 ? 'PROMPT' : 'PROMPTS'}
                    </span>

                    <span className="flex items-center gap-1.5 text-xs font-semibold text-(--color-text-muted) transition-all group-hover:gap-2 group-hover:text-(--color-primary)">
                      Open
                      <ArrowIcon />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-14 border-t border-(--color-border) pt-5">
        <div className="flex flex-col justify-between gap-2 text-[10px] text-(--color-text-subtle) sm:flex-row">
          <span>PromptVault / Your personal prompt library</span>
          <span>Keep your best prompts close.</span>
        </div>
      </footer>
    </main>
  );
};

export default Dashboard;
