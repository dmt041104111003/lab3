'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingState from '@/components/LoadingState'
import { TipTapPreview } from '@/components/tiptap-preview'
import CommentSection from '@/components/CommentSection'
import ShareButtons from '@/components/ShareButtons'
import RelatedPosts from '@/components/RelatedPosts'
import CategoryBreadcrumb from '@/components/CategoryBreadcrumb'
import { CATEGORIES, getCategoryById } from '@/lib/categories'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  published: boolean
  createdAt: string
  updatedAt: string
  category: string
  subcategory: string
  author: {
    id: string
    name: string
    email: string
  }
  tags: {
    id: string
    name: string
    color: string
  }[]
  imageUrl?: string
  images?: Array<{
    image: {
      id: string
      path: string
      alt?: string
    }
  }>
}

export default function PostDetail() {
  const params = useParams()
  const slug = params.slug as string
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/slug/${slug}`)
      const data = await response.json()
      
      if (response.ok) {
        setPost(data)
      } else {
        setError(data.error || 'Không tìm thấy bài viết')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tải bài viết')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug, fetchPost])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryDisplayName = (categoryId: string) => {
    const category = getCategoryById(categoryId)
    return category?.name || categoryId
  }

  const getSubcategoryDisplayName = (subcategory: string) => {
    const categoryData = CATEGORIES.find(cat => 
      cat.subcategories.some(sub => sub.id === subcategory)
    )
    
    if (categoryData) {
      const subcategoryData = categoryData.subcategories.find(sub => sub.id === subcategory)
      return subcategoryData?.name || subcategory
    }
    
    return subcategory
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState message="Đang tải bài viết..." />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
            <p className="text-gray-600 mb-6">{error || 'Bài viết không tồn tại'}</p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900"
            >
              Về trang chủ
            </a>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryBreadcrumb 
          category={post.category}
          subcategory={post.subcategory}
        />

        <article className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>{formatDate(post.createdAt)}</span>
              {post.category && (
                <>
                  <span>•</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {getCategoryDisplayName(post.category)}
                  </span>
                </>
              )}
              {post.subcategory && (
                <>
                  <span>•</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                    {getSubcategoryDisplayName(post.subcategory)}
                  </span>
                </>
              )}
              <span>•</span>
              <span>Bởi {post.author.name}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          {post.images && post.images.length > 0 ? (
            <div className="px-6 py-4">
              <img
                src={post.images[0].image.path}
                alt={post.images[0].image.alt || post.title}
                className="w-full max-w-full h-auto border-radius rounded-lg mx-auto block shadow-md"
              />
            </div>
          ) : post.imageUrl ? (
            <div className="px-6 py-4">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full max-w-full h-auto border-radius rounded-lg mx-auto block shadow-md"
              />
            </div>
          ) : null}

          <div className="px-6 py-8">
            <TipTapPreview 
              content={post.content}
              className=""
            />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="text-right">
              <span className="font-bold text-gray-900">
                {post.author.name}
              </span>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-end text-sm text-gray-500">
              <div>
                <span>Cập nhật lần cuối: {formatDate(post.updatedAt)}</span>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-6 flex justify-end">
          <ShareButtons 
            url={typeof window !== 'undefined' ? window.location.href : ''} 
            title={post.title}
          />
        </div>

        <div className="mt-8">
          <CommentSection />
        </div>

        <div className="mt-8">
          <RelatedPosts currentPostSlug={post.slug} />
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
