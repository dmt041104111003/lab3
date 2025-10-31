'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'
import HomeSidebar from '@/components/HomeSidebar'
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
  const [aiPosts, setAiPosts] = useState<Post[]>([])
  const [innovationPosts, setInnovationPosts] = useState<Post[]>([])
  const [productPosts, setProductPosts] = useState<Post[]>([])
  const [trendPosts, setTrendPosts] = useState<Post[]>([])
  const [quickNews, setQuickNews] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHomeData()
  }, [])

  useEffect(() => {
    document.title = 'TechNova - Công nghệ & Đời sống'
    
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
      const [newsRes, aiRes, innovationRes, productRes, trendRes, quickNewsRes] = await Promise.all([
        fetch('/api/posts/category/tin-tuc?limit=4'),
        fetch('/api/posts/category/ai-chuyen-doi-so?limit=5'),
        fetch('/api/posts/category/doi-moi-sang-tao?limit=4'),
        fetch('/api/posts/category/san-pham-review?limit=4'),
        fetch('/api/posts/category/xu-huong-tuong-lai?limit=4'),
        fetch('/api/posts/category/xu-huong-tuong-lai?limit=2')
      ])

      const [newsData, aiData, innovationData, productData, trendData, quickNewsData] = await Promise.all([
        newsRes.json(),
        aiRes.json(),
        innovationRes.json(),
        productRes.json(),
        trendRes.json(),
        quickNewsRes.json()
      ])

      setNewsPosts(newsData)
      setAiPosts(aiData)
      setInnovationPosts(innovationData)
      setProductPosts(productData)
      setTrendPosts(trendData)
      setQuickNews(quickNewsData)
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

  const aiSection = {
    title: "AI – CHUYỂN ĐỔI SỐ",
    mainArticle: aiPosts.length > 0 ? {
      title: aiPosts[0].title,
      href: `/ai-chuyen-doi-so/${aiPosts[0].subcategory || 'tri-tue-nhan-tao'}/${aiPosts[0].slug}`,
      imageUrl: aiPosts[0].images?.[0]?.image?.path || aiPosts[0].imageUrl,
      imageAlt: aiPosts[0].images?.[0]?.image?.alt || aiPosts[0].title,
      excerpt: aiPosts[0].excerpt
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: Array.from({ length: 4 }, (_, index) => {
      const post = aiPosts[index + 1]
      if (post) {
        return {
          title: post.title,
          href: `/ai-chuyen-doi-so/${post.subcategory || 'tri-tue-nhan-tao'}/${post.slug}`,
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
      href: `/doi-moi-sang-tao/${innovationPosts[0].subcategory || 'startup-viet'}/${innovationPosts[0].slug}`,
      imageUrl: innovationPosts[0].images?.[0]?.image?.path || innovationPosts[0].imageUrl,
      imageAlt: innovationPosts[0].images?.[0]?.image?.alt || innovationPosts[0].title,
      excerpt: innovationPosts[0].excerpt,
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: Array.from({ length: 2 }, (_, index) => {
      const post = innovationPosts[index + 1]
      if (post) {
        return {
          title: post.title,
          href: `/doi-moi-sang-tao/${post.subcategory || 'startup-viet'}/${post.slug}`,
          imageUrl: post.images?.[0]?.image?.path || post.imageUrl,
          imageAlt: post.images?.[0]?.image?.alt || post.title,
          excerpt: post.excerpt,
        }
      } else {
        return {
          title: "Bài viết sắp ra mắt",
          href: "#",
          imageUrl: undefined,
          imageAlt: "Bài viết sắp ra mắt",
          excerpt: "Nội dung thú vị đang được chuẩn bị...",
        }
      }
    })
  }

  const productSection = {
    title: "SẢN PHẨM & REVIEW",
    mainArticle: productPosts.length > 0 ? {
      title: productPosts[0].title,
      href: `/san-pham-review/${productPosts[0].subcategory || 'thiet-bi-moi'}/${productPosts[0].slug}`,
      imageUrl: productPosts[0].images?.[0]?.image?.path || productPosts[0].imageUrl,
      imageAlt: productPosts[0].images?.[0]?.image?.alt || productPosts[0].title,
      excerpt: productPosts[0].excerpt,
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: Array.from({ length: 2 }, (_, index) => {
      const post = productPosts[index + 1]
      if (post) {
        return {
          title: post.title,
          href: `/san-pham-review/${post.subcategory || 'thiet-bi-moi'}/${post.slug}`,
          imageUrl: post.images?.[0]?.image?.path || post.imageUrl,
          imageAlt: post.images?.[0]?.image?.alt || post.title,
          excerpt: post.excerpt,
        }
      } else {
        return {
          title: "Bài viết sắp ra mắt",
          href: "#",
          imageUrl: undefined,
          imageAlt: "Bài viết sắp ra mắt",
          excerpt: "Nội dung thú vị đang được chuẩn bị...",
        }
      }
    })
  }

  const trendSection = {
    title: "XU HƯỚNG TƯƠNG LAI",
    mainArticle: trendPosts.length > 0 ? {
      title: trendPosts[0].title,
      href: `/xu-huong-tuong-lai/${trendPosts[0].subcategory || 'blockchain'}/${trendPosts[0].slug}`,
      imageUrl: trendPosts[0].images?.[0]?.image?.path || trendPosts[0].imageUrl,
      imageAlt: trendPosts[0].images?.[0]?.image?.alt || trendPosts[0].title,
      excerpt: trendPosts[0].excerpt,
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: Array.from({ length: 2 }, (_, index) => {
      const post = trendPosts[index + 1]
      if (post) {
        return {
          title: post.title,
          href: `/xu-huong-tuong-lai/${post.subcategory || 'blockchain'}/${post.slug}`,
          imageUrl: post.images?.[0]?.image?.path || post.imageUrl,
          imageAlt: post.images?.[0]?.image?.alt || post.title,
          excerpt: post.excerpt,
        }
      } else {
        return {
          title: "Bài viết sắp ra mắt",
          href: "#",
          imageUrl: undefined,
          imageAlt: "Bài viết sắp ra mắt",
          excerpt: "Nội dung thú vị đang được chuẩn bị...",
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
          <div className="lg:col-span-3 space-y-8">
            <ContentSection {...newsSection} />
            <ContentSection {...aiSection} variant="split" />
            <ContentSection {...innovationSection} variant="list" />
            <ContentSection {...productSection} variant="list" />
            <ContentSection {...trendSection} variant="list" />
          </div>

          <div className="lg:col-span-1">
            <HomeSidebar 
              quickNews={quickNews} 
              techToday={aiPosts} 
              mostRead={newsPosts}
              innovationPosts={innovationPosts}
              productPosts={productPosts}
              trendPosts={trendPosts}
              latestNews={newsPosts}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
