import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email.trim(), formData.password);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : 'Login failed. Check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <main className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5 sm:p-12">
        
        {/* Header & Logo Badge */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white shadow-sm">
            PV
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Welcome back
          </p>

          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Good to see you.
          </h1>

          <p className="mt-2 text-base text-gray-500">
            Sign in to get back to your prompt library.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          <div className="space-y-5">
            <Input
              label="Email address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="large"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50"
            >
              <span>{loading ? 'Signing you in...' : 'Sign in'}</span>

              {!loading && (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              )}
            </Button>
          </div>

          <p className="pt-2 text-center text-sm text-gray-500">
            New to PromptVault?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>

        <p className="mt-10 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          PROMPTVAULT · YOUR IDEAS, ORGANIZED
        </p>
      </main>
    </div>
  );
};

export default Login;