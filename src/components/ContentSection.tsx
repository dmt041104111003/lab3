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
          {/* Main Article */}
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
          
          {/* Sub Articles */}
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
          {/* Main Article */}
          <div className="mb-6">
            <ArticleCard
              title={mainArticle.title}
              href={mainArticle.href}
              isMain={true}
              imageUrl={mainArticle.imageUrl}
              imageAlt={mainArticle.imageAlt}
              excerpt={mainArticle.excerpt}
            />
          </div>

          {/* Sub Articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subArticles.map((article, index) => (
              <ArticleCard
                key={index}
                title={article.title}
                href={article.href}
                imageUrl={article.imageUrl}
                imageAlt={article.imageAlt}
                excerpt={article.excerpt}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
