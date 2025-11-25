'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import { type Subcategory } from '@/lib/categories'

const subcategories: Subcategory[] = [
  { id: 'funded', name: 'Dự án được cấp vốn', slug: 'funded', parentId: 'proposal' },
  { id: 'submitted', name: 'Dự án đã đăng', slug: 'submitted', parentId: 'proposal' },
]

export default function ProposalPage() {
  useEffect(() => {
    document.title = 'Proposal - LAB3'
  }, [])

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Sidebar subcategories={subcategories} basePath="proposal" title="Proposal" subcategoryCounts={{}} subcategoryPosts={{}} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative w-full h-64 sm:h-80">
                <Image
                  src="/lab3.png"
                  alt="LAB3 Proposal"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 75vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/80">LAB3 PROPOSAL</p>
                  <h2 className="text-2xl font-bold mt-2">Nền tảng đề xuất & tài trợ cộng đồng</h2>
                  <p className="text-sm text-white/80 mt-2">
                    Nơi tổng hợp các dự án đã được cấp vốn và những ý tưởng đang kêu gọi hợp tác từ cộng đồng công nghệ.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/proposal/funded"
                  className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:border-tech-blue hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">LAB3 FUND</p>
                    <h3 className="text-lg font-semibold text-gray-900">Dự án được cấp vốn</h3>
                    <p className="text-sm text-gray-600">Danh sách proposal đã nhận hỗ trợ tài chính.</p>
                  </div>
                  <span className="text-tech-blue text-xl">→</span>
                </Link>

                <Link
                  href="/proposal/submitted"
                  className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:border-tech-blue hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">LAB3 COMMUNITY</p>
                    <h3 className="text-lg font-semibold text-gray-900">Dự án đã đăng</h3>
                    <p className="text-sm text-gray-600">Các đề xuất đang kêu gọi góp ý hoặc tìm đối tác.</p>
                  </div>
                  <span className="text-tech-blue text-xl">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

