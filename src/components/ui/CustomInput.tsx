import type { ReactNode } from 'react';

interface CustomInputProps {
  label: ReactNode;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
}

export function CustomInput({
  label,
  required,
  error,
  children,
  className = '',
  labelClassName = '',
  inputWrapperClassName = '',
}: CustomInputProps) {
  return (
    <div className={`w-full ${className}`}>
      <label className={`block font-semibold mb-1 text-slate-700 dark:text-slate-200 ${labelClassName}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={inputWrapperClassName}>{children}</div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}


