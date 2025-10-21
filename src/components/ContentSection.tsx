import SectionBanner from './SectionBanner'
import ArticleCard from './ArticleCard'

interface ContentSectionProps {
  title: string
  mainArticle: {
    title: string
    href: string
  }
  subArticles: Array<{
    title: string
    href: string
  }>
  className?: string
}

export default function ContentSection({ title, mainArticle, subArticles, className = "" }: ContentSectionProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <SectionBanner title={title} />
      
      {/* Main Article */}
      <div className="mb-6">
        <ArticleCard
          title={mainArticle.title}
          href={mainArticle.href}
          isMain={true}
        />
      </div>

      {/* Sub Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subArticles.map((article, index) => (
          <ArticleCard
            key={index}
            title={article.title}
            href={article.href}
          />
        ))}
      </div>
    </div>
  )
}
