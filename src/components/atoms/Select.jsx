import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  label, 
  error, 
  options = [], 
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
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-3 py-2.5 border rounded-lg text-sm appearance-none
            ${error 
              ? 'border-error focus:ring-error/50 focus:border-error' 
              : 'border-gray-300 focus:ring-primary/50 focus:border-primary'
            }
            focus:outline-none focus:ring-2 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            pr-10 bg-white
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;