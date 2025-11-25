'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'
import HeroWeb3 from '@/components/HeroWeb3'
import ArticleSearchBand from '@/components/ArticleSearchBand'
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
  imageUrl?: string
  author: {
    name: string
    email: string
  }
  images?: Array<{
    image: {
      id: string
      path: string
      alt?: string
    }
  }>
}

export default function Home() {
  const [newsPosts, setNewsPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHomeData()
  }, [])

  useEffect(() => {
    document.title = 'LAB3 - Công nghệ & Đời sống'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent = 'LAB3 là trang tin công nghệ cập nhật xu hướng mới nhất và góc nhìn đa chiều về chuyển đổi số, sản phẩm và đời sống số.'
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = descriptionContent
      document.head.appendChild(meta)
    }
  }, [])

  const fetchHomeData = async () => {
    try {
      const response = await fetch('/api/posts/category/tin-tuc')
      if (!response.ok) {
        setError('Có lỗi xảy ra khi tải dữ liệu')
        return
      }
      const data = await response.json()
      const list = Array.isArray(data) ? data : Array.isArray(data?.posts) ? data.posts : []
      setNewsPosts(list)
    } catch (error) {
      setError('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const newsSection = {
    title: "TIN TỨC",
    mainArticle: newsPosts.length > 0 ? {
      title: newsPosts[0].title,
      href: `/tin-tuc/${newsPosts[0].subcategory || 'cong-nghe-viet-nam'}/${newsPosts[0].slug}`,
      imageUrl: newsPosts[0].images?.[0]?.image?.path || newsPosts[0].imageUrl,
      imageAlt: newsPosts[0].images?.[0]?.image?.alt || newsPosts[0].title,
      excerpt: newsPosts[0].excerpt
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: Array.from({ length: 3 }, (_, index) => {
      const post = newsPosts[index + 1]
      if (post) {
        return {
          title: post.title,
          href: `/tin-tuc/${post.subcategory || 'cong-nghe-viet-nam'}/${post.slug}`,
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
      <div className="min-h-screen bg-[#F5F4F0]">
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
      <div className="min-h-screen bg-[#F5F4F0]">
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
    <div className="min-h-screen bg-[#F5F4F0]">
      <AdminRedirect />
      <Header />
      <HeroWeb3 />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <ContentSection {...newsSection} />
      </main>

      <ArticleSearchBand />
      <Footer />
    </div>
  )
}
