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
    content: ''
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
        content: prompt.content || ''
      });
    } catch {
      setError('Failed to load prompt');
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);

    try {
      if (isEditing && id) {
        await promptService.updatePrompt(id, formData.title, formData.content);
      } else if (collectionId) {
        await promptService.createPrompt(collectionId, formData.title, formData.content);
      } else {
        setError('Collection ID is required to create a prompt');
        setLoading(false);
        return;
      }
      
      navigate(`/collections/${collectionId}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save prompt');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <span className="spinner" />
          Loading prompt...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Button
          variant="ghost"
          onClick={() => navigate(`/collections/${collectionId}`)}
          className="mb-5"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Collection
        </Button>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Prompt</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          {isEditing ? 'Edit Prompt' : 'Create New Prompt'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Write a clean, reusable prompt with a title your future self can find quickly.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Input
          label="Prompt Title"
          placeholder="My Awesome Prompt"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-semibold text-slate-700">
            Prompt Content
          </label>
          <textarea
            name="content"
            placeholder="Enter your prompt content here..."
            value={formData.content}
            onChange={handleChange}
            className="min-h-80 w-full resize-y rounded-md border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
            rows="12"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/collections/${collectionId}`)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Prompt' : 'Create Prompt'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PromptEditor;
