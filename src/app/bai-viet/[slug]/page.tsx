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
import SocialMeta from '@/components/SocialMeta'
import { CATEGORIES, getCategoryById } from '@/lib/categories'
import { useViewTracking } from '@/hooks/useViewTracking'

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
  authorName?: string
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
        const transformedData = {
          ...data,
          tags: data.tags?.map((pt: any) => ({
            id: pt.tag.id,
            name: pt.tag.name,
            color: pt.tag.color
          })) || []
        }
        setPost(transformedData)
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

  useViewTracking(slug)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
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
      <SocialMeta
        title={post.title}
        description={post.excerpt}
        image={post.images && post.images.length > 0 ? post.images[0].image.path : undefined}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="article"
        publishedTime={post.createdAt}
        modifiedTime={post.createdAt}
        author={post.author.name}
        section={getCategoryDisplayName(post.category || '')}
        tags={post.tags?.map(tag => tag.name) || []}
      />
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryBreadcrumb 
          category={post.category}
          subcategory={post.subcategory && post.subcategory.trim() !== '' ? post.subcategory : undefined}
        />

        <article className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {post.category && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {getCategoryDisplayName(post.category)}
                  </span>
                )}
                {post.subcategory && post.subcategory.trim() !== '' && (
                  <>
                    <span>•</span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {getSubcategoryDisplayName(post.subcategory)}
                    </span>
                  </>
                )}
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span>•</span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: tag.color || '#3B82F6' }}
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {tag.name}
                      </span>
                    ))}
                  </>
                )}
                <span>•</span>
                <span>{post.authorName || 'Tác giả'}</span>
              </div>
              <span>{formatDate(post.createdAt)}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-relaxed font-merriweather">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-base text-gray-700 leading-relaxed font-bold text-justify mb-6">
                {post.excerpt}
              </p>
            )}
          </div>


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
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: tag.color || '#3B82F6' }}
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="text-right">
              <span className="font-bold text-gray-900">
                Tác giả
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
            description={post.excerpt}
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
