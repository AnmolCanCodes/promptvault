
import { useId } from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  error = '',
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  const inputStyles = `
    w-full min-h-11 rounded-md border
    bg-[var(--color-bg-elevated)]
    px-3.5 py-2.5
    text-sm text-[var(--color-text)]
    placeholder:text-[var(--color-text-subtle)]
    outline-none
    transition-all duration-150
    focus:border-[var(--color-primary)]
    focus:ring-2 focus:ring-[var(--color-primary)]/10
    disabled:cursor-not-allowed disabled:bg-[var(--color-bg-subtle)] disabled:opacity-70
    ${error
      ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/10'
      : 'border-[var(--color-border-strong)]'
    }
  `;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-(--color-text)"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${inputStyles} ${className}`}
        {...props}
      />

      {error && (
        <span
          id={errorId}
          role="alert"
          className="text-xs font-medium text-(--color-error)"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
