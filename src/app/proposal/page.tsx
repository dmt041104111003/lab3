'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingState from '@/components/LoadingState'

interface Post {
  id: string
  title: string
  excerpt: string
  slug: string
  createdAt: string
  authorName?: string
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
  }>
}

export default function ProposalPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProposalPosts()
    document.title = 'Proposal - LAB3'
  }, [])

  const fetchProposalPosts = async () => {
    try {
      const response = await fetch('/api/posts/category/proposal')
      if (!response.ok) {
        setError('Không thể tải bài viết proposal')
        return
      }
      const data = await response.json()
      const list = Array.isArray(data) ? data : Array.isArray(data?.posts) ? data.posts : []
      setPosts(list)
    } catch (err) {
      setError('Không thể tải bài viết proposal')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F4F0]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState message="Đang tải đề xuất..." />
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F4F0]">
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

  const containsFundingKeyword = (value?: string) => {
    if (!value) return false
    const keywords = ['được cấp vốn', 'funded', 'grant', 'tài trợ', 'cấp vốn']
    const lower = value.toLowerCase()
    return keywords.some((keyword) => lower.includes(keyword))
  }

  const isFundedProject = (post: Post) => {
    if (post.tags && post.tags.some((tag) => containsFundingKeyword(tag.name))) {
      return true
    }
    return containsFundingKeyword(post.title) || containsFundingKeyword(post.excerpt)
  }

  const fundedProjects = posts.filter(isFundedProject)
  const submittedProjects = posts.filter((post) => !isFundedProject(post))
  const featuredPost = posts[0] || null
  const fundedList = fundedProjects.filter((post) => post.id !== featuredPost?.id)
  const submittedList = submittedProjects.filter((post) => post.id !== featuredPost?.id)

  const renderCard = (post: Post) => (
    <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
      <a href={`/bai-viet/${post.slug}`} className="block">
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
          <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-tight line-clamp-2 hover:text-red-600 transition-colors" title={post.title}>
            {post.title}
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2" title={post.excerpt || 'Đề xuất'}>
            {post.excerpt || 'Đề xuất'}
          </p>
        </div>
      </a>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-600 uppercase tracking-widest">LAB3</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">Proposal</h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
            Kênh tổng hợp các đề xuất, tài trợ và cơ hội hợp tác dành cho cộng đồng công nghệ.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Chưa có đề xuất nào được đăng.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {featuredPost && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b-4 border-red-600 mb-6 rounded-lg overflow-hidden">
                <div className="relative aspect-video">
                  <a href={`/bai-viet/${featuredPost.slug}`} className="block w-full h-full">
                    {featuredPost.images?.[0]?.image?.path ? (
                      <img
                        src={featuredPost.images[0].image.path}
                        alt={featuredPost.images[0].image.alt || featuredPost.title}
                        className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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
                <div className="bg-white p-5 flex flex-col justify-center">
                  <a href={`/bai-viet/${featuredPost.slug}`} className="block">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-red-600 transition-colors line-clamp-2" title={featuredPost.title}>
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2 line-clamp-3" title={featuredPost.excerpt || 'Đề xuất nổi bật'}>
                      {featuredPost.excerpt || 'Đề xuất nổi bật'}
                    </p>
                    <div className="text-xs text-gray-500">
                      <span>{featuredPost.authorName || 'LAB3'}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(featuredPost.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {fundedList.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">LAB3 FUND</p>
                    <h2 className="text-xl font-bold text-gray-900">Dự án được cấp vốn</h2>
                    <p className="text-sm text-gray-600">Những đề xuất đã nhận hỗ trợ tài chính từ LAB3 hoặc đối tác.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {fundedList.map(renderCard)}
                </div>
              </section>
            )}

            {submittedList.length > 0 && (
              <section className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">LAB3 COMMUNITY</p>
                  <h2 className="text-xl font-bold text-gray-900">Dự án đã đăng</h2>
                  <p className="text-sm text-gray-600">Các đề xuất đang kêu gọi góp ý, tìm kiếm đối tác hoặc chuẩn bị nộp quỹ.</p>
                </div>
                <div className="space-y-4">
                  {submittedList.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col md:flex-row gap-4">
                      {post.images?.[0]?.image?.path && (
                        <div className="flex-shrink-0 w-full md:w-48 h-32 overflow-hidden rounded-lg">
                          <img src={post.images[0].image.path} alt={post.images[0].image.alt || post.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <span>{new Date(post.createdAt).toLocaleString('vi-VN')}</span>
                          <span className="mx-2">•</span>
                          <span>{post.authorName || 'LAB3'}</span>
                        </div>
                        <a href={`/bai-viet/${post.slug}`} className="block">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-red-600 transition-colors line-clamp-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt || 'Đề xuất đang chờ phản hồi.'}</p>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

