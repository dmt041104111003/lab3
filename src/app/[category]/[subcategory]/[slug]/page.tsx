'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingState from '@/components/LoadingState'
import TiptapPreview from '@/components/TiptapPreview'

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
  const { category, subcategory, slug } = params

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
        if (data.category === category && data.subcategory === subcategory) {
          setPost(data)
        } else {
          setError('Bài viết không thuộc chuyên mục/tiểu mục này')
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

  const getSubcategoryDisplayName = (subcategory: string) => {
    const displayNames: { [key: string]: string } = {
      'cong-nghe-viet-nam': 'Công nghệ Việt Nam',
      'cong-nghe-the-gioi': 'Công nghệ thế giới',
      'tri-tue-nhan-tao': 'Trí tuệ nhân tạo',
      'du-lieu-lon-iot': 'Dữ liệu lớn & IoT',
      'chuyen-doi-so-doanh-nghiep-giao-duc': 'Chuyển đổi số doanh nghiệp & giáo dục',
      'startup-viet': 'Startup Việt',
      'y-tuong-hay': 'Ý tưởng hay',
      'doanh-nghiep-sang-tao': 'Doanh nghiệp sáng tạo',
      'thiet-bi-moi': 'Thiết bị mới',
      'ung-dung-phan-mem': 'Ứng dụng & phần mềm',
      'danh-gia-san-pham': 'Đánh giá sản phẩm',
      'blockchain': 'Blockchain',
      'cong-nghe-xanh': 'Công nghệ xanh',
      'metaverse': 'Metaverse'
    }
    return displayNames[subcategory] || subcategory
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
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-4">{post.excerpt}</p>
              )}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>Tác giả: {post.author.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
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
            
            {/* Featured Image */}
            {post.images && post.images.length > 0 && (
              <div className="mb-8">
                <img 
                  src={post.images[0].image.path} 
                  alt={post.images[0].image.alt || post.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            
            <TiptapPreview 
              content={post.content}
              className=""
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
