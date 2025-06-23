import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-3 py-2.5 border rounded-lg text-sm
          ${error 
            ? 'border-error focus:ring-error/50 focus:border-error' 
            : 'border-gray-300 focus:ring-primary/50 focus:border-primary'
          }
          focus:outline-none focus:ring-2 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;