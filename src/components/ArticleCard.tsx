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
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-500">Ảnh minh họa</span>
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
          <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Ảnh</span>
          </div>
        )}
        <div className="text-center">
          <span className="text-gray-600 text-sm">{title}</span>
        </div>
      </div>
    </Link>
  )
}
