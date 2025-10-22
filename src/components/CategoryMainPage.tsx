'use client'

import { useState, useEffect } from 'react'
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
      const category = CATEGORIES.find(cat => cat.id === categoryId)
      const subcategories = category?.subcategories || []
      
      if (subcategories.length === 0) {
        setPosts([])
        setLoading(false)
        return
      }

      const promises = subcategories.map(sub => 
        fetch(`/api/posts/subcategory/${sub.id}?limit=3`).then(res => res.json())
      )

      const allSubcategoryPosts = await Promise.all(promises)
      const allPosts = allSubcategoryPosts
        .map(response => {
          return response.posts || response
        })
        .flat()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 7)
      setPosts(allPosts)
    } catch (error) {
      setError('Có lỗi xảy ra khi tải bài viết')
    } finally {
      setLoading(false)
    }
  }

  const category = CATEGORIES.find(cat => cat.id === categoryId)
  const subcategories = category?.subcategories || []

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
              <div className="mb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {posts[0].images?.[0]?.image?.path && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={posts[0].images[0].image.path}
                        alt={posts[0].images[0].image.alt || posts[0].title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="capitalize">{posts[0].subcategory}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(posts[0].createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className="mx-2">•</span>
                      <span>Bởi {posts[0].author.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      <a href={`/${basePath}/${posts[0].subcategory}/${posts[0].slug}`} className="hover:text-blue-600">
                        {posts[0].title}
                      </a>
                    </h1>
                    {posts[0].excerpt && (
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {posts[0].excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {posts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(1, 7).map((post) => (
                  <ArticleCard
                    key={post.id}
                    title={post.title}
                    href={`/${basePath}/${post.subcategory}/${post.slug}`}
                    imageUrl={post.images?.[0]?.image?.path}
                    imageAlt={post.images?.[0]?.image?.alt || post.title}
                    excerpt={post.excerpt}
                    layout="vertical"
                  />
                ))}
              </div>
            )}

            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-gray-500 text-lg">Sắp ra mắt</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>Chuyên mục</span>
                    <span className="mx-2">•</span>
                    <span>Ngày đăng</span>
                    <span className="mx-2">•</span>
                    <span>Tác giả</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Bài viết nổi bật sắp ra mắt
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Nội dung thú vị và hấp dẫn đang được chuẩn bị. Hãy quay lại sau để đọc những bài viết mới nhất!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="text-gray-500 text-xs">Sắp ra mắt</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-gray-800 text-sm font-medium mb-2">Bài viết sắp ra mắt</h4>
                    <p className="text-gray-600 text-xs">Nội dung thú vị đang được chuẩn bị...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Sidebar 
              subcategories={subcategories}
              basePath={basePath}
              title={title}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
