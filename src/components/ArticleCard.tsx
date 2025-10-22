import Link from 'next/link'

interface ArticleCardProps {
  title: string
  href: string
  isMain?: boolean
  className?: string
  imageUrl?: string
  imageAlt?: string
  excerpt?: string
  layout?: 'vertical' | 'horizontal' | 'list'
  comments?: number
  timestamp?: string
  category?: string
}

export default function ArticleCard({ title, href, isMain = false, className = "", imageUrl, imageAlt, excerpt, layout = 'vertical', comments, timestamp, category }: ArticleCardProps) {
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

  if (layout === 'horizontal') {
    return (
      <Link href={href} className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 ${className}`}>
        <div className="flex">
          {/* Image Section */}
          <div className="flex-shrink-0 w-32 h-24">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={imageAlt || title}
                className="w-full h-full object-cover rounded-l-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-l-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-gray-500 text-xs">Sắp ra mắt</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="flex-1 p-4">
            <h4 className="text-gray-800 text-sm font-bold mb-2 line-clamp-2">{title}</h4>
            {excerpt && (
              <p className="text-gray-600 text-xs line-clamp-2 mb-2">{excerpt}</p>
            )}
            {comments !== undefined && (
              <div className="flex items-center text-gray-400 text-xs">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <span>{comments}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    )
  }

  if (layout === 'list') {
    return (
      <Link href={href} className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 ${className}`}>
        <div className="flex p-4">
          {/* Image Section */}
          <div className="flex-shrink-0 w-20 h-20">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={imageAlt || title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-gray-500 text-xs">Sắp ra mắt</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="flex-1 ml-4">
            {category && (
              <div className="text-xs text-blue-600 font-medium mb-1">{category}</div>
            )}
            <h4 className="text-gray-800 text-sm font-bold mb-2 line-clamp-2">{title}</h4>
            {excerpt && (
              <p className="text-gray-600 text-xs line-clamp-3 mb-2">{excerpt}</p>
            )}
            {timestamp && (
              <div className="text-gray-400 text-xs">{timestamp}</div>
            )}
          </div>
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
