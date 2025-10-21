interface AdminInputProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'file'
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  accept?: string
  className?: string
}

export default function AdminInput({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  accept,
  className = ''
}: AdminInputProps) {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
  
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      accept={accept}
      className={`${baseClasses} ${className}`}
    />
  )
}
