'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'

const subcategories = [
  { id: 'member', name: 'Thành viên', slug: 'member', parentId: 'team' },
  { id: 'achievements', name: 'Thành tích', slug: 'achievements', parentId: 'team' },
]

export default function TeamPage() {
  const pathname = usePathname()

  useEffect(() => {
    document.title = 'Team - LAB3'
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-600 uppercase tracking-widest">LAB3</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">Team</h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
            Nhóm phát triển LAB3 – tập trung nghiên cứu công nghệ blockchain và xây dựng các giải pháp DApp cho giáo dục số.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Sidebar
              subcategories={subcategories}
              basePath="team"
              title="Team"
              subcategoryCounts={{}}
              subcategoryPosts={{}}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative w-full h-64 sm:h-80">
                <Image
                  src="/lab3.png"
                  alt="LAB3 Team"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 75vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/80">LAB3</p>
                  <h2 className="text-2xl font-bold mt-2">Hành trình sáng tạo</h2>
                  <p className="text-sm text-white/80 max-w-xl">
                    Những dự án cộng đồng và nỗ lực nghiên cứu của team LAB3.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/team/member"
                  className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:border-tech-blue hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">LAB3 TEAM</p>
                    <h3 className="text-lg font-semibold text-gray-900">Thành viên</h3>
                    <p className="text-sm text-gray-600">Gặp gỡ đội ngũ nòng cốt của LAB3.</p>
                  </div>
                  <span className="text-tech-blue text-xl">→</span>
                </Link>

                <Link
                  href="/team/achievements"
                  className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:border-tech-blue hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">LAB3 JOURNEY</p>
                    <h3 className="text-lg font-semibold text-gray-900">Thành tích</h3>
                    <p className="text-sm text-gray-600">Các cột mốc và giải thưởng của team.</p>
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
