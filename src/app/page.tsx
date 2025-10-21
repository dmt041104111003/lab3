import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const aiSection = {
    title: "AI – CHUYỂN ĐỔI SỐ",
    mainArticle: {
      title: "Xu hướng AI trong doanh nghiệp Việt Nam 2025",
      href: "/bai-viet/ai-doanh-nghiep-2025"
    },
    subArticles: [
      { title: "Bài phụ", href: "/bai-viet/ai-1" },
      { title: "Bài phụ", href: "/bai-viet/ai-2" },
      { title: "Bài phụ", href: "/bai-viet/ai-3" }
    ]
  }

  const innovationSection = {
    title: "ĐỔI MỚI SÁNG TẠO",
    mainArticle: {
      title: "Startup Việt Nam: Cơ hội và thách thức",
      href: "/bai-viet/startup-vietnam"
    },
    subArticles: [
      { title: "Sản phẩm", href: "/bai-viet/san-pham-1" },
      { title: "Sản phẩm & Review", href: "/bai-viet/san-pham-review-1" },
      { title: "Bài phụ", href: "/bai-viet/innovation-1" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-3 space-y-8">
            <ContentSection {...aiSection} />
            <ContentSection {...innovationSection} />
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
