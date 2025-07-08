import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // GET request
  get: async (url: string, params?: any) => {
    const response = await api.get(url, { params });
    return response.data;
  },

  // POST request
  post: async (url: string, data?: any) => {
    const response = await api.post(url, data);
    return response.data;
  }
};

export default api;