import axios from 'axios';

// Make sure this URL matches your backend
const API_BASE_URL = 'http://localhost:5000/api/attendance';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

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