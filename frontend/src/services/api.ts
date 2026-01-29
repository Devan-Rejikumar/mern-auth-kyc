import axios from 'axios';


// In production, use same-origin /api so Vercel proxies to Render (HttpOnly cookie works as first-party).
const baseURL =
  import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : (import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;