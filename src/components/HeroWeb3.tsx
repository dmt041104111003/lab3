'use client'

import Image from 'next/image'

export default function HeroWeb3() {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 shadow-sm">
      <div className="relative h-[70vh] min-h-[420px] md:h-[90vh] md:min-h-[500px]">
        <Image
          src="/background.png"
          alt="LAB3 Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F4F0]/90 via-[#F5F4F0]/40 to-transparent md:bg-gradient-to-r md:from-[#F5F4F0] md:via-transparent md:to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center md:justify-start">
          <div className="w-full px-4 sm:px-8 lg:px-12">
            <div className="max-w-3xl space-y-4 bg-white/75 md:bg-transparent backdrop-blur md:backdrop-blur-0 rounded-2xl md:rounded-none p-6 md:p-0 text-center md:text-left">
              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] bg-white text-[#4A2815] rounded-full mx-auto md:mx-0">
                LAB3
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4A2815] leading-tight">
                Góc nhìn công nghệ & đời sống dành cho cộng đồng sáng tạo Việt
              </h1>
              <p className="text-gray-700 text-sm sm:text-base">
                Cập nhật đề xuất được cấp vốn, tin tức mới và hoạt động team LAB3 trên cùng một nền tảng.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href="/proposal/funded"
                  className="px-5 py-3 bg-tech-blue text-white rounded-xl text-sm font-semibold text-center hover:bg-tech-dark-blue transition-colors"
                >
                  Dự án được cấp vốn
                </a>
                <a
                  href="/proposal/submitted"
                  className="px-5 py-3 bg-white text-gray-700 rounded-xl text-sm font-semibold border border-gray-200 hover:border-tech-blue hover:text-tech-blue transition-colors text-center"
                >
                  Đề xuất đang mở gửi
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

