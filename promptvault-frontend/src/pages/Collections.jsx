import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collectionService } from '../services/collectionService';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

const Collections = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Collection name is required');
      return;
    }

    setSubmitting(true);

    try {
      await collectionService.createCollection(formData.name, formData.description);
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      fetchCollections();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to create collection');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) {
      return;
    }

    try {
      await collectionService.deleteCollection(id);
      fetchCollections();
    } catch {
      setError('Failed to delete collection');
    }
  };

  const handleCollectionClick = (id) => {
    navigate(`/collections/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Library</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Collections</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage reusable prompt groups, review ownership, and open shared libraries.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Collection
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-80 items-center justify-center rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
            <span className="spinner" />
            Loading collections...
          </div>
        </div>
      ) : collections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-md bg-teal-50 text-teal-700">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H10l2 2h5.5A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">No collections yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Create a collection to keep related prompts organized and easy to reuse.</p>
          <div className="mt-6">
            <Button onClick={() => setIsModalOpen(true)}>
              Create Collection
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <button
                  type="button"
                  className="group flex min-w-0 flex-1 items-start gap-4 text-left"
                  onClick={() => handleCollectionClick(collection.id)}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-700">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H10l2 2h5.5A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                  <h3
                    className="line-clamp-2 text-lg font-bold text-slate-950 group-hover:text-teal-800"
                  >
                    {collection.name}
                  </h3>
                  <span className="mt-1 block text-sm text-slate-500">
                    {collection.user_id === user?.id ? (
                      <span className="font-semibold text-teal-700">Owned by you</span>
                    ) : (
                      <span>Read-only collection</span>
                    )}
                  </span>
                  </span>
                </button>
                {collection.user_id === user?.id && (
                  <button
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="rounded-md px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mb-5 line-clamp-3 min-h-[3.75rem] text-sm text-slate-500">
                {collection.description || 'No description added yet.'}
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {collection.prompt_count ?? 0} prompts
                </span>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handleCollectionClick(collection.id)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({ name: '', description: '' });
          setFormError('');
        }}
        title="Create New Collection"
      >
        <form onSubmit={handleCreateCollection} className="space-y-4">
          {formError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
              {formError}
            </div>
          )}
          <Input
            label="Collection Name"
            placeholder="My Collection"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-semibold text-slate-700">
              Description (optional)
            </label>
            <textarea
              placeholder="A brief description of your collection"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full resize-none rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              rows="3"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setFormData({ name: '', description: '' });
                setFormError('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Collections;
