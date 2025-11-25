'use client'

import Image from 'next/image'

export default function HeroWeb3() {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 shadow-sm">
      <div className="relative h-[90vh] min-h-[500px]">
        <Image
          src="/background.png"
          alt="LAB3 Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F4F0] via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-6 lg:px-12 max-w-2xl space-y-4">
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] bg-white/85 text-[#4A2815] rounded-full">
              LAB3
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#4A2815] leading-tight">
              Góc nhìn công nghệ & đời sống dành cho cộng đồng sáng tạo Việt
            </h1>
            <p className="text-gray-700 text-sm lg:text-base">
              Cập nhật đề xuất được cấp vốn, tin tức mới và hoạt động team LAB3 trên cùng một nền tảng.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/proposal/funded"
                className="px-5 py-3 bg-tech-blue text-white rounded-xl text-sm font-semibold hover:bg-tech-dark-blue transition-colors"
              >
                Dự án được cấp vốn
              </a>
              <a
                href="/proposal/submitted"
                className="px-5 py-3 bg-white/90 text-gray-700 rounded-xl text-sm font-semibold border border-gray-200 hover:border-tech-blue hover:text-tech-blue transition-colors"
              >
                Đề xuất đang mở gửi
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

