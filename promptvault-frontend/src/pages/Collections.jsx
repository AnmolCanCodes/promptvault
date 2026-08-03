import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collectionService } from '../services/collectionService';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const data = await collectionService.getCollections();
      setCollections(data);
    } catch (err) {
      setError('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

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
    } catch (err) {
      setError('Failed to delete collection');
    }
  };

  const handleCollectionClick = (id) => {
    navigate(`/collections/${id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          + New Collection
        </Button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading collections...</div>
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No collections yet</h2>
          <p className="text-gray-500 mb-6">Create your first collection to get started</p>
          <Button onClick={() => setIsModalOpen(true)}>
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3
                  className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-indigo-600"
                  onClick={() => handleCollectionClick(collection.id)}
                >
                  {collection.name}
                </h3>
                <button
                  onClick={() => handleDeleteCollection(collection.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {collection.description || 'No description'}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">📝</span>
                  <span>{collection.prompts?.length || 0} prompts</span>
                </div>
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
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
            <label className="mb-1 text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea
              placeholder="A brief description of your collection"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
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
