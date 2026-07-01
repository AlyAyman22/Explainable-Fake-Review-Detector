import { Ripple } from './Ripple';

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
  className?: string;
}

export function RippleButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
}: RippleButtonProps) {
  const baseStyles = 'relative overflow-hidden px-6 py-3 rounded-lg transition-all duration-200';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-purple-600 text-white hover:bg-purple-700',
    outlined: 'bg-transparent border-2 border-gray-700 text-gray-900 hover:bg-gray-100',
  };

  const rippleColors = {
    primary: 'rgba(255, 255, 255, 0.5)',
    secondary: 'rgba(255, 255, 255, 0.5)',
    outlined: 'rgba(0, 0, 0, 0.1)',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <Ripple color={rippleColors[variant]} />
    </button>
  );
}
