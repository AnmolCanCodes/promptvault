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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 py-10">
      <main className="mx-auto w-full max-w-7xl px-4 space-y-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Library
            </span>
            <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Collections
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Manage reusable prompt groups, review ownership, and open shared libraries.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-indigo-500 shrink-0"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Collection
          </Button>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-xs">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex h-80 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-xs">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              Loading collections...
            </div>
          </div>
        ) : collections.length === 0 ? (
          
          /* Empty State */
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-xs sm:py-20">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.5 7.5a2 2 0 0 1 2-2H10l2 2h6.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
                <path d="M3.5 10h17" />
              </svg>
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              A Blank Canvas
            </span>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
              No collections yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 leading-relaxed">
              Create a collection to keep related prompts organized and easy to reuse.
            </p>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-indigo-500"
              >
                Create Collection
              </Button>
            </div>
          </div>
        ) : (
          
          /* Collections Grid */
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-start gap-3.5 text-left"
                      onClick={() => handleCollectionClick(collection.id)}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3.5 7.5a2 2 0 0 1 2-2H10l2 2h6.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
                          <path d="M3.5 10h17" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <h3 className="line-clamp-1 text-base font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {collection.name}
                        </h3>
                        <span className="mt-1 block text-xs font-medium">
                          {collection.user_id === user?.id ? (
                            <span className="text-indigo-600">Owned by you</span>
                          ) : (
                            <span className="text-gray-400">Read-only collection</span>
                          )}
                        </span>
                      </div>
                    </button>

                    {collection.user_id === user?.id && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCollection(collection.id)}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="mb-6 line-clamp-2 min-h-10 text-xs leading-relaxed text-gray-500">
                    {collection.description || 'No description added yet.'}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                    {collection.prompt_count ?? 0} {collection.prompt_count === 1 ? 'prompt' : 'prompts'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCollectionClick(collection.id)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
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
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
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
              <label className="mb-1.5 text-xs font-semibold text-gray-700">
                Description (optional)
              </label>
              <textarea
                placeholder="A brief description of your collection"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 shadow-xs transition-colors placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-500 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Collection'}
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default Collections;