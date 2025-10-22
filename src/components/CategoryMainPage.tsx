'use client'

import { useState, useEffect } from 'react'
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
}

interface CategoryMainPageProps {
  categoryId: string
  title: string
  basePath: string
}

export default function CategoryMainPage({ categoryId, title, basePath }: CategoryMainPageProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [categoryId])

  const fetchPosts = async () => {
    try {
      // Lấy danh sách tiểu mục của category
      const category = CATEGORIES.find(cat => cat.id === categoryId)
      const subcategories = category?.subcategories || []

      // Lấy bài viết từ tất cả tiểu mục
      const promises = subcategories.map(sub => 
        fetch(`/api/posts/subcategory/${sub.id}`).then(res => res.json())
      )

      const allSubcategoryPosts = await Promise.all(promises)

      // Gộp và sắp xếp theo ngày tạo
      const allPosts = allSubcategoryPosts.flat()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5) // Lấy 5 bài mới nhất

      setPosts(allPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Có lỗi xảy ra khi tải bài viết')
    } finally {
      setLoading(false)
    }
  }

  // Lấy danh sách tiểu mục
  const category = CATEGORIES.find(cat => cat.id === categoryId)
  const subcategories = category?.subcategories || []

  const sectionData = {
    title: title.toUpperCase(),
    mainArticle: posts.length > 0 ? {
      title: posts[0].title,
      href: `/${basePath}/${posts[0].subcategory}/${posts[0].slug}`
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: posts.slice(1, 4).map(post => ({
      title: post.title,
      href: `/${basePath}/${post.subcategory}/${post.slug}`
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
          <ContentSection {...sectionData} />
          
          {/* Danh sách tiểu mục */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chuyên mục {title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategories.map((subcategory) => (
                <a
                  key={subcategory.id}
                  href={`/${basePath}/${subcategory.slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 hover:border-tech-blue"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {subcategory.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Khám phá về {subcategory.name.toLowerCase()}
                    </p>
                    <div className="mt-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-tech-blue text-white">
                        Xem bài viết
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
