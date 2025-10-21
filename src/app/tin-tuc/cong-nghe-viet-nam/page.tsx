import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'

export default function CongNgheVietNamPage() {
  const vietnamTechSection = {
    title: "CÔNG NGHỆ VIỆT NAM",
    mainArticle: {
      title: "Việt Nam đứng thứ 2 Đông Nam Á về chỉ số chuyển đổi số",
      href: "/bai-viet/vietnam-digital-index-2025"
    },
    subArticles: [
      { title: "Chính phủ số", href: "/bai-viet/digital-government" },
      { title: "Thành phố thông minh", href: "/bai-viet/smart-city" },
      { title: "Nông nghiệp 4.0", href: "/bai-viet/agriculture-4-0" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ContentSection {...vietnamTechSection} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
