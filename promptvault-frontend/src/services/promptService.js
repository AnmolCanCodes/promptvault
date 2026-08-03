import api from './api';

export const promptService = {
  getPrompts: async (collectionId) => {
    const response = await api.get(`/collections/${collectionId}/prompts`);
    return response.data;
  },

  getPrompt: async (id) => {
    const response = await api.get(`/prompts/${id}`);
    return response.data;
  },

  createPrompt: async (collectionId, title, content) => {
    const response = await api.post(`/collections/${collectionId}/prompts`, { title, content });
    return response.data;
  },

  updatePrompt: async (id, title, content) => {
    const response = await api.put(`/prompts/${id}`, { title, content });
    return response.data;
  },

  deletePrompt: async (id) => {
    const response = await api.delete(`/prompts/${id}`);
    return response.data;
  }
};

export default promptService;
