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
  }
  subArticles: Array<{
    title: string
    href: string
    imageUrl?: string
    imageAlt?: string
    excerpt?: string
  }>
  className?: string
  variant?: 'default' | 'split'
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
