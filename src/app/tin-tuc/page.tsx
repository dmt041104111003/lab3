'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'
import LoadingState from '@/components/LoadingState'
import { CATEGORIES } from '@/lib/categories'

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
  images?: Array<{
    image: {
      id: string
      path: string
      alt?: string
    }
  }>
}

export default function TinTucPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    document.title = 'Tin tức công nghệ - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Cập nhật tin tức công nghệ mới nhất từ Việt Nam và thế giới. Theo dõi xu hướng công nghệ, phát minh mới và tác động của chúng tới đời sống.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Cập nhật tin tức công nghệ mới nhất từ Việt Nam và thế giới. Theo dõi xu hướng công nghệ, phát minh mới và tác động của chúng tới đời sống.'
      document.head.appendChild(meta)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Tin tức công nghệ - TechNova')
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:title')
      meta.content = 'Tin tức công nghệ - TechNova'
      document.head.appendChild(meta)
    }
  }, [])

  const fetchPosts = async () => {
    try {
      const [vietnamRes, worldRes] = await Promise.all([
        fetch('/api/posts/subcategory/cong-nghe-viet-nam'),
        fetch('/api/posts/subcategory/cong-nghe-the-gioi')
      ])

      const [vietnamPosts, worldPosts] = await Promise.all([
        vietnamRes.json(),
        worldRes.json()
      ])

      const allPosts = [...vietnamPosts, ...worldPosts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      setPosts(allPosts)
    } catch (error) {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const tinTucCategory = CATEGORIES.find(cat => cat.id === 'tin-tuc')
  const subcategories = tinTucCategory?.subcategories || []
  

  const tinTucSection = {
    title: "TIN TỨC",
    mainArticle: posts.length > 0 ? {
      title: posts[0].title,
      href: `/tin-tuc/${posts[0].subcategory}/${posts[0].slug}`,
      imageUrl: posts[0].images?.[0]?.image?.path,
      imageAlt: posts[0].images?.[0]?.image?.alt || posts[0].title,
      excerpt: posts[0].excerpt
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: posts.slice(1, 4).map(post => ({
      title: post.title,
      href: `/tin-tuc/${post.subcategory}/${post.slug}`,
      imageUrl: post.images?.[0]?.image?.path,
      imageAlt: post.images?.[0]?.image?.alt || post.title,
      excerpt: post.excerpt
    }))
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState message="Đang tải bài viết..." />
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
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
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ContentSection {...tinTucSection} />
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chuyên mục tin tức</h2>
            {subcategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategories.map((subcategory) => (
                  <a
                    key={subcategory.id}
                    href={`/tin-tuc/${subcategory.slug}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-500"
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {subcategory.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Khám phá tin tức về {subcategory.name.toLowerCase()}
                      </p>
                      <div className="mt-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                          Xem tin tức
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Không có tiểu mục nào</p>
                <p className="text-sm text-gray-400 mt-2">Debug: subcategories.length = {subcategories.length}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
