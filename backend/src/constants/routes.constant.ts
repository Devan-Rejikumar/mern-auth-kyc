export const API_ROUTES = {
  AUTH: {
    BASE: '/api/auth',
    REGISTER: '/register',
    LOGIN: '/login',
    LOGOUT: '/logout',
    ME: '/me',
  },
  ADMIN: {
    BASE: '/api/admin',
    LOGIN: '/login',
    USERS: '/users',
    USER_BY_ID: '/users/:userId',
  },
  KYC: {
    BASE: '/api/kyc',
    UPLOAD: '/upload',
  },
  HEALTH: '/health',
  API_HEALTH: '/api/health',
} as const;
