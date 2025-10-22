import Link from 'next/link'

interface ArticleCardProps {
  title: string
  href: string
  isMain?: boolean
  className?: string
  imageUrl?: string
  imageAlt?: string
  excerpt?: string
}

export default function ArticleCard({ title, href, isMain = false, className = "", imageUrl, imageAlt, excerpt }: ArticleCardProps) {
  if (isMain) {
    return (
      <Link href={href} className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 ${className}`}>
        <div className="p-6">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={imageAlt || title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-gray-500 text-sm">Sắp ra mắt</span>
              </div>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm">
            {excerpt || "Mô tả ngắn về bài viết chính trong chuyên mục này..."}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 ${className}`}>
      <div className="p-4">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={imageAlt || title}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-gray-500 text-xs">Sắp ra mắt</span>
            </div>
          </div>
        )}
        <div className="text-center">
          <h4 className="text-gray-800 text-sm font-medium mb-1">{title}</h4>
          {excerpt && (
            <p className="text-gray-600 text-xs line-clamp-2">{excerpt}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
