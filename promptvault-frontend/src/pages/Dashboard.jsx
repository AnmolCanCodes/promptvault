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

const ArrowIcon = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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
      total + (collection.prompt_count ?? collection.prompts?.length ?? 0),
    0
  );

  const openCollection = (id) => {
    navigate(`/collections/${id}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 py-10">
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================
            PAGE INTRODUCTION
        ===================================== */}
        <section className="mb-8 flex flex-col justify-between gap-6 border-b border-gray-200 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Your Workspace
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your ideas, <span className="font-serif italic font-normal text-indigo-600">organized.</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm text-gray-600 leading-relaxed">
              A home for the prompts worth keeping. Organize your thinking, build your library, and reuse your best work.
            </p>
          </div>

          <Button
            onClick={() => navigate('/collections')}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 shrink-0 self-start sm:self-auto"
          >
            <span>Explore Collections</span>
            <ArrowIcon />
          </Button>
        </section>

        {/* =====================================
            LIBRARY OVERVIEW STATS
        ===================================== */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Collections
              </p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 tabular-nums">
                {loading ? '—' : collections.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <FolderIcon className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Prompts Saved
              </p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 tabular-nums">
                {loading ? '—' : totalPrompts}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                The Library
              </span>
              <h2 className="mt-0.5 text-2xl font-bold tracking-tight text-gray-900">
                Your Collections
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Everything you've organized, in one place.
              </p>
            </div>

            {!loading && collections.length > 0 && (
              <button
                type="button"
                onClick={() => navigate('/collections')}
                className="hidden items-center gap-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-500 sm:flex"
              >
                <span>View all</span>
                <ArrowIcon />
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white p-8">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                Organizing your library...
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm font-semibold text-red-700">
                Unable to load your library
              </p>
              <p className="mt-1 text-xs text-red-600">
                {error}
              </p>
              <button
                type="button"
                onClick={fetchCollections}
                className="mt-4 text-xs font-semibold text-red-700 underline underline-offset-4 hover:text-red-800"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && collections.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center sm:py-20">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FolderIcon className="h-7 w-7" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                A Blank Canvas
              </p>

              <h3 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
                Your library starts here.
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 leading-relaxed">
                Create your first collection. Group prompts by project, workflow, client, or whatever makes sense to you.
              </p>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => navigate('/collections')}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-indigo-500"
                >
                  <span>Create your first collection</span>
                  <ArrowIcon />
                </Button>
              </div>
            </div>
          )}

          {/* Collection Cards Grid */}
          {!loading && !error && collections.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                    className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                          <FolderIcon />
                        </div>

                        <span className="font-mono text-xs font-medium text-gray-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="line-clamp-1 text-base font-bold tracking-tight text-gray-900 transition-colors group-hover:text-indigo-600">
                        {collection.name}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {collection.description || 'A space for your saved prompts.'}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        {promptCount} {promptCount === 1 ? 'Prompt' : 'Prompts'}
                      </span>

                      <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 transition-all group-hover:gap-2 group-hover:text-indigo-600">
                        <span>Open</span>
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
        <footer className="mt-16 border-t border-gray-200 pt-6">
          <div className="flex flex-col justify-between gap-2 text-xs font-medium text-gray-400 sm:flex-row">
            <span>PromptVault / Your personal prompt library</span>
            <span>Keep your best prompts close.</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;