'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import LoadingState from '@/components/LoadingState'
import Sidebar from '@/components/Sidebar'
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
  authorName?: string
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
  tags?: Array<{
    id: string
    name: string
    color?: string
  }>
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
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({})
  const [subcategoryPosts, setSubcategoryPosts] = useState<Record<string, Post[]>>({})

  const fetchPosts = useCallback(async () => {
    try {
      const category = CATEGORIES.find(cat => cat.id === categoryId)
      const subcategories = category?.subcategories || []
      
      if (subcategories.length === 0) {
        if (categoryId === 'ban-doc') {
          const response = await fetch(`/api/posts/category/${categoryId}`)
          const data = await response.json()
          
          if (response.ok) {
            setPosts(data)
          } else {
            setError(data.error || 'Không thể tải bài viết')
          }
        } else {
          setPosts([])
        }
        setLoading(false)
        return
      }

      const allSubcategoryPosts = await Promise.all(
        subcategories.map(async (sub) => {
          const firstResponse = await fetch(`/api/posts/subcategory/${sub.id}?limit=1`)
          const firstData = await firstResponse.json()
          const totalCount = firstData?.pagination?.totalCount || 0
          if (totalCount > 0) {
            const response = await fetch(`/api/posts/subcategory/${sub.id}?limit=${totalCount}`)
            return response.json()
          }
          return firstData
        })
      )

      const counts: Record<string, number> = {}
      const postsBySub: Record<string, Post[]> = {}
      subcategories.forEach((sub, index) => {
        const response = allSubcategoryPosts[index]
        if (response && response.pagination && typeof response.pagination.totalCount === 'number') {
          counts[sub.id] = response.pagination.totalCount
        }
        const list: Post[] = (response?.posts || response || []) as Post[]
        postsBySub[sub.id] = list || []
      })
      setSubcategoryCounts(counts)
      setSubcategoryPosts(postsBySub)
      const allPosts = allSubcategoryPosts
        .map(response => {
          return response.posts || response
        })
        .flat()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      const finalPosts = categoryId === 'ban-doc' ? allPosts : allPosts.slice(0, 6)
      setPosts(finalPosts)
    } catch (error) {
      setError('Có lỗi xảy ra khi tải bài viết')
    } finally {
      setLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    fetchPosts()
  }, [categoryId, fetchPosts])

  const category = CATEGORIES.find(cat => cat.id === categoryId)
  const subcategories = category?.subcategories || []

  const sectionData = {
    title: title.toUpperCase(),
    mainArticle: posts.length > 0 ? {
      title: posts[0].title,
      href: categoryId === 'ban-doc' ? `/ban-doc/${posts[0].slug}` : `/${basePath}/${posts[0].subcategory}/${posts[0].slug}`,
      imageUrl: posts[0].images?.[0]?.image?.path,
      imageAlt: posts[0].images?.[0]?.image?.alt || posts[0].title,
      excerpt: posts[0].excerpt
    } : {
      title: "Chưa có bài viết nào",
      href: "#"
    },
    subArticles: []
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
        <div className={categoryId === 'ban-doc' ? "grid grid-cols-1" : "grid grid-cols-1 lg:grid-cols-4 gap-8"}>
          <div className={categoryId === 'ban-doc' ? "w-full" : "lg:col-span-3"}>
            {posts.length > 0 && (
              <div className={categoryId === 'ban-doc' ? "grid grid-cols-1 gap-4 items-stretch" : "space-y-3"}>
                {categoryId === 'ban-doc' ? (
                  posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                      <a href={`/ban-doc/${post.slug}`} className="block md:flex h-full">
                        {post.images?.[0]?.image?.path ? (
                          <div className="flex-shrink-0 w-full md:w-72 h-40 md:h-48 overflow-hidden group">
                            <img
                              src={post.images[0].image.path}
                              alt={post.images[0].image.alt || post.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-full md:w-72 h-40 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <span className="text-gray-500 text-sm">Sắp ra mắt</span>
                            </div>
                          </div>
                        )}
                        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
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
                              className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3 leading-tight hover:text-red-600 transition-colors line-clamp-2"
                              title={post.title}
                            >
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p 
                                className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-3"
                                title={post.excerpt}
                              >
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b-4 border-red-600 mb-6 rounded-lg overflow-hidden">
                      {/* Ảnh full bên trái */}
                      <div className="relative aspect-video">
                        <a href={`/${basePath}/${posts[0].subcategory}/${posts[0].slug}`} className="block w-full h-full">
                          {posts[0].images?.[0]?.image?.path ? (
                            <img 
                              src={posts[0].images[0].image.path} 
                              alt={posts[0].images[0].image.alt || posts[0].title}
                              className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                              <div className="text-center">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span className="text-gray-500 text-lg">Sắp ra mắt</span>
                              </div>
                            </div>
                          )}
                        </a>
                      </div>
                      
                      {/* Nội dung bên phải */}
                      <div className="bg-white p-4 md:p-6 flex flex-col justify-center">
                        <a href={`/${basePath}/${posts[0].subcategory}/${posts[0].slug}`} className="block">
                          <h1 
                            className="text-lg md:text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-red-600 transition-colors line-clamp-2"
                            title={posts[0].title}
                          >
                            {posts[0].title.length > 80 ? 
                              posts[0].title.substring(0, 80) + '...' : 
                              posts[0].title
                            }
                          </h1>
                          <p 
                            className="text-gray-600 text-sm leading-relaxed mb-2 line-clamp-2"
                            title={posts[0].excerpt || "Mô tả ngắn về bài viết chính trong chuyên mục này..."}
                          >
                            {posts[0].excerpt ? 
                              (posts[0].excerpt.length > 150 ? 
                                posts[0].excerpt.substring(0, 150) + '...' : 
                                posts[0].excerpt
                              ) : 
                              "Mô tả ngắn về bài viết chính trong chuyên mục này..."
                            }
                          </p>
                        </a>
                      </div>
                    </div>

                    {posts.length > 1 && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                          {posts.slice(1, 4).map((post) => (
                            <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                              <a href={`/${basePath}/${post.subcategory}/${post.slug}`} className="block">
                                {post.images?.[0]?.image?.path ? (
                                  <div className="relative aspect-video overflow-hidden group">
                                    <img 
                                      src={post.images[0].image.path} 
                                      alt={post.images[0].image.alt || post.title}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                  </div>
                                ) : (
                                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <div className="text-center">
                                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                      </svg>
                                      <span className="text-gray-500 text-sm">Sắp ra mắt</span>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="p-3">
                                  <h3 
                                    className="text-sm font-semibold text-gray-900 mb-1 leading-tight line-clamp-2 hover:text-red-600 transition-colors"
                                    title={post.title}
                                  >
                                    {post.title}
                                  </h3>
                                  <p 
                                    className="text-gray-600 text-xs leading-relaxed line-clamp-2"
                                    title={post.excerpt || "Mô tả ngắn..."}
                                  >
                                    {post.excerpt || "Mô tả ngắn..."}
                                  </p>
                                </div>
                              </a>
                            </div>
                          ))}
                        </div>

                        {posts.length > 4 && (
                          <div className="grid grid-cols-1 gap-4 mt-6">
                            {posts.slice(4, 6).map((post) => (
                              <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                                <a href={`/${basePath}/${post.subcategory}/${post.slug}`} className="block md:flex h-full">
                                  {post.images?.[0]?.image?.path ? (
                                    <div className="flex-shrink-0 w-full md:w-64 h-36 md:h-40 overflow-hidden group">
                                      <img
                                        src={post.images[0].image.path}
                                        alt={post.images[0].image.alt || post.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex-shrink-0 w-full md:w-64 h-36 md:h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                      <div className="text-center">
                                        <svg className="w-10 h-10 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <span className="text-gray-500 text-xs">Sắp ra mắt</span>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center text-xs md:text-sm text-gray-500 mb-2">
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
                                        className="text-sm md:text-base font-bold text-gray-900 mb-2 leading-tight hover:text-red-600 transition-colors line-clamp-2"
                                        title={post.title}
                                      >
                                        {post.title}
                                      </h3>
                                      {post.excerpt && (
                                        <p 
                                          className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2"
                                          title={post.excerpt}
                                        >
                                          {post.excerpt}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}

          </div>

          {categoryId !== 'ban-doc' && (
            <div className="lg:col-span-1">
              <Sidebar 
                subcategories={subcategories}
                basePath={basePath}
                title={title}
                subcategoryCounts={subcategoryCounts}
                subcategoryPosts={subcategoryPosts}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
