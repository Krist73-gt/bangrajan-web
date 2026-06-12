import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({ children, className = '', hover = false, glow = false }: CardProps) {
  return (
    <div
      className={`
        bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]
        shadow-[var(--shadow-sm)]
        transition-all duration-300
        ${hover ? 'hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 hover:border-[var(--accent)]' : ''}
        ${glow ? 'hover:shadow-[var(--shadow-gold)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
