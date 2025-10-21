import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'

export default function AIChuyenDoiSoPage() {
  const aiSection = {
    title: "TRÍ TUỆ NHÂN TẠO (AI)",
    mainArticle: {
      title: "ChatGPT-5: Cuộc cách mạng AI tiếp theo",
      href: "/bai-viet/chatgpt-5-revolution"
    },
    subArticles: [
      { title: "AI 1", href: "/bai-viet/ai-1" },
      { title: "AI 2", href: "/bai-viet/ai-2" },
      { title: "AI 3", href: "/bai-viet/ai-3" }
    ]
  }

  const bigDataSection = {
    title: "DỮ LIỆU LỚN & IOT",
    mainArticle: {
      title: "Big Data trong nông nghiệp thông minh",
      href: "/bai-viet/big-data-smart-agriculture"
    },
    subArticles: [
      { title: "Big Data 1", href: "/bai-viet/big-data-1" },
      { title: "IoT 1", href: "/bai-viet/iot-1" },
      { title: "Data 1", href: "/bai-viet/data-1" }
    ]
  }

  const digitalTransformationSection = {
    title: "CHUYỂN ĐỔI SỐ TRONG DOANH NGHIỆP VÀ GIÁO DỤC",
    mainArticle: {
      title: "Giáo dục 4.0: Tương lai của học tập",
      href: "/bai-viet/education-4-0"
    },
    subArticles: [
      { title: "Giáo dục 1", href: "/bai-viet/education-1" },
      { title: "Doanh nghiệp 1", href: "/bai-viet/enterprise-1" },
      { title: "Chuyển đổi 1", href: "/bai-viet/transformation-1" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ContentSection {...aiSection} />
          <ContentSection {...bigDataSection} />
          <ContentSection {...digitalTransformationSection} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
