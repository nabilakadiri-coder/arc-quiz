import Link from 'next/link'

type ButtonProps = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center px-8 py-4 text-sm font-medium tracking-wide transition-opacity'
  const variants = {
    primary: 'bg-primary text-surface hover:opacity-90',
    secondary: 'border border-primary text-primary hover:bg-primary hover:text-surface',
  }
  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    if (href.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      )
    }
    return <Link href={href} className={classes}>{children}</Link>
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${classes} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}
