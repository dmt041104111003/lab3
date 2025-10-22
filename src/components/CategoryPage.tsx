'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentSection from '@/components/ContentSection'
import ArticleCard from '@/components/ArticleCard'
import LoadingState from '@/components/LoadingState'
import Pagination from '@/components/Pagination'

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

interface CategoryPageProps {
  title: string
  subcategory: string
  showAllPosts?: boolean
  basePath?: string // Đường dẫn gốc cho category
}

export default function CategoryPage({ title, subcategory, showAllPosts = true, basePath = 'tin-tuc' }: CategoryPageProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/subcategory/${subcategory}`)
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Có lỗi xảy ra khi tải bài viết')
    } finally {
      setLoading(false)
    }
  }, [subcategory])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Pagination logic
  const totalPages = Math.ceil(posts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPosts = posts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sectionData = {
    title: title.toUpperCase(),
    mainArticle: posts.length > 0 ? {
      title: posts[0].title,
      href: `/${basePath}/${posts[0].subcategory}/${posts[0].slug}`,
      imageUrl: posts[0].images?.[0]?.image?.path,
      imageAlt: posts[0].images?.[0]?.image?.alt || posts[0].title,
      excerpt: posts[0].excerpt
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: posts.slice(1, 4).map(post => ({
      title: post.title,
      href: `/${basePath}/${post.subcategory}/${post.slug}`,
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
          <ContentSection {...sectionData} />
          
          {/* Danh sách tất cả bài viết */}
          {showAllPosts && posts.length > 4 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tất cả bài viết {title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post) => (
                  <ArticleCard
                    key={post.id}
                    title={post.title}
                    href={`/${basePath}/${post.subcategory}/${post.slug}`}
                    imageUrl={post.images?.[0]?.image?.path}
                    imageAlt={post.images?.[0]?.image?.alt || post.title}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
