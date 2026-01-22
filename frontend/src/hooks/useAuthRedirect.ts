import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useAuthRedirect = (redirectPath?: string) => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        // Default redirect based on role
        if (user?.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [isAuthenticated, loading, user, navigate, redirectPath]);

  return { isAuthenticated, loading, user };
};

