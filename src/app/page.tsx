'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'
import Sidebar from '@/components/Sidebar'
import AdminRedirect from '@/components/AdminRedirect'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  published: boolean
  createdAt: string
  category?: string
  subcategory?: string
  author: {
    name: string
    email: string
  }
}

export default function Home() {
  const [aiPosts, setAiPosts] = useState<Post[]>([])
  const [innovationPosts, setInnovationPosts] = useState<Post[]>([])
  const [productPosts, setProductPosts] = useState<Post[]>([])
  const [trendPosts, setTrendPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      const [aiRes, innovationRes, productRes, trendRes] = await Promise.all([
        fetch('/api/posts/category/ai-chuyen-doi-so'),
        fetch('/api/posts/category/doi-moi-sang-tao'),
        fetch('/api/posts/category/san-pham-review'),
        fetch('/api/posts/category/xu-huong-tuong-lai')
      ])

      const [aiData, innovationData, productData, trendData] = await Promise.all([
        aiRes.json(),
        innovationRes.json(),
        productRes.json(),
        trendRes.json()
      ])

      setAiPosts(aiData)
      setInnovationPosts(innovationData)
      setProductPosts(productData)
      setTrendPosts(trendData)
    } catch (error) {
      console.error('Error fetching home data:', error)
      setError('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const aiSection = {
    title: "AI – CHUYỂN ĐỔI SỐ",
    mainArticle: aiPosts.length > 0 ? {
      title: aiPosts[0].title,
      href: `/bai-viet/${aiPosts[0].slug}`
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: aiPosts.slice(1, 4).map(post => ({
      title: post.title,
      href: `/bai-viet/${post.slug}`
    }))
  }

  const innovationSection = {
    title: "ĐỔI MỚI SÁNG TẠO",
    mainArticle: innovationPosts.length > 0 ? {
      title: innovationPosts[0].title,
      href: `/bai-viet/${innovationPosts[0].slug}`
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: innovationPosts.slice(1, 4).map(post => ({
      title: post.title,
      href: `/bai-viet/${post.slug}`
    }))
  }

  const productSection = {
    title: "SẢN PHẨM & REVIEW",
    mainArticle: productPosts.length > 0 ? {
      title: productPosts[0].title,
      href: `/bai-viet/${productPosts[0].slug}`
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: productPosts.slice(1, 4).map(post => ({
      title: post.title,
      href: `/bai-viet/${post.slug}`
    }))
  }

  const trendSection = {
    title: "XU HƯỚNG TƯƠNG LAI",
    mainArticle: trendPosts.length > 0 ? {
      title: trendPosts[0].title,
      href: `/bai-viet/${trendPosts[0].slug}`
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: trendPosts.slice(1, 4).map(post => ({
      title: post.title,
      href: `/bai-viet/${post.slug}`
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminRedirect />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Đang tải...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminRedirect />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminRedirect />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-3 space-y-8">
            <ContentSection {...aiSection} />
            <ContentSection {...innovationSection} />
            <ContentSection {...productSection} />
            <ContentSection {...trendSection} />
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
