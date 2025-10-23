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
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({})
  const [subcategoryPosts, setSubcategoryPosts] = useState<Record<string, Post[]>>({})

  const fetchPosts = useCallback(async () => {
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
              <div className="space-y-6">
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

                {posts.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.slice(1, 3).map((post) => (
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
