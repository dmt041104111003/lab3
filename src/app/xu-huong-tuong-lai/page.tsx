import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'

export default function XuHuongTuongLaiPage() {
  const blockchainSection = {
    title: "BLOCKCHAIN",
    mainArticle: {
      title: "Web3 và tương lai của Internet phi tập trung",
      href: "/bai-viet/web3-decentralized-internet"
    },
    subArticles: [
      { title: "Blockchain 1", href: "/bai-viet/blockchain-1" },
      { title: "Crypto 1", href: "/bai-viet/crypto-1" },
      { title: "NFT 1", href: "/bai-viet/nft-1" }
    ]
  }

  const greenTechSection = {
    title: "CÔNG NGHỆ XANH (GREENTECH)",
    mainArticle: {
      title: "Năng lượng tái tạo: Cuộc cách mạng xanh toàn cầu",
      href: "/bai-viet/renewable-energy-green-revolution"
    },
    subArticles: [
      { title: "Xanh 1", href: "/bai-viet/green-1" },
      { title: "Bền vững 1", href: "/bai-viet/sustainable-1" },
      { title: "Môi trường 1", href: "/bai-viet/environment-1" }
    ]
  }

  const metaverseSection = {
    title: "METAVERSE",
    mainArticle: {
      title: "Metaverse 2.0: Tương lai của không gian ảo",
      href: "/bai-viet/metaverse-2-0-future"
    },
    subArticles: [
      { title: "Metaverse 1", href: "/bai-viet/metaverse-1" },
      { title: "VR 1", href: "/bai-viet/vr-1" },
      { title: "AR 1", href: "/bai-viet/ar-1" }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ContentSection {...blockchainSection} />
          <ContentSection {...greenTechSection} />
          <ContentSection {...metaverseSection} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
