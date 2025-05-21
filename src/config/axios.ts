import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // This will send cookies with requests
});

export default axiosInstance;
