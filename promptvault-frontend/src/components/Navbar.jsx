
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const displayName = user?.username || user?.email || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-(--color-border) bg-(--color-bg)/95 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full items-center justify-between px-5 sm:px-7">

        {/* Brand */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="group flex items-center gap-3"
        >
          <span className="grid h-9 w-9 place-items-center rounded-md bg-(--color-bg-inverse) transition-transform duration-200 group-hover:scale-[1.04]">
            <img
              src="/promptvault.png"
              alt=""
              className="h-6 w-6 object-contain"
            />
          </span>

          <span className="text-[19px] font-bold tracking-[-0.055em] text-(--color-text)">
            PromptVault
          </span>

          <span className="ml-1 hidden border-l border-(--color-border-strong) pl-3 text-[11px] font-medium tracking-wide text-(--color-text-muted) sm:block">
            PROMPT LIBRARY
          </span>
        </Link>

        {/* Account actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2.5 sm:flex">
                <div className="grid h-8 w-8 place-items-center rounded-full border border-(--color-border-strong) bg-(--color-bg-subtle) text-xs font-bold text-(--color-text)">
                  {initial}
                </div>

                <div className="max-w-37.5">
                  <p className="truncate text-xs font-semibold text-(--color-text)">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-(--color-text-muted)">
                    Personal workspace
                  </p>
                </div>
              </div>

              <span className="hidden h-7 w-px bg-(--color-border) sm:block" />

              <button
                onClick={logout}
                className="rounded-md border border-(--color-border) bg-(--color-bg-elevated) px-3.5 py-2 text-xs font-semibold text-(--color-text-secondary) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-bg-hover) hover:text-(--color-text)"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text)"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-(--color-bg-inverse) px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-(--color-primary)"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
