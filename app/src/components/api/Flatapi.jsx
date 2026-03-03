import config from '../../config.jsx';
import axios from 'axios';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails.jsx';

const api = axios.create({
  baseURL: `${config.api_url}/flat/`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token before each request
api.interceptors.request.use((config) => {
  const access_token = useEmployeeDetails.getState().access_token; // ✅ direct store access
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

export default api;

