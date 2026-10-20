import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  {
    path: '/dashboard',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <path d="M3.5 7.5a2 2 0 0 1 2-2H10l2 2h6.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
        <path d="M3.5 10h17" />
      </svg>
    ),
  },
];

const DEFAULT_WIDTH = 256;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;
const COLLAPSED_WIDTH = 68;

const Sidebar = () => {
  const location = useLocation();
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Mouse Drag Logic for Resizing
  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e) => {
      if (!isResizing || isCollapsed) return;
      const newWidth = e.clientX;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
      }
    },
    [isResizing, isCollapsed]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : width;

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${currentWidth}px` }}
      className={`group/sidebar relative hidden shrink-0 min-h-[calc(100vh-64px)] select-none border-r border-gray-200 bg-white transition-[width] lg:flex ${
        isResizing ? 'duration-0 cursor-col-resize' : 'duration-200 ease-in-out'
      }`}
    >
      <div className="sticky top-16 flex h-[calc(100vh-64px)] w-full flex-col px-3 py-6">
        
        {/* Workspace Label & Collapse Toggle */}
        <div className="mb-6 flex items-center justify-between px-2">
          {!isCollapsed && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Workspace
            </span>
          )}

          <button
            type="button"
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
              isCollapsed ? 'mx-auto' : 'ml-auto'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d={
                  isCollapsed
                    ? 'M13 5l7 7-7 7M5 5l7 7-7 7'
                    : 'M11 19l-7-7 7-7M19 19l-7-7 7-7'
                }
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                className={`
                  group relative flex items-center gap-3 rounded-xl px-3 py-2.5
                  text-sm font-semibold transition-all duration-150
                  ${
                    active
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                {active && !isCollapsed && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-600" />
                )}

                <span
                  className={`shrink-0 transition-colors ${
                    active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-700'
                  }`}
                >
                  {item.icon}
                </span>

                {!isCollapsed && <span>{item.label}</span>}

                {active && !isCollapsed && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Identity Block */}
        {!isCollapsed && (
          <div className="mt-auto pt-6">
            <div className="border-t border-gray-100 pt-5 px-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Your prompt workspace
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Keep your best ideas organized. Find them when you need them.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Adjustable Resize Handle (Right Border) */}
      {!isCollapsed && (
        <div
          onMouseDown={startResizing}
          onDoubleClick={() => setWidth(DEFAULT_WIDTH)}
          title="Drag to resize / Double-click to reset"
          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize bg-transparent hover:bg-indigo-500/30 active:bg-indigo-600 transition-colors"
        />
      )}
    </aside>
  );
};

export default Sidebar;