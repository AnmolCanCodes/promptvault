import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-10 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">PromptVault</p>
        <h1 className="mt-3 text-7xl font-bold tracking-tight text-slate-950">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-slate-800">Page Not Found</h2>
        <p className="mx-auto mt-3 mb-8 max-w-sm text-sm text-slate-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
