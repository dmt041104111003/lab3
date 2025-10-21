interface AdminCheckboxProps {
  name: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  helpText?: string
  className?: string
}

export default function AdminCheckbox({
  name,
  checked,
  onChange,
  label,
  helpText,
  className = ''
}: AdminCheckboxProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <label className="flex items-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300 rounded"
        />
        <span className="ml-2 text-sm font-medium text-gray-700">
          {label}
        </span>
      </label>
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  )
}
