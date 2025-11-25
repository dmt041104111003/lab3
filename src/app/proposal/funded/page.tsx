'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingState from '@/components/LoadingState'
import { useProposalData } from '../useProposalData'

export default function FundedPage() {
  const { loading, error, fundedProjects } = useProposalData()

  useEffect(() => {
    document.title = 'Dự án được cấp vốn - LAB3'
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
          <p className="text-sm text-gray-600 uppercase tracking-[0.3em]">LAB3 FUND</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Dự án được cấp vốn</h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-3xl mx-auto">
            Các proposal đã nhận được tài trợ từ LAB3 hoặc đối tác, tập trung vào giải pháp công nghệ cho cộng đồng.
          </p>
        </div>

        {fundedProjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-600">Chưa có dự án nào được cấp vốn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fundedProjects.map((post) => (
              <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
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

                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">LAB3 FUND</p>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-red-600 transition-colors" title={post.title}>
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.excerpt || 'Đề xuất được cấp vốn bởi LAB3.'}</p>
                    <div className="text-xs text-gray-500 flex items-center space-x-2">
                      <span>{post.authorName || 'LAB3'}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}


