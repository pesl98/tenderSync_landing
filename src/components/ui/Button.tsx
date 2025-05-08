import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
};

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  fullWidth = false,
}: ButtonProps) => {
  const baseClasses = 'rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-800 text-white hover:bg-blue-700 focus:ring-blue-600',
    secondary: 'bg-teal-600 text-white hover:bg-teal-500 focus:ring-teal-400',
    outline: 'bg-transparent border border-blue-800 text-blue-800 hover:bg-blue-50 focus:ring-blue-600',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;