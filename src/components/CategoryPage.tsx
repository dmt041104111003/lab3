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
  authorName?: string
  _count?: {
    comments: number
  }
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
  imageUrl?: string
}

interface CategoryPageProps {
  title: string
  subcategory: string
  showAllPosts?: boolean
  basePath?: string
}

export default function CategoryPage({ title, subcategory, showAllPosts = true, basePath = 'tin-tuc' }: CategoryPageProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 6

  const fetchPosts = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/subcategory/${subcategory}?page=${page}&limit=${itemsPerPage}`)
      const data = await response.json()
      
      if (data.posts) {
        setPosts(data.posts)
        setTotalPages(data.pagination.totalPages)
        setTotalCount(data.pagination.totalCount)
      } else {
        setPosts(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
        setTotalCount(data.length)
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tải bài viết')
    } finally {
      setLoading(false)
    }
  }, [subcategory, itemsPerPage])

  useEffect(() => {
    fetchPosts(currentPage)
  }, [fetchPosts, currentPage])

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
          
          {showAllPosts && posts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tất cả bài viết {title} ({totalCount} bài)
              </h2>
              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                    <a href={`/${basePath}/${post.subcategory}/${post.slug}`} className="block">
                      <div className="flex">
                        <div className="flex-shrink-0 w-32 aspect-video">
                          {post.images?.[0]?.image?.path ? (
                            <img 
                              src={post.images?.[0]?.image?.path}
                              alt={post.images?.[0]?.image?.alt || post.title}
                              className="w-full h-full object-cover"
                              style={{ aspectRatio: '16/9' }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                              <div className="text-center">
                                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span className="text-gray-500 text-sm">Sắp ra mắt</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-3">
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <span className="capitalize">{post.subcategory}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(post.createdAt).toLocaleString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                            <span className="mx-2">•</span>
                            <span>{post.authorName || 'Tác giả'}</span>
                          </div>
                          <h3 
                            className="text-sm font-bold text-gray-900 mb-1 leading-tight hover:text-red-600 transition-colors"
                            title={post.title}
                          >
                            {post.title}
                          </h3>
                          <p 
                            className="text-gray-600 text-xs leading-relaxed line-clamp-2"
                            title={post.excerpt || "Mô tả ngắn về bài viết..."}
                          >
                            {post.excerpt || "Mô tả ngắn về bài viết..."}
                          </p>
                          <div className="mt-2 flex items-center text-gray-500 text-xs">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{post._count?.comments || 0} bình luận</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              
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
