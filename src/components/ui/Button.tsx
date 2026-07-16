import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
}

export function Button({ variant = 'primary', icon, className = '', children, ...props }: ButtonProps) {
  const variants: Record<Variant, string> = {
    primary: 'bg-brand text-white shadow-[0_8px_20px_rgba(36,107,253,.22)] hover:bg-[#1559e8]',
    secondary: 'border border-line bg-white text-ink hover:border-brand/40 hover:bg-brand/5',
    ghost: 'text-muted hover:bg-canvas hover:text-ink',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100',
  }
  return (
    <button
      className={`focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
