import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collectionService } from '../services/collectionService';
import { promptService } from '../services/promptService';
import Button from '../components/Button';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collection, setCollection] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCollectionData = useCallback(async () => {
    try {
      setLoading(true);
      const [collectionData, promptsData] = await Promise.all([
        collectionService.getCollection(id),
        promptService.getPrompts(id)
      ]);
      setCollection(collectionData);
      setPrompts(promptsData);
    } catch {
      setError('Failed to load collection');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    queueMicrotask(fetchCollectionData);
  }, [fetchCollectionData]);

  const handleDeletePrompt = async (promptId) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      await promptService.deletePrompt(promptId);
      fetchCollectionData();
    } catch {
      setError('Failed to delete prompt');
    }
  };

  const handleEditPrompt = (promptId) => {
    navigate(`/prompts/${promptId}/edit`, { state: { collectionId: id } });
  };

  const handleCreatePrompt = () => {
    navigate(`/prompts/new/${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <span className="spinner" />
          Loading collection...
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
        {error || 'Collection not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/collections')}
            className="mb-5"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Collections
          </Button>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Collection</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{collection.name}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">{collection.description || 'No description added yet.'}</p>
          <p className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {collection.user_id === user?.id ? 'You own this collection.' : 'This collection belongs to another user.'}
          </p>
        </div>
        {collection.user_id === user?.id ? (
          <Button onClick={handleCreatePrompt}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Prompt
          </Button>
        ) : null}
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {prompts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-md bg-teal-50 text-teal-700">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 4h8l4 4v12H8V4Z" />
              <path d="M14 4v5h5" />
              <path d="M4 8v12h12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">No prompts yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {collection.user_id === user?.id
              ? 'Create your first prompt in this collection.'
              : 'This collection has no prompts yet.'}
          </p>
          {collection.user_id === user?.id ? (
            <div className="mt-6">
              <Button onClick={handleCreatePrompt}>
                Create Prompt
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-teal-200 hover:shadow-md"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-xl font-bold text-slate-950">
                  {prompt.title || 'Untitled Prompt'}
                </h3>
                <div className="flex items-center gap-2">
                  {collection.user_id === user?.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleEditPrompt(prompt.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeletePrompt(prompt.id)}
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Read-only prompt</div>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-slate-700">
                  {prompt.content}
                </pre>
              </div>
              <div className="mt-4 text-sm font-medium text-slate-500">
                Created: {new Date(prompt.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionDetail;
