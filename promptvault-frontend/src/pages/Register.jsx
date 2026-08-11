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
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const getErrorMessage = (err) => {
    const detail = err.response?.data?.detail;

    if (typeof detail === 'string') {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg).filter(Boolean).join(', ');
    }

    return 'Registration failed. Please try again.';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email.trim(), formData.password, formData.username.trim());
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-200 bg-slate-50 px-8 py-7 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">PromptVault</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Create Account</h1>
        <p className="mt-2 text-sm text-slate-500">Start building a reliable prompt workspace.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <Input
          label="Username"
          type="text"
          name="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          required
        />

        <Input
          label="Email"
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
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      
        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
