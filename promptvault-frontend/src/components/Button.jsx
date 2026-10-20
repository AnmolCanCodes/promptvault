
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
    whitespace-nowrap rounded-lg border border-transparent
    font-sans font-semibold leading-none tracking-[-0.02em]
    shadow-[0_1px_0_rgba(32,41,35,0.04)]
    transition-all duration-180 ease-out
    focus-visible:outline-2 focus-visible:outline-offset-2
    disabled:pointer-events-none disabled:opacity-50
    active:translate-y-px
  `;

  const variants = {
    primary: `
      bg-[var(--color-primary)]
      text-white
      shadow-[0_10px_20px_rgba(38,123,104,0.18)]
      hover:bg-[var(--color-primary-hover)]
      hover:shadow-[0_12px_22px_rgba(38,123,104,0.22)]
      focus-visible:outline-[var(--color-primary)]
    `,
    secondary: `
      border border-[var(--color-border-strong)]
      bg-[var(--color-bg-elevated)]
      text-[var(--color-text)]
      hover:bg-[var(--color-bg-hover)]
      hover:border-[var(--color-text-subtle)]
      hover:shadow-[0_8px_18px_rgba(32,41,35,0.08)]
      focus-visible:outline-[var(--color-primary)]
    `,
    danger: `
      bg-[var(--color-error)]
      text-white
      shadow-[0_10px_20px_rgba(196,78,72,0.18)]
      hover:brightness-95
      hover:shadow-[0_12px_22px_rgba(196,78,72,0.22)]
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
    small: 'min-h-8 px-3 text-[12px]',
    medium: 'min-h-10 px-4 text-sm',
    large: 'min-h-12 px-5 text-[15px]',
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
