import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecom-server-4war.onrender.com/api'
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('https://ecom-server-4war.onrender.com/api/token', {
          refreshToken: localStorage.getItem('refreshToken')
        });
        localStorage.setItem('accessToken', res.data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;