import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

// Validation rules
export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return null;
  },
  
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  
  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },
  
  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return null;
  },
  
  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },
  
  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },
  
  number: (value) => {
    if (!value) return null;
    if (isNaN(value)) {
      return 'Please enter a valid number';
    }
    return null;
  },
  
  positiveNumber: (value) => {
    if (!value) return null;
    if (isNaN(value) || parseFloat(value) <= 0) {
      return 'Please enter a positive number';
    }
    return null;
  }
};

// Custom hook for form validation
export const useFormValidation = (initialState, validationSchema) => {
  const [values, setValues] = React.useState(initialState);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validateField = (name, value) => {
    const fieldRules = validationSchema[name];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Form field component with validation
export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  className = '',
  ...props
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${hasError 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : isValid
              ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
            }
            ${className}
          `}
          {...props}
        />
        
        {/* Validation icons */}
        {touched && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : value ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// Textarea field component with validation
export const TextareaField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  rows = 4,
  className = '',
  ...props
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          name={name}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          placeholder={placeholder}
          rows={rows}
          className={`
            w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-vertical
            ${hasError 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : isValid
              ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      
      {/* Error message */}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// Select field component with validation
export const SelectField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          name={name}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          className={`
            w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${hasError 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : isValid
              ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
            }
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Validation icons */}
        {touched && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            {error ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : value ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default {
  validationRules,
  useFormValidation,
  FormField,
  TextareaField,
  SelectField
};
