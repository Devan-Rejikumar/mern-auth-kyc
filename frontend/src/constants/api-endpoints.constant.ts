export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  ADMIN: {
    LOGIN: '/admin/login',
  },
  KYC: {
    UPLOAD: '/kyc/upload',
  },
} as const;
