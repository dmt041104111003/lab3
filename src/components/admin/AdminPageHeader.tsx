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
        {actionButton && (
          <a
            href={actionButton.href}
            className={`bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-tech-dark-blue transition-colors ${actionButton.className || ''}`}
          >
            {actionButton.text}
          </a>
        )}
      </div>
    </div>
  )
}
