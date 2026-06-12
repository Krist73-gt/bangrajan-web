import { ReactNode } from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'gold' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20',
  danger: 'bg-fight-500/15 text-fight-500 border-fight-500/20',
  warning: 'bg-amber-500/15 text-amber-500 border-amber-500/20',
  gold: 'bg-gold-500/15 text-gold-500 border-gold-500/20',
  neutral: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-color)]',
};

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        border transition-colors
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
