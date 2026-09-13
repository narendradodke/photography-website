import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-2">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`
            w-full bg-[#1A1A1A] dark:bg-[#1A1A1A] light:bg-[#F3F3F3]
            border ${error ? 'border-red-500' : 'border-[#2D2D2D] dark:border-[#2D2D2D] light:border-[#D5D5D5]'}
            text-white dark:text-white light:text-neutral-900
            rounded-none px-4 py-3 text-sm transition-colors duration-200
            focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]
            placeholder:text-neutral-500
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-2">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={`
            w-full bg-[#1A1A1A] dark:bg-[#1A1A1A] light:bg-[#F3F3F3]
            border ${error ? 'border-red-500' : 'border-[#2D2D2D] dark:border-[#2D2D2D] light:border-[#D5D5D5]'}
            text-white dark:text-white light:text-neutral-900
            rounded-none px-4 py-3 text-sm transition-colors duration-200
            focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]
            placeholder:text-neutral-500 min-h-[120px] resize-y
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
