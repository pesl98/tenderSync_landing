import React from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  className?: string;
};

export const FormField = ({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange,
  error,
  className = '',
}: FormFieldProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          rows={4}
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;