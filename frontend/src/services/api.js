import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: async (messages, context = null) => {
    const response = await apiClient.post('/chat/', {
      messages,
      context,
    });
    return response.data;
  },

  analyzeSituation: async (situation) => {
    const response = await apiClient.post('/chat/analyze', situation);
    return response.data;
  },
};

export const templateService = {
  listTemplates: async (category = null) => {
    const params = category ? { category } : {};
    const response = await apiClient.get('/legal-templates/', { params });
    return response.data;
  },

  getTemplate: async (templateId) => {
    const response = await apiClient.get(`/legal-templates/${templateId}`);
    return response.data;
  },

  getTemplateVersions: async (templateId) => {
    const response = await apiClient.get(`/legal-templates/${templateId}/versions`);
    return response.data;
  },
};

export const decisionService = {
  listPathways: async () => {
    const response = await apiClient.get('/decisions/pathways');
    return response.data;
  },

  getPathway: async (pathwayId) => {
    const response = await apiClient.get(`/decisions/pathways/${pathwayId}`);
    return response.data;
  },

  evaluate: async (decisionInput) => {
    const response = await apiClient.post('/decisions/evaluate', decisionInput);
    return response.data;
  },
};

export const legislativeService = {
  listUpdates: async (jurisdiction = null) => {
    const params = jurisdiction ? { jurisdiction } : {};
    const response = await apiClient.get('/legislative-updates/', { params });
    return response.data;
  },

  getUpdate: async (updateId) => {
    const response = await apiClient.get(`/legislative-updates/${updateId}`);
    return response.data;
  },

  syncUpdates: async () => {
    const response = await apiClient.post('/legislative-updates/sync');
    return response.data;
  },
};
