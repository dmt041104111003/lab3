import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'

export default function DoiMoiSangTaoPage() {
  const startupSection = {
    title: "STARTUP VIỆT",
    mainArticle: {
      title: "Top 10 startup Việt Nam đáng chú ý năm 2025",
      href: "/bai-viet/top-10-startup-vietnam-2025"
    },
    subArticles: [
      { title: "Startup 1", href: "/bai-viet/startup-1" },
      { title: "Startup 2", href: "/bai-viet/startup-2" },
      { title: "Startup 3", href: "/bai-viet/startup-3" }
    ]
  }

  const ideasSection = {
    title: "Ý TƯỞNG HAY",
    mainArticle: {
      title: "Sáng kiến xanh: Giải pháp bền vững cho tương lai",
      href: "/bai-viet/green-innovation-solutions"
    },
    subArticles: [
      { title: "Ý tưởng 1", href: "/bai-viet/idea-1" },
      { title: "Ý tưởng 2", href: "/bai-viet/idea-2" },
      { title: "Ý tưởng 3", href: "/bai-viet/idea-3" }
    ]
  }

  const creativeEnterpriseSection = {
    title: "DOANH NGHIỆP SÁNG TẠO",
    mainArticle: {
      title: "Công ty Việt Nam tiên phong trong công nghệ blockchain",
      href: "/bai-viet/vietnam-blockchain-pioneer"
    },
    subArticles: [
      { title: "Doanh nghiệp 1", href: "/bai-viet/enterprise-1" },
      { title: "Sáng tạo 1", href: "/bai-viet/creative-1" },
      { title: "Đổi mới 1", href: "/bai-viet/innovation-1" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ContentSection {...startupSection} />
          <ContentSection {...ideasSection} />
          <ContentSection {...creativeEnterpriseSection} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
