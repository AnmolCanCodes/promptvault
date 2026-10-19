
import { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-400
        flex items-center justify-center
        overflow-y-auto
        bg-[rgba(25,34,29,0.48)]
        p-4 backdrop-blur-[3px]
        animate-[modal-fade_180ms_ease-out]
      "
      onMouseDown={handleBackdropClick}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="promptvault-modal-title"
        className={`
          relative w-full ${sizes[size] || sizes.medium}
          max-h-[90vh] overflow-y-auto
          rounded-xl border border-(--color-border)
          bg-(--color-bg-elevated)
          shadow-(--shadow-lg)
          animate-[modal-enter_200ms_ease-out]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-(--color-border) px-6 py-5">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-(--color-primary)">
              PROMPTVAULT
            </p>

            <h2
              id="promptvault-modal-title"
              className="text-lg font-semibold tracking-tight text-(--color-text)"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              grid h-9 w-9 shrink-0 place-items-center
              rounded-md border border-transparent
              text-(--color-text-muted)
              transition-colors
              hover:border-(--color-border)
              hover:bg-(--color-bg-subtle)
              hover:text-(--color-text)
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4.25 w-4.25"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </section>
    </div>
  );
};

export default Modal;
