import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-2.5 rounded-xl text-sm
              bg-[var(--bg-elevated)] text-[var(--text-primary)]
              border border-[var(--border-color)]
              placeholder:text-[var(--text-muted)]
              transition-all duration-200
              hover:border-[var(--accent)]
              focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-fight-500 focus:border-fight-500 focus:ring-fight-500/20' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-fight-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
