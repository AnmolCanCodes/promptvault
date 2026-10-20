import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register(formData.username.trim(), formData.email.trim(), formData.password);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : 'Registration failed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <main className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xs ring-1 ring-gray-900/5 sm:p-12">
        
        {/* Header & Logo Badge */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white shadow-xs">
            PV
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Get started
          </p>

          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Create your account.
          </h1>

          <p className="mt-2 text-base text-gray-500">
            A few details and your prompt library is ready.
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

          <div className="space-y-4">
            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />

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
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              placeholder="Enter your password again"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="large"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-xs transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating account...' : 'Create account'}</span>

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
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Sign in
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

export default Register;