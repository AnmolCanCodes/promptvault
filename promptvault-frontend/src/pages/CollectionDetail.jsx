import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collectionService } from '../services/collectionService';
import { promptService } from '../services/promptService';
import Button from '../components/Button';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCollectionData();
  }, [id]);

  const fetchCollectionData = async () => {
    try {
      setLoading(true);
      const [collectionData, promptsData] = await Promise.all([
        collectionService.getCollection(id),
        promptService.getPrompts(id)
      ]);
      setCollection(collectionData);
      setPrompts(promptsData);
    } catch (err) {
      setError('Failed to load collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = async (promptId) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      await promptService.deletePrompt(promptId);
      fetchCollectionData();
    } catch (err) {
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
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || 'Collection not found'}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/collections')}
            className="mb-4"
          >
            ← Back to Collections
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{collection.name}</h1>
          <p className="text-gray-600 mt-2">{collection.description || 'No description'}</p>
        </div>
        <Button onClick={handleCreatePrompt}>
          + New Prompt
        </Button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No prompts yet</h2>
          <p className="text-gray-500 mb-6">Create your first prompt in this collection</p>
          <Button onClick={handleCreatePrompt}>
            Create Prompt
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {prompt.title || 'Untitled Prompt'}
                </h3>
                <div className="flex space-x-2">
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
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {prompt.content}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-500">
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
