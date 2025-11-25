'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingState from '@/components/LoadingState'
import { useProposalData } from '../useProposalData'

export default function SubmittedPage() {
  const { loading, error, submittedProjects } = useProposalData()

  useEffect(() => {
    document.title = 'Dự án đã đăng - LAB3'
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F4F0]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState message="Đang tải danh sách dự án..." />
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

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       

        <div className="text-center mb-10">
          <p className="text-sm text-gray-600 uppercase tracking-[0.3em]">LAB3 COMMUNITY</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Dự án đã đăng</h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-3xl mx-auto">
            Các đề xuất đang kêu gọi góp ý, tìm kiếm đối tác hoặc chuẩn bị nộp hồ sơ tài trợ.
          </p>
        </div>

        {submittedProjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-600">Chưa có đề xuất nào được đăng.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submittedProjects.map((post) => (
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
        )}
      </main>
      <Footer />
    </div>
  )
}


