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
  category?: string
  subcategory?: string
  author: {
    name: string
    email: string
  }
  tags?: Array<{ id: string; name: string; color: string }>
  images?: Array<{
    image: {
      id: string
      path: string
      alt?: string
    }
  }>
}

export default function PostDetailPage() {
  const params = useParams()
  const { subcategory, slug } = params

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/slug/${slug}`)
      const data = await response.json()
      
      if (response.ok) {
        if (data.subcategory === subcategory) {
          setPost(data)
        } else {
          setError('Bài viết không thuộc tiểu mục này')
        }
      } else {
        setError(data.error || 'Không tìm thấy bài viết')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tải bài viết')
    } finally {
      setLoading(false)
    }
  }, [slug, subcategory])

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug, fetchPost])

  useEffect(() => {
    if (post) {
      const newTitle = `${post.title} - TechNova`
      document.title = newTitle
    } else if (!loading) {
      document.title = 'Đang tải bài viết... - TechNova'
    }
  }, [post, loading])

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
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error || 'Không tìm thấy bài viết'}</div>
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
          category="tin-tuc"
          subcategory={subcategory as string}
        />

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-4">{post.excerpt}</p>
              )}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                {post.category && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {getCategoryDisplayName(post.category)}
                    </span>
                  </>
                )}
                {post.subcategory && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {getSubcategoryDisplayName(post.subcategory)}
                    </span>
                  </>
                )}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </header>
            
            {post.images && post.images.length > 0 && (
              <div className="mb-8">
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <img 
                    src={post.images[0].image.path} 
                    alt={post.images[0].image.alt || post.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
            
            <TipTapPreview 
              content={post.content}
              className=""
            />
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="text-right">
              <span className="font-bold text-gray-900">
                {post.author.name}
              </span>
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
