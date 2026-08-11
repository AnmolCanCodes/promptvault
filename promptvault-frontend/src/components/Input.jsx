const Input = ({ 
  label, 
  type = 'text', 
  placeholder = '', 
  value = '', 
  onChange, 
  error = '', 
  disabled = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'w-full rounded-md border px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100';
  const errorStyles = error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200';
  const disabledStyles = disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white';
  
  const classes = `${baseStyles} ${errorStyles} ${disabledStyles} ${className}`;
  
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1.5 text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={classes}
        {...props}
      />
      {error && (
        <span className="mt-1 text-sm text-rose-600">{error}</span>
      )}
    </div>
  );
};

export default Input;
