'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getSession, clearSession, isAdmin, type User } from '@/lib/session'

export default function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const session = getSession()
    if (session) {
      setUser(session)
      setIsLoggedIn(true)
    }
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const handleSignOut = () => {
    clearSession()
    document.cookie = 'user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setUser(null)
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const getNavLinkClasses = (path: string) => {
    const baseClasses = "transition-colors"
    const activeClasses = "text-tech-blue font-semibold"
    const inactiveClasses = "text-gray-700 hover:text-tech-blue"
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`
  }

  const getMobileNavLinkClasses = (path: string) => {
    const baseClasses = "block px-3 py-2 text-base font-medium rounded-md transition-colors"
    const activeClasses = "text-tech-blue bg-tech-blue/10 font-semibold"
    const inactiveClasses = "text-gray-700 hover:text-tech-blue hover:bg-gray-100"
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-tech-blue hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/tin-tuc" className={getNavLinkClasses('/tin-tuc')}>
              Tin tức
            </Link>
            <Link href="/ai-chuyen-doi-so" className={getNavLinkClasses('/ai-chuyen-doi-so')}>
              AI – Chuyển đổi số
            </Link>
            <Link href="/doi-moi-sang-tao" className={getNavLinkClasses('/doi-moi-sang-tao')}>
              Đổi mới sáng tạo
            </Link>
            <Link href="/san-pham-review" className={getNavLinkClasses('/san-pham-review')}>
              Sản phẩm & Review
            </Link>
            <Link href="/xu-huong-tuong-lai" className={getNavLinkClasses('/xu-huong-tuong-lai')}>
              Xu hướng tương lai
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700 font-medium">
                  Xin chào, {user?.name}
                </span>
  
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-tech-blue transition-colors font-medium"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-tech-dark-blue transition-colors font-medium"
                >
                  Đăng nhập
                </Link>

              </>
            )}
            {/* <button className="text-gray-700 hover:text-tech-blue transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-gray-700 hover:text-tech-blue transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button> */}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link
                href="/tin-tuc"
                className={getMobileNavLinkClasses('/tin-tuc')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tin tức
              </Link>
              <Link
                href="/ai-chuyen-doi-so"
                className={getMobileNavLinkClasses('/ai-chuyen-doi-so')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                AI – Chuyển đổi số
              </Link>
              <Link
                href="/doi-moi-sang-tao"
                className={getMobileNavLinkClasses('/doi-moi-sang-tao')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đổi mới sáng tạo
              </Link>
              <Link
                href="/san-pham-review"
                className={getMobileNavLinkClasses('/san-pham-review')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sản phẩm & Review
              </Link>
              <Link
                href="/xu-huong-tuong-lai"
                className={getMobileNavLinkClasses('/xu-huong-tuong-lai')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Xu hướng tương lai
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
