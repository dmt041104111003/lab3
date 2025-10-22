'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSession, isAdmin, clearSession } from '@/lib/session'
import LoadingState from '@/components/LoadingState'
import AdminLoadingState from '@/components/admin/AdminLoadingState'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const session = getSession()
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (!isAdmin()) {
      setIsLoading(false)
      return
    }

    setUser(session)
    setIsLoading(false)

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user_session') {
        const s = getSession()
        setUser(s)
      }
    }
    const handleSessionUpdate = () => {
      const s = getSession()
      setUser(s)
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('session:update', handleSessionUpdate as EventListener)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('session:update', handleSessionUpdate as EventListener)
    }
  }, [router])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminLoadingState message="Đang kiểm tra quyền truy cập..." />
      </div>
    )
  }

  const handleSignOut = () => {
    clearSession()
    document.cookie = 'user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/')
  }

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(path)
  }

  const getLinkClasses = (path: string) => {
    const baseClasses = "flex items-center px-3 py-2 text-sm font-medium rounded-md"
    const activeClasses = "bg-tech-blue text-white"
    const inactiveClasses = "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState message="Đang kiểm tra quyền truy cập..." />
      </div>
    )
  }

  // Show access denied for non-admin users
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
          <p className="text-gray-600 mb-6">Bạn cần quyền admin để truy cập trang này</p>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header - Desktop */}
      <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="flex h-12">
          <div className="w-64 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="TechNova Logo"
              width={150}
              height={150}
              className="rounded-lg"
            />
          </div>
          <div className="flex-1 flex items-center justify-end px-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Xin chào, <span className="font-medium">{user?.name}</span>
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 hover:text-tech-blue hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            <span className="sr-only">Menu</span>
            <div className="w-6 h-6 flex flex-col items-center justify-center space-y-1">
              <span className={`block h-0.5 w-6 bg-current transition-transform duration-200 ${isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-transform duration-200 ${isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
            </div>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Xin chào, <span className="font-medium">{user?.name}</span>
            </span>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-6">
            <div className="px-4 space-y-1">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 mb-4 border-b border-gray-200 pb-4"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Về trang chủ
              </Link>
              
              <Link
                href="/admin"
                className={getLinkClasses('/admin')}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </Link>
              
              <Link
                href="/admin/posts"
                className={getLinkClasses('/admin/posts')}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Quản lý bài viết
              </Link>

              <Link
                href="/admin/users"
                className={getLinkClasses('/admin/users')}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Quản lý người dùng
              </Link>

              <Link
                href="/admin/tags"
                className={getLinkClasses('/admin/tags')}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Quản lý thẻ
              </Link>

              <Link
                href="/admin/images"
                className={getLinkClasses('/admin/images')}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Quản lý hình ảnh
              </Link>

            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white text-white"
                  aria-label="Close mobile menu"
                >
                  <div className="w-6 h-6 flex flex-col items-center justify-center space-y-1">
                    <span className={`block h-0.5 w-6 bg-current transition-transform duration-200 ${true ? 'translate-y-1.5 rotate-45' : ''}`}></span>
                    <span className={`block h-0.5 w-6 bg-current transition-opacity duration-200 ${true ? 'opacity-0' : 'opacity-100'}`}></span>
                    <span className={`block h-0.5 w-6 bg-current transition-transform duration-200 ${true ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
                  </div>
                </button>
              </div>
              <div className="flex-1 flex flex-col h-full">
                <div className="flex-shrink-0 flex items-center justify-center px-4 py-6">
                  <Image
                    src="/logo.png"
                    alt="TechNova Logo"
                    width={120}
                    height={120}
                    className="rounded-lg"
                  />
                </div>
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                  <Link
                    href="/"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 mb-4 border-b border-gray-200 pb-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Về trang chủ
                  </Link>
                  
                  <Link
                    href="/admin"
                    className={getLinkClasses('/admin')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  
                  <Link
                    href="/admin/posts"
                    className={getLinkClasses('/admin/posts')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Quản lý bài viết
                  </Link>

                  <Link
                    href="/admin/users"
                    className={getLinkClasses('/admin/users')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Quản lý người dùng
                  </Link>

                  <Link
                    href="/admin/tags"
                    className={getLinkClasses('/admin/tags')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Quản lý thẻ
                  </Link>

                  <Link
                    href="/admin/images"
                    className={getLinkClasses('/admin/images')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Quản lý hình ảnh
                  </Link>

                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
