import axios from 'axios';

// In dev, always use local backend so login/me hit your local server (fix: requests were going elsewhere)
const baseURL =
  import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : import.meta.env.VITE_API_URL;

// #region agent log
console.log('[DEBUG] api baseURL=', baseURL, 'DEV=', import.meta.env.DEV);
fetch('http://127.0.0.1:7244/ingest/3f836a50-eef8-48c0-88b9-ffb3ad0219f3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts',message:'api baseURL',data:{baseURL,DEV:!!import.meta.env.DEV},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H6'})}).catch(()=>{});
// #endregion

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;