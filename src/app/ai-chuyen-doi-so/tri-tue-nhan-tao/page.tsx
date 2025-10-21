import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'

export default function TriTueNhanTaoPage() {
  const aiSection = {
    title: "TRÍ TUỆ NHÂN TẠO (AI)",
    mainArticle: {
      title: "GPT-5: Cuộc cách mạng AI tiếp theo sẽ thay đổi thế giới",
      href: "/bai-viet/gpt-5-ai-revolution"
    },
    subArticles: [
      { title: "Machine Learning", href: "/bai-viet/machine-learning" },
      { title: "Deep Learning", href: "/bai-viet/deep-learning" },
      { title: "Neural Networks", href: "/bai-viet/neural-networks" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ContentSection {...aiSection} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
