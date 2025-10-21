interface Option {
  value: string
  label: string
  color?: string
}

interface AdminSelectProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  placeholder?: string
  required?: boolean
  className?: string
  'aria-label'?: string
}

export default function AdminSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  required = false,
  className = '',
  'aria-label': ariaLabel
}: AdminSelectProps) {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
  
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      aria-label={ariaLabel || name}
      className={`${baseClasses} ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          className={option.color ? `text-[${option.color}]` : ''}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}
