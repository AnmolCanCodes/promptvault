
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  {
    path: '/dashboard',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    path: '/collections',
    label: 'Collections',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M3.5 7.5a2 2 0 0 1 2-2H10l2 2h6.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
        <path d="M3.5 10h17" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(`${path}/`);

  return (
    <aside className="hidden lg:flex w-62 shrink-0 min-h-[calc(100vh-64px)] flex-col border-r border-(--color-border) bg-(--color-bg)">
      <div className="sticky top-16 flex min-h-[calc(100vh-64px)] flex-col px-4 py-7">

        {/* Workspace label */}
        <div className="mb-5 px-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-(--color-text-subtle)">
            Workspace
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`
                  group relative flex items-center gap-3
                  rounded-md px-3 py-2.5
                  text-[13px] font-medium
                  transition-all duration-150
                  ${
                    active
                      ? 'bg-(--color-primary-light) text-(--color-primary)'
                      : 'text-(--color-text-secondary) hover:bg-(--color-bg-hover) hover:text-(--color-text)'
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.75 rounded-r-full bg-(--color-primary)" />
                )}

                <span className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-(--color-primary)' : 'text-(--color-text-muted) group-hover:text-(--color-text)'}`}>
                  {item.icon}
                </span>

                <span>{item.label}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-(--color-primary)" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom identity */}
        <div className="mt-auto pt-8">
          <div className="border-t border-(--color-border) pt-5 px-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-success)" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-(--color-text-muted)">
                Your prompt workspace
              </span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-(--color-text-subtle)">
              Keep your best ideas organized. Find them when you need them.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
