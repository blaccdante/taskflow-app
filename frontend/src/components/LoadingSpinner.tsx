import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader className={`${sizeClasses.lg} animate-spin text-primary-600`} />
          <p className={`${textSizeClasses.lg} text-gray-600 font-medium`}>
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      {text && (
        <span className={`${textSizeClasses[size]} text-gray-600`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;