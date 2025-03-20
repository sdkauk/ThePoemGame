'use client';

import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Button({ 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={`${styles.button} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}