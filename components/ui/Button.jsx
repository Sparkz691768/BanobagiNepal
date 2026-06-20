export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    dark: 'btn-dark',
    danger:
      'bg-red-600 text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 transition-colors hover:bg-red-700 focus:outline-none',
    success:
      'bg-green-600 text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 transition-colors hover:bg-green-700 focus:outline-none',
  }
  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
