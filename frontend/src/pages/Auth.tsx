import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { loginSchema, registerSchema, validateAuthField } from '../validator/auth.validator';

type FieldErrors = Record<string, string>;

const Auth = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { loading: authLoading } = useAuthRedirect(); // Redirect if already authenticated

  useEffect(() => {
    setEmail('');
    setUsername('');
    setPhone('');
    setPassword('');
    setError('');
    setFieldErrors({});
  }, [location.pathname]);

  const validateAndSetField = (field: 'email' | 'username' | 'phone' | 'password', value: string) => {
    setError(''); // Clear form-level error when user edits any field
    const isEmpty = field === 'phone' || field === 'password' ? value === '' : value.trim() === '';
    if (isEmpty) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      return;
    }
    const msg = validateAuthField(field, value, isLogin);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (msg) next[field] = msg;
      else delete next[field];
      return next;
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhone(value);
      validateAndSetField('phone', value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = loginSchema.safeParse({ email: email.trim(), password });
      if (!result.success) {
        const firstError = result.error.issues[0]?.message ?? 'Validation failed';
        const errorMessages = result.error.issues.map((issue: { message: string }) => issue.message).join('\n');
        setError(errorMessages);
        toast.error(firstError);
        return;
      }
      setLoading(true);
      try {
        await login(result.data.email, result.data.password);
        toast.success('Signed in successfully!');
        navigate('/dashboard');
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
          const errorMessage = axiosError.response?.data?.message;
          const validationErrors = axiosError.response?.data?.errors;
          if (validationErrors) {
            const errorMessages = Object.entries(validationErrors)
              .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
              .join('\n');
            setError(errorMessages);
            toast.error(errorMessages.split('\n')[0] || 'Validation failed');
          } else {
            const msg = errorMessage ?? 'Login failed';
            setError(msg);
            toast.error(msg);
          }
        } else {
          setError('Login failed');
          toast.error('Login failed');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    const result = registerSchema.safeParse({
      email: email.trim(),
      username: username.trim(),
      phone,
      password,
    });
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? 'Validation failed';
      const errorMessages = result.error.issues.map((issue: { message: string }) => issue.message).join('\n');
      setError(errorMessages);
      toast.error(firstError);
      return;
    }

    setLoading(true);
    try {
      await register(result.data.email, result.data.username, result.data.phone, result.data.password);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
        const errorMessage = axiosError.response?.data?.message;
        const validationErrors = axiosError.response?.data?.errors;
        if (validationErrors) {
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          setError(errorMessages);
          toast.error(errorMessages.split('\n')[0] || 'Validation failed');
        } else {
          const msg = errorMessage ?? 'Registration failed';
          setError(msg);
          toast.error(msg);
        }
      } else {
        setError('Registration failed');
        toast.error('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="animate-spin h-6 w-6 text-indigo-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 px-4 py-8 sm:px-6 lg:px-8">
      {/* Card Container */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 sm:p-8">
          {/* Logo / Brand */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isLogin 
                ? 'Sign in to continue to your dashboard' 
                : 'Get started with your free account'}
            </p>
          </div>

          {/* Form - noValidate to use custom validation only */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateAndSetField('email', e.target.value);
                  }}
                  autoComplete="email"
                  className={`w-full pl-11 pr-4 py-3 text-base sm:text-sm text-slate-900 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-slate-400 ${fieldErrors.email ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="you@example.com"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span aria-hidden className="shrink-0">!</span>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Username Field - Only for Registration */}
            {!isLogin && (
              <div>
                <label 
                  htmlFor="username" 
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
                        setUsername(value);
                        validateAndSetField('username', value);
                      }
                    }}
                    autoComplete="username"
                    maxLength={30}
                    className={`w-full pl-11 pr-4 py-3 text-base sm:text-sm text-slate-900 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-slate-400 ${fieldErrors.username ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="Devan123"
                  />
                </div>
                {fieldErrors.username ? (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span aria-hidden className="shrink-0">!</span>
                    {fieldErrors.username}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-500">
                    Must start with a letter, then letters and numbers only
                  </p>
                )}
              </div>
            )}

            {/* Phone Field - Only for Registration */}
            {!isLogin && (
              <div>
                <label 
                  htmlFor="phone" 
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    autoComplete="tel"
                    maxLength={10}
                    className={`w-full pl-11 pr-4 py-3 text-base sm:text-sm text-slate-900 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-slate-400 ${fieldErrors.phone ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="9876543210"
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span aria-hidden className="shrink-0">!</span>
                    {fieldErrors.phone}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-500">
                    10-digit Indian mobile number starting with 6-9
                  </p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateAndSetField('password', e.target.value);
                  }}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className={`w-full pl-11 pr-4 py-3 text-base sm:text-sm text-slate-900 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-slate-400 ${fieldErrors.password ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="••••••••"
                />
              </div>
              {fieldErrors.password ? (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span aria-hidden className="shrink-0">!</span>
                  {fieldErrors.password}
                </p>
              ) : !isLogin ? (
                <p className="mt-1.5 text-xs text-slate-500">
                  Minimum 8 characters, no spaces
                </p>
              ) : null}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="whitespace-pre-line">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-base sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Sign in' : 'Create account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">or</span>
            </div>
          </div>

          {/* Toggle Link */}
          <p className="text-center text-sm text-slate-500">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Sign up for free
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;