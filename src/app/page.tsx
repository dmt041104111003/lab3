'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'
import Sidebar from '@/components/Sidebar'
import AdminRedirect from '@/components/AdminRedirect'
import LoadingState from '@/components/LoadingState'

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

  useEffect(() => {
    document.title = 'TechNova - Công nghệ & Đời sống'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Trang tin công nghệ hàng đầu Việt Nam, cập nhật xu hướng công nghệ mới và tác động của chúng tới đời sống con người.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Trang tin công nghệ hàng đầu Việt Nam, cập nhật xu hướng công nghệ mới và tác động của chúng tới đời sống con người.'
      document.head.appendChild(meta)
    }
  }, [])

  const fetchHomeData = async () => {
    try {
      const [aiRes, innovationRes, productRes, trendRes] = await Promise.all([
        fetch('/api/posts/category/ai-chuyen-doi-so?limit=4'),
        fetch('/api/posts/category/doi-moi-sang-tao?limit=4'),
        fetch('/api/posts/category/san-pham-review?limit=4'),
        fetch('/api/posts/category/xu-huong-tuong-lai?limit=4')
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
      href: `/bai-viet/${aiPosts[0].slug}`,
      imageUrl: aiPosts[0].images?.[0]?.image?.path || aiPosts[0].imageUrl,
      imageAlt: aiPosts[0].images?.[0]?.image?.alt || aiPosts[0].title,
      excerpt: aiPosts[0].excerpt
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: Array.from({ length: 3 }, (_, index) => {
      const post = aiPosts[index + 1]
      if (post) {
        return {
          title: post.title,
          href: `/bai-viet/${post.slug}`,
          imageUrl: post.images?.[0]?.image?.path || post.imageUrl,
          imageAlt: post.images?.[0]?.image?.alt || post.title,
          excerpt: post.excerpt
        }
      } else {
        return {
          title: "Bài viết sắp ra mắt",
          href: "#",
          imageUrl: undefined,
          imageAlt: "Bài viết sắp ra mắt",
          excerpt: "Nội dung thú vị đang được chuẩn bị..."
        }
      }
    })
  }

  const innovationSection = {
    title: "ĐỔI MỚI SÁNG TẠO",
    mainArticle: innovationPosts.length > 0 ? {
      title: innovationPosts[0].title,
      href: `/bai-viet/${innovationPosts[0].slug}`,
      imageUrl: innovationPosts[0].images?.[0]?.image?.path || innovationPosts[0].imageUrl,
      imageAlt: innovationPosts[0].images?.[0]?.image?.alt || innovationPosts[0].title,
      excerpt: innovationPosts[0].excerpt
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: Array.from({ length: 3 }, (_, index) => {
      const post = innovationPosts[index + 1]
      if (post) {
        return {
          title: post.title,
          href: `/bai-viet/${post.slug}`,
          imageUrl: post.images?.[0]?.image?.path || post.imageUrl,
          imageAlt: post.images?.[0]?.image?.alt || post.title,
          excerpt: post.excerpt
        }
      } else {
        return {
          title: "Bài viết sắp ra mắt",
          href: "#",
          imageUrl: undefined,
          imageAlt: "Bài viết sắp ra mắt",
          excerpt: "Nội dung thú vị đang được chuẩn bị..."
        }
      }
    })
  }

  const productSection = {
    title: "SẢN PHẨM & REVIEW",
    mainArticle: productPosts.length > 0 ? {
      title: productPosts[0].title,
      href: `/bai-viet/${productPosts[0].slug}`,
      imageUrl: productPosts[0].images?.[0]?.image?.path || productPosts[0].imageUrl,
      imageAlt: productPosts[0].images?.[0]?.image?.alt || productPosts[0].title,
      excerpt: productPosts[0].excerpt
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: Array.from({ length: 3 }, (_, index) => {
      const post = productPosts[index + 1]
      if (post) {
        return {
          title: post.title,
          href: `/bai-viet/${post.slug}`,
          imageUrl: post.images?.[0]?.image?.path || post.imageUrl,
          imageAlt: post.images?.[0]?.image?.alt || post.title,
          excerpt: post.excerpt
        }
      } else {
        return {
          title: "Bài viết sắp ra mắt",
          href: "#",
          imageUrl: undefined,
          imageAlt: "Bài viết sắp ra mắt",
          excerpt: "Nội dung thú vị đang được chuẩn bị..."
        }
      }
    })
  }

  const trendSection = {
    title: "XU HƯỚNG TƯƠNG LAI",
    mainArticle: trendPosts.length > 0 ? {
      title: trendPosts[0].title,
      href: `/bai-viet/${trendPosts[0].slug}`,
      imageUrl: trendPosts[0].images?.[0]?.image?.path || trendPosts[0].imageUrl,
      imageAlt: trendPosts[0].images?.[0]?.image?.alt || trendPosts[0].title,
      excerpt: trendPosts[0].excerpt
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: Array.from({ length: 3 }, (_, index) => {
      const post = trendPosts[index + 1]
      if (post) {
        return {
          title: post.title,
          href: `/bai-viet/${post.slug}`,
          imageUrl: post.images?.[0]?.image?.path || post.imageUrl,
          imageAlt: post.images?.[0]?.image?.alt || post.title,
          excerpt: post.excerpt
        }
      } else {
        return {
          title: "Bài viết sắp ra mắt",
          href: "#",
          imageUrl: undefined,
          imageAlt: "Bài viết sắp ra mắt",
          excerpt: "Nội dung thú vị đang được chuẩn bị..."
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminRedirect />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState message="Đang tải dữ liệu trang chủ..." />
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
