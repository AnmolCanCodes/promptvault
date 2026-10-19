
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    whitespace-nowrap rounded-md
    font-semibold
    transition-all duration-150
    focus-visible:outline-2 focus-visible:outline-offset-2
    disabled:pointer-events-none disabled:opacity-50
    active:translate-y-px
  `;

  const variants = {
    primary: `
      bg-[var(--color-primary)]
      text-white
      hover:bg-[var(--color-primary-hover)]
      focus-visible:outline-[var(--color-primary)]
    `,
    secondary: `
      border border-[var(--color-border-strong)]
      bg-[var(--color-bg-elevated)]
      text-[var(--color-text)]
      hover:bg-[var(--color-bg-hover)]
      hover:border-[var(--color-text-subtle)]
      focus-visible:outline-[var(--color-primary)]
    `,
    danger: `
      bg-[var(--color-error)]
      text-white
      hover:brightness-95
      focus-visible:outline-[var(--color-error)]
    `,
    ghost: `
      bg-transparent
      text-[var(--color-text-secondary)]
      hover:bg-[var(--color-bg-hover)]
      hover:text-[var(--color-text)]
      focus-visible:outline-[var(--color-primary)]
    `,
  };

  const sizes = {
    small: 'min-h-8 px-3 text-xs',
    medium: 'min-h-10 px-4 text-[13px]',
    large: 'min-h-12 px-5 text-sm',
  };

  const classes = [
    baseStyles,
    variants[variant] || variants.primary,
    sizes[size] || sizes.medium,
    className,
  ].join(' ');

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
