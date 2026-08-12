import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const displayName = user?.username || user?.email || 'User';

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-teal-33300 text-white">
                <img
                  src="/promptvault.png"
                  alt="PromptVault"
                  className="h-7 w-7 object-contain"
                />
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-950">PromptVault</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden max-w truncate rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 sm:block">
                  {displayName}
                </span>
                <button
                  onClick={logout}
                  className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
