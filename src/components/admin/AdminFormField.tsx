import { ReactNode } from 'react'

interface AdminFormFieldProps {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
  helpText?: string
}

export default function AdminFormField({ 
  label, 
  required = false, 
  children, 
  className = '',
  helpText 
}: AdminFormFieldProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  )
}
