'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo và Slogan */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex flex-col items-center">
              <Image
                src="/logo.png"
                alt="TechNova Logo"
                width={120}
                height={60}
                className="mb-1"
              />
              <div className="tech-slogan text-black">
                CÔNG NGHỆ & ĐỜI SỐNG
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/tin-tuc" className="text-gray-700 hover:text-tech-blue transition-colors">
              Tin tức
            </Link>
            <Link href="/ai-chuyen-doi-so" className="text-gray-700 hover:text-tech-blue transition-colors">
              AI – Chuyển đổi số
            </Link>
            <Link href="/doi-moi-sang-tao" className="text-gray-700 hover:text-tech-blue transition-colors">
              Đổi mới sáng tạo
            </Link>
            <Link href="/san-pham-review" className="text-gray-700 hover:text-tech-blue transition-colors">
              Sản phẩm & Review
            </Link>
            <Link href="/xu-huong-tuong-lai" className="text-gray-700 hover:text-tech-blue transition-colors">
              Xu hướng tương lai
            </Link>
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-tech-blue transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-gray-700 hover:text-tech-blue transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
