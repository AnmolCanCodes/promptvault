import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collectionService } from '../services/collectionService';
import Button from '../components/Button';

const Dashboard = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      const data = await collectionService.getCollections();
      setCollections(data);
    } catch {
      setError('Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchCollections);
  }, [fetchCollections]);

  const handleCollectionClick = (id) => {
    navigate(`/collections/${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <span className="spinner" />
          Loading collections...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-200 bg-slate-50 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Organize reusable prompts into focused collections and open the one you need quickly.
            </p>
          </div>
          <Button onClick={() => navigate('/collections')}>
            Manage Collections
          </Button>
        </div>
        <div className="grid gap-px bg-slate-200 sm:grid-cols-3">
          <div className="bg-white px-6 py-5">
            <p className="text-sm font-medium text-slate-500">Collections</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{collections.length}</p>
          </div>
          <div className="bg-white px-6 py-5">
            <p className="text-sm font-medium text-slate-500">Prompts</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {collections.reduce((total, collection) => total + (collection.prompt_count ?? collection.prompts?.length ?? 0), 0)}
            </p>
          </div>
          <div className="bg-white px-6 py-5">
            <p className="text-sm font-medium text-slate-500">Status</p>
            <p className="mt-2 text-lg font-bold text-teal-700">Ready</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Recent collections</h2>
          <p className="text-sm text-slate-500">Jump back into your prompt library.</p>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-md bg-teal-50 text-teal-700">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H10l2 2h5.5A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">No collections yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Create your first collection to group prompts by client, project, workflow, or model.</p>
          <div className="mt-6">
            <Button onClick={() => navigate('/collections')}>
              Create Collection
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <button
              type="button"
              key={collection.id}
              onClick={() => handleCollectionClick(collection.id)}
              className="group rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-md bg-slate-100 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H10l2 2h5.5A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
                  </svg>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {collection.prompt_count ?? collection.prompts?.length ?? 0} prompts
                </span>
              </div>
              <h3 className="line-clamp-2 text-lg font-bold text-slate-950 group-hover:text-teal-800">
                {collection.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                {collection.description || 'No description added yet.'}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
