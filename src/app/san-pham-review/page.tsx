import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'

export default function SanPhamReviewPage() {
  const newDevicesSection = {
    title: "THIẾT BỊ MỚI",
    mainArticle: {
      title: "iPhone 16 Pro Max: Đánh giá chi tiết camera AI",
      href: "/bai-viet/iphone-16-pro-max-review"
    },
    subArticles: [
      { title: "Thiết bị 1", href: "/bai-viet/device-1" },
      { title: "Thiết bị 2", href: "/bai-viet/device-2" },
      { title: "Thiết bị 3", href: "/bai-viet/device-3" }
    ]
  }

  const appsSoftwareSection = {
    title: "ỨNG DỤNG & PHẦN MỀM",
    mainArticle: {
      title: "Top 5 ứng dụng AI hữu ích cho doanh nghiệp",
      href: "/bai-viet/top-5-ai-apps-business"
    },
    subArticles: [
      { title: "Ứng dụng 1", href: "/bai-viet/app-1" },
      { title: "Phần mềm 1", href: "/bai-viet/software-1" },
      { title: "App 1", href: "/bai-viet/app-2" }
    ]
  }

  const productReviewSection = {
    title: "ĐÁNH GIÁ SẢN PHẨM",
    mainArticle: {
      title: "MacBook Pro M3: Hiệu năng vượt trội cho chuyên gia",
      href: "/bai-viet/macbook-pro-m3-review"
    },
    subArticles: [
      { title: "Review 1", href: "/bai-viet/review-1" },
      { title: "Đánh giá 1", href: "/bai-viet/evaluation-1" },
      { title: "So sánh 1", href: "/bai-viet/comparison-1" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ContentSection {...newDevicesSection} />
          <ContentSection {...appsSoftwareSection} />
          <ContentSection {...productReviewSection} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
