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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ArticleCard
              title={mainArticle.title}
              href={mainArticle.href}
              isMain={true}
              imageUrl={mainArticle.imageUrl}
              imageAlt={mainArticle.imageAlt}
              excerpt={mainArticle.excerpt}
            />
          </div>
          <div className="space-y-4">
            {subArticles.map((article, index) => (
              <ArticleCard
                key={index}
                title={article.title}
                href={article.href}
                imageUrl={article.imageUrl}
                imageAlt={article.imageAlt}
                excerpt={article.excerpt}
                layout='horizontal'
              />
            ))}
          </div>
        </div>
      ) : variant === 'list' ? (
        <div className="space-y-4">
          <ArticleCard
            title={mainArticle.title}
            href={mainArticle.href}
            imageUrl={mainArticle.imageUrl}
            imageAlt={mainArticle.imageAlt}
            excerpt={mainArticle.excerpt}
            timestamp={mainArticle.timestamp}
            category={mainArticle.category}
            layout='list'
          />
          
          {subArticles.map((article, index) => (
            <ArticleCard
              key={index}
              title={article.title}
              href={article.href}
              imageUrl={article.imageUrl}
              imageAlt={article.imageAlt}
              excerpt={article.excerpt}
              timestamp={article.timestamp}
              category={article.category}
              layout='list'
            />
          ))}
        </div>
      ) : (
        <>
          <Link href={mainArticle.href} className="block relative h-96 md:h-96 overflow-hidden border-b-4 border-red-600 mb-6 rounded-lg hover:opacity-95 transition-opacity">
            {mainArticle.imageUrl ? (
              <img 
                src={mainArticle.imageUrl} 
                alt={mainArticle.imageAlt || mainArticle.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-gray-500 text-lg">Sắp ra mắt</span>
                </div>
              </div>
            )}
            
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-2/5 bg-white p-8 flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {mainArticle.title}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {mainArticle.excerpt || "Mô tả ngắn về bài viết chính trong chuyên mục này..."}
              </p>
              <p className="text-gray-500 text-xs">
                2h trước
              </p>
            </div>
            
            <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-4">
              <h1 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                {mainArticle.title}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                {mainArticle.excerpt || "Mô tả ngắn về bài viết chính trong chuyên mục này..."}
              </p>
              <p className="text-gray-500 text-xs">
                2h trước
              </p>
            </div>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subArticles.map((article, index) => (
              <Link key={index} href={article.href} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                {article.imageUrl ? (
                  <div className="relative h-32 overflow-hidden group rounded-t-lg">
                    <img 
                      src={article.imageUrl} 
                      alt={article.imageAlt || article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white w-8 h-8 rounded flex items-center justify-center text-sm">
                      📷
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="text-gray-500 text-sm">Sắp ra mắt</span>
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                    {article.excerpt || "Mô tả ngắn..."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  )
}
