import api from './api';

export const collectionService = {
  getCollections: async () => {
    const response = await api.get('/collections');
    return response.data;
  },

  getCollection: async (id) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
  },

  createCollection: async (name, description) => {
    const response = await api.post('/collections', { name, description });
    return response.data;
  },

  updateCollection: async (id, name, description) => {
    const response = await api.put(`/collections/${id}`, { name, description });
    return response.data;
  },

  deleteCollection: async (id) => {
    const response = await api.delete(`/collections/${id}`);
    return response.data;
  }
};

export default collectionService;
