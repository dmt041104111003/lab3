interface AdminPageHeaderProps {
  title: string
  description?: string
  actionButton?: {
    text: string
    href: string
    className?: string
  }
}

export default function AdminPageHeader({ title, description, actionButton }: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-gray-600">{description}</p>
          )}
        </div>
        
      </div>
    </div>
  )
}
