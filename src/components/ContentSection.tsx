import Link from 'next/link'
import SectionBanner from './SectionBanner'
import ArticleCard from './ArticleCard'

interface ContentSectionProps {
  title: string
  mainArticle: {
    title: string
    href: string
    imageUrl?: string
    imageAlt?: string
    excerpt?: string
    timestamp?: string
    category?: string
  }
  subArticles: Array<{
    title: string
    href: string
    imageUrl?: string
    imageAlt?: string
    excerpt?: string
    timestamp?: string
    category?: string
  }>
  className?: string
  variant?: 'default' | 'split' | 'list'
}

export default function ContentSection({ title, mainArticle, subArticles, className = "", variant = 'default' }: ContentSectionProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <SectionBanner title={title} />
      <div className="mt-6">
      {variant === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
              <Link href={mainArticle.href} className="block">
                {mainArticle.imageUrl ? (
                  <div className="relative aspect-video overflow-hidden group">
                    <img 
                      src={mainArticle.imageUrl} 
                      alt={mainArticle.imageAlt || mainArticle.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="text-gray-500 text-lg">Sắp ra mắt</span>
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <h2 
                    className="text-sm font-bold text-gray-900 mb-2 leading-tight hover:text-red-600 transition-colors line-clamp-2"
                    title={mainArticle.title}
                  >
                    {mainArticle.title.length > 60 ? 
                      mainArticle.title.substring(0, 60) + '...' : 
                      mainArticle.title
                    }
                  </h2>
                  <p 
                    className="text-gray-600 text-xs leading-relaxed line-clamp-2"
                    title={mainArticle.excerpt || "Mô tả ngắn về bài viết chính trong chuyên mục này..."}
                  >
                    {mainArticle.excerpt ? 
                      (mainArticle.excerpt.length > 100 ? 
                        mainArticle.excerpt.substring(0, 100) + '...' : 
                        mainArticle.excerpt
                      ) : 
                      "Mô tả ngắn về bài viết chính trong chuyên mục này..."
                    }
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {subArticles.map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                <Link href={article.href} className="block">
                  <div className="flex items-stretch">
                    <div className="flex-shrink-0 w-32 aspect-video" style={{ aspectRatio: '16/9' }}>
                      {article.imageUrl ? (
                        <img 
                          src={article.imageUrl} 
                          alt={article.imageAlt || article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                          <div className="text-center">
                            <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="text-gray-500 text-xs">Sắp ra mắt</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 h-full p-2 flex items-center">
                      <h4 
                        className="text-gray-800 text-xs font-bold line-clamp-2 hover:text-red-600 transition-colors"
                        title={article.title}
                      >
                        {article.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : variant === 'list' ? (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
            <Link href={mainArticle.href} className="block">
              <div className="flex p-4">
                <div className="flex-shrink-0 w-32 aspect-video" style={{ aspectRatio: '16/9' }}>
                  {mainArticle.imageUrl ? (
                    <img 
                      src={mainArticle.imageUrl} 
                      alt={mainArticle.imageAlt || mainArticle.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                      <div className="text-center">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-gray-500 text-xs">Sắp ra mắt</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 ml-4">
                  {mainArticle.category && (
                    <div className="text-xs text-blue-600 font-medium mb-1">{mainArticle.category}</div>
                  )}
                  <h2 
                    className="text-sm font-bold text-gray-800 mb-1 line-clamp-2 hover:text-red-600 transition-colors"
                    title={mainArticle.title}
                  >
                    {mainArticle.title.length > 70 ? 
                      mainArticle.title.substring(0, 70) + '...' : 
                      mainArticle.title
                    }
                  </h2>
                  {mainArticle.excerpt && (
                    <p 
                      className="text-gray-600 text-xs line-clamp-2 mb-1"
                      title={mainArticle.excerpt}
                    >
                      {mainArticle.excerpt}
                    </p>
                  )}
                  {mainArticle.timestamp && (
                    <div className="text-gray-400 text-xs">{mainArticle.timestamp}</div>
                  )}
                </div>
              </div>
            </Link>
          </div>
          
          {subArticles.map((article, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
              <Link href={article.href} className="block">
                <div className="flex p-4">
                  <div className="flex-shrink-0 w-32 aspect-video" style={{ aspectRatio: '16/9' }}>
                    {article.imageUrl ? (
                      <img 
                        src={article.imageUrl} 
                        alt={article.imageAlt || article.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                        <div className="text-center">
                          <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="text-gray-500 text-xs">Sắp ra mắt</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 ml-4">
                    {article.category && (
                      <div className="text-xs text-blue-600 font-medium mb-1">{article.category}</div>
                    )}
                    <h4 
                      className="text-gray-800 text-xs font-bold mb-1 line-clamp-2 hover:text-red-600 transition-colors"
                      title={article.title}
                    >
                      {article.title}
                    </h4>
                    {article.excerpt && (
                      <p 
                        className="text-gray-600 text-xs line-clamp-2 mb-1"
                        title={article.excerpt}
                      >
                        {article.excerpt}
                      </p>
                    )}
                    {article.timestamp && (
                      <div className="text-gray-400 text-xs">{article.timestamp}</div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b-4 border-red-600 mb-6 rounded-lg overflow-hidden">
            {/* Ảnh full bên trái */}
            <div className="relative aspect-video">
              <Link href={mainArticle.href} className="block w-full h-full">
                {mainArticle.imageUrl ? (
                  <img 
                    src={mainArticle.imageUrl} 
                    alt={mainArticle.imageAlt || mainArticle.title}
                    className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="text-gray-500 text-lg">Sắp ra mắt</span>
                    </div>
                  </div>
                )}
              </Link>
            </div>
            
            {/* Nội dung bên phải */}
            <div className="bg-white p-4 md:p-6 flex flex-col justify-center">
              <Link href={mainArticle.href} className="block">
                <h1 
                  className="text-lg md:text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-red-600 transition-colors line-clamp-2"
                  title={mainArticle.title}
                >
                  {mainArticle.title.length > 80 ? 
                    mainArticle.title.substring(0, 80) + '...' : 
                    mainArticle.title
                  }
                </h1>
                <p 
                  className="text-gray-600 text-sm leading-relaxed mb-2 line-clamp-2"
                  title={mainArticle.excerpt || "Mô tả ngắn về bài viết chính trong chuyên mục này..."}
                >
                  {mainArticle.excerpt ? 
                    (mainArticle.excerpt.length > 150 ? 
                      mainArticle.excerpt.substring(0, 150) + '...' : 
                      mainArticle.excerpt
                    ) : 
                    "Mô tả ngắn về bài viết chính trong chuyên mục này..."
                  }
                </p>
       
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {subArticles.map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                <Link href={article.href} className="block">
                  {article.imageUrl ? (
                    <div className="relative aspect-video overflow-hidden group">
                      <img 
                        src={article.imageUrl} 
                        alt={article.imageAlt || article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-gray-500 text-sm">Sắp ra mắt</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3">
                    <h3 
                      className="text-sm font-semibold text-gray-900 mb-1 leading-tight line-clamp-2 hover:text-red-600 transition-colors"
                      title={article.title}
                    >
                      {article.title}
                    </h3>
                    <p 
                      className="text-gray-600 text-xs leading-relaxed line-clamp-2"
                      title={article.excerpt || "Mô tả ngắn..."}
                    >
                      {article.excerpt || "Mô tả ngắn..."}
                    </p>
             
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  )
}
