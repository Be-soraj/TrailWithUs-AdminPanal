import React from 'react';

interface ComingSoonProps {
  message?: string;
  className?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  message = 'Coming Soon!',
  className = '',
}) => {
  return (
    <div className={`flex justify-center items-center min-h-[200px] p-8 bg-gray-50 rounded-lg shadow-sm text-center ${className}`}>
      <div className="max-w-md">
        <div className="text-5xl mb-6 animate-pulse">🚧</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{message}</h2>
        <p className="text-gray-600 leading-relaxed">
          This feature is currently under development. We're working hard to bring it to you soon!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;