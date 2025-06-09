import React from 'react';
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}
export function LoadingSpinner({
  size = 'medium'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };
  return <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
    </div>;
}