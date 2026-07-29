import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'filled' | 'gray' | 'tinted' | 'plain' | 'destructive' | 'outline' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'iconOnly';
    icon?: React.ElementType;
    loading?: boolean;
    loadingText?: string;
    fullWidth?: boolean;
}

declare const Button: React.FC<ButtonProps>;
export default Button;
