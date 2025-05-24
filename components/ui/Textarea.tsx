import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}; 