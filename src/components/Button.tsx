"use client";

import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  target?: string;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "",
  href,
  target,
  ...props 
}: ButtonProps) {
  const baseClasses = "font-medium rounded-2xl transition-colors duration-200 inline-flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-[#d32b36] text-white hover:bg-[#b82530]",
    secondary: "bg-[#eea04a] text-white hover:bg-[#e08f35]",
    accent: "bg-[#f7bf38] text-gray-900 hover:bg-[#f5b520]",
    outline: "bg-transparent border-2 border-[#d32b36] text-[#d32b36] hover:bg-[#d32b36] hover:text-white"
  };
  
  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg"
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={buttonClasses} target={target}>
        {children}
      </Link>
    );
  }
  
  return (
    <button
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
}