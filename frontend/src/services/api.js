import axios from 'axios';

// Use your Railway backend URL - it's running on port 8080
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://employee-attendance-tracker-production.up.railway.app';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/attendance`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const attendanceAPI = {
  // Get all attendance records
  getAll: () => api.get('/'),
  
  // Add new attendance record
  create: (attendanceData) => api.post('/', attendanceData),
  
  // Delete attendance record
  delete: (id) => api.delete(`/${id}`),
  
  // Search records
  search: (query) => api.get(`/search?q=${encodeURIComponent(query)}`),
  
  // Filter by date
  filterByDate: (date) => api.get(`/filter?date=${date}`),
};

export default api;