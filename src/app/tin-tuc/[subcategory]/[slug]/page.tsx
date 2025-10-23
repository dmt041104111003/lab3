'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingState from '@/components/LoadingState'
import TiptapPreview from '@/components/TiptapPreview'
import CommentSection from '@/components/CommentSection'
import ShareButtons from '@/components/ShareButtons'

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

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  useEffect(() => {
    if (post) {
      const newTitle = `${post.title} - TechNova`
      document.title = newTitle
    } else if (!loading) {
      document.title = 'Đang tải bài viết... - TechNova'
    }
  }, [post, loading])

  const fetchPost = async () => {
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
        setError('Không tìm thấy bài viết')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tải bài viết')
    } finally {
      setLoading(false)
    }
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
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Trang chủ
          </Link>
        </nav>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-4">{post.excerpt}</p>
              )}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                {post.subcategory && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {post.subcategory === 'cong-nghe-viet-nam' ? 'Công nghệ Việt Nam' : 
                       post.subcategory === 'cong-nghe-the-gioi' ? 'Công nghệ thế giới' : 
                       post.subcategory}
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
            
            {/* Featured Image */}
            {post.images && post.images.length > 0 && (
              <div className="mb-8">
                <img 
                  src={post.images[0].image.path} 
                  alt={post.images[0].image.alt || post.title}
                  className="w-full max-w-full h-auto border-radius rounded-lg mx-auto block shadow-md"
                />
              </div>
            )}
            
            <TiptapPreview 
              content={post.content}
              className=""
            />
          </div>

          {/* Author */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="text-right">
              <span className="font-bold text-gray-900">
                Tác giả: {post.author.name}
              </span>
            </div>
          </div>
        </article>

        {/* Share Buttons */}
        <div className="mt-6 flex justify-end">
          <ShareButtons 
            url={typeof window !== 'undefined' ? window.location.href : ''} 
            title={post.title}
          />
        </div>

        {/* Comment Section */}
        <div className="mt-8">
          <CommentSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
