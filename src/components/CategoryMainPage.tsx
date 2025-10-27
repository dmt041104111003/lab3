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

      const promises = subcategories.map(sub => 
        fetch(`/api/posts/subcategory/${sub.id}?limit=3`).then(res => res.json())
      )

      const allSubcategoryPosts = await Promise.all(promises)

      const counts: Record<string, number> = {}
      const postsBySub: Record<string, Post[]> = {}
      subcategories.forEach((sub, index) => {
        const response = allSubcategoryPosts[index]
        if (response && response.pagination && typeof response.pagination.totalCount === 'number') {
          counts[sub.id] = response.pagination.totalCount
        }
        const list: Post[] = (response?.posts || response || []) as Post[]
        postsBySub[sub.id] = (list || []).slice(0, 2)
      })
      setSubcategoryCounts(counts)
      setSubcategoryPosts(postsBySub)
      const allPosts = allSubcategoryPosts
        .map(response => {
          return response.posts || response
        })
        .flat()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
      setPosts(allPosts)
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {posts.length > 0 && (
              <div className="space-y-3">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <a href={categoryId === 'ban-doc' ? `/ban-doc/${posts[0].slug}` : `/${basePath}/${posts[0].subcategory}/${posts[0].slug}`} className="block">
                    {posts[0].images?.[0]?.image?.path ? (
                      <div className="relative aspect-video overflow-hidden group">
                        <img
                          src={posts[0].images[0].image.path}
                          alt={posts[0].images[0].image.alt || posts[0].title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="text-gray-500 text-lg">Sắp ra mắt</span>
                        </div>
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span className="capitalize">{posts[0].subcategory}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(posts[0].createdAt).toLocaleString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                        <span className="mx-2">•</span>
                        <span>{posts[0].authorName || 'Tác giả'}</span>
                      </div>
                      <h1 className="text-lg font-bold text-gray-900 mb-2 hover:text-red-600 transition-colors">
                        {posts[0].title}
                      </h1>
                      {posts[0].excerpt && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {posts[0].excerpt}
                        </p>
                      )}
                      
                    </div>
                  </a>
                </div>

                {posts.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {posts.slice(1, 3).map((post) => (
                      <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                        <a href={categoryId === 'ban-doc' ? `/ban-doc/${post.slug}` : `/${basePath}/${post.subcategory}/${post.slug}`} className="block">
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
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight hover:text-red-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                              {post.excerpt || "Mô tả ngắn về bài viết..."}
                            </p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          <div className="lg:col-span-1">
            <Sidebar 
              subcategories={subcategories}
              basePath={basePath}
              title={title}
              subcategoryCounts={subcategoryCounts}
              subcategoryPosts={subcategoryPosts}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
