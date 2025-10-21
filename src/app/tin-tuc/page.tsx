import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'

export default function TinTucPage() {
  const vietnamTechSection = {
    title: "CÔNG NGHỆ VIỆT NAM",
    mainArticle: {
      title: "Việt Nam dẫn đầu Đông Nam Á về chuyển đổi số",
      href: "/bai-viet/vietnam-digital-transformation"
    },
    subArticles: [
      { title: "Tin tức 1", href: "/bai-viet/vietnam-tech-1" },
      { title: "Tin tức 2", href: "/bai-viet/vietnam-tech-2" },
      { title: "Tin tức 3", href: "/bai-viet/vietnam-tech-3" }
    ]
  }

  const worldTechSection = {
    title: "CÔNG NGHỆ THẾ GIỚI",
    mainArticle: {
      title: "Apple ra mắt iPhone 16 với AI tích hợp",
      href: "/bai-viet/apple-iphone-16-ai"
    },
    subArticles: [
      { title: "Tin tức 1", href: "/bai-viet/world-tech-1" },
      { title: "Tin tức 2", href: "/bai-viet/world-tech-2" },
      { title: "Tin tức 3", href: "/bai-viet/world-tech-3" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ContentSection {...vietnamTechSection} />
          <ContentSection {...worldTechSection} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
