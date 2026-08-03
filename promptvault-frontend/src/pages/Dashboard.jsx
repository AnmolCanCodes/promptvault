import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collectionService } from '../services/collectionService';
import Button from '../components/Button';

const Dashboard = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleCollectionClick = (id) => {
    navigate(`/collections/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading collections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={() => navigate('/collections')}>
          Manage Collections
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No collections yet</h2>
          <p className="text-gray-500 mb-6">Create your first collection to get started</p>
          <Button onClick={() => navigate('/collections')}>
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              onClick={() => handleCollectionClick(collection.id)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {collection.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {collection.description || 'No description'}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">📝</span>
                <span>{collection.prompts?.length || 0} prompts</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
