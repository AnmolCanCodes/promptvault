import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { promptService } from '../services/promptService';
import Button from '../components/Button';
import Input from '../components/Input';

const PromptEditor = () => {
  const { id, collectionId: urlCollectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const collectionId = urlCollectionId || location.state?.collectionId;
  
  const [isEditing, setIsEditing] = useState(!!id);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      fetchPrompt();
    }
  }, [id, isEditing]);

  const fetchPrompt = async () => {
    try {
      setFetchLoading(true);
      const prompt = await promptService.getPrompt(id);
      setFormData({
        title: prompt.title || '',
        content: prompt.content || ''
      });
    } catch (err) {
      setError('Failed to load prompt');
    } finally {
      setFetchLoading(false);
    }
  };

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
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading prompt...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/collections/${collectionId}`)}
          className="mb-4"
        >
          ← Back to Collection
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Prompt' : 'Create New Prompt'}
        </h1>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Prompt Title"
          placeholder="My Awesome Prompt"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Prompt Content
          </label>
          <textarea
            name="content"
            placeholder="Enter your prompt content here..."
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none font-mono text-sm"
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
