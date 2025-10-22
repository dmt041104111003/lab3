interface AdminPageHeaderProps {
  title: string
  description?: string
  actionButton?: {
    text: string
    href: string
    className?: string
  }
  backButton?: {
    text: string
    href: string
    className?: string
  }
}

export default function AdminPageHeader({ title, description, actionButton, backButton }: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      {backButton && (
        <div className="mb-4">
          <a
            href={backButton.href}
            className={`inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors ${backButton.className || ''}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {backButton.text}
          </a>
        </div>
      )}
      
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
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-tech-blue hover:bg-tech-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tech-blue ${actionButton.className || ''}`}
          >
            {actionButton.text}
          </a>
        )}
      </div>
    </div>
  )
}
