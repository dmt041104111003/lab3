import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'

export default function StartupVietPage() {
  const startupSection = {
    title: "STARTUP VIỆT",
    mainArticle: {
      title: "Top 50 startup Việt Nam đáng chú ý nhất năm 2025",
      href: "/bai-viet/top-50-startup-vietnam-2025"
    },
    subArticles: [
      { title: "Fintech", href: "/bai-viet/fintech-startup" },
      { title: "Edtech", href: "/bai-viet/edtech-startup" },
      { title: "Healthtech", href: "/bai-viet/healthtech-startup" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ContentSection {...startupSection} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
