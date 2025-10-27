'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getSession, setSession, clearSession, isAdmin, type User } from '@/lib/session'

export default function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const megaMenuCategories = [
    {
      title: 'TIN TỨC',
      baseHref: '/tin-tuc',
      subcategories: [
        { name: 'Công nghệ Việt Nam', href: '/tin-tuc/cong-nghe-viet-nam' },
        { name: 'Công nghệ thế giới', href: '/tin-tuc/cong-nghe-the-gioi' }
      ]
    },
    {
      title: 'AI - CHUYỂN ĐỔI SỐ',
      baseHref: '/ai-chuyen-doi-so',
      subcategories: [
        { name: 'Trí tuệ nhân tạo', href: '/ai-chuyen-doi-so/tri-tue-nhan-tao' },
        { name: 'Dữ liệu lớn & IoT', href: '/ai-chuyen-doi-so/du-lieu-lon-iot' },
        { name: 'Chuyển đổi số doanh nghiệp', href: '/ai-chuyen-doi-so/chuyen-doi-so-doanh-nghiep-giao-duc' }
      ]
    },
    {
      title: 'ĐỔI MỚI SÁNG TẠO',
      baseHref: '/doi-moi-sang-tao',
      subcategories: [
        { name: 'Startup Việt', href: '/doi-moi-sang-tao/startup-viet' },
        { name: 'Ý tưởng hay', href: '/doi-moi-sang-tao/y-tuong-hay' },
        { name: 'Doanh nghiệp sáng tạo', href: '/doi-moi-sang-tao/doanh-nghiep-sang-tao' }
      ]
    },
    {
      title: 'SẢN PHẨM & REVIEW',
      baseHref: '/san-pham-review',
      subcategories: [
        { name: 'Thiết bị mới', href: '/san-pham-review/thiet-bi-moi' },
        { name: 'Ứng dụng & phần mềm', href: '/san-pham-review/ung-dung-phan-mem' },
        { name: 'Đánh giá sản phẩm', href: '/san-pham-review/danh-gia-san-pham' }
      ]
    },
    {
      title: 'XU HƯỚNG TƯƠNG LAI',
      baseHref: '/xu-huong-tuong-lai',
      subcategories: [
        { name: 'Blockchain', href: '/xu-huong-tuong-lai/blockchain' },
        { name: 'Công nghệ xanh', href: '/xu-huong-tuong-lai/cong-nghe-xanh' },
        { name: 'Metaverse', href: '/xu-huong-tuong-lai/metaverse' }
      ]
    },
    {
      title: 'NHÂN VẬT & GÓC NHÌN',
      baseHref: '/nhan-vat-goc-nhin',
      subcategories: [
        { name: 'Chân dung nhà sáng tạo', href: '/nhan-vat-goc-nhin/chan-dung-nha-sang-tao' },
        { name: 'Phỏng vấn chuyên gia', href: '/nhan-vat-goc-nhin/phong-van-chuyen-gia' },
        { name: 'Bình luận công nghệ', href: '/nhan-vat-goc-nhin/binh-luan-cong-nghe' }
      ]
    },
    {
      title: 'MULTIMEDIA',
      baseHref: '/multimedia',
      subcategories: [
        { name: 'Video', href: '/multimedia/video' },
        { name: 'Ảnh', href: '/multimedia/anh' },
        { name: 'Infographic', href: '/multimedia/infographic' }
      ]
    },
    {
      title: 'BẠN ĐỌC',
      baseHref: '/ban-doc',
      subcategories: []
    }
  ]

  useEffect(() => {
    setMounted(true)
    const session = getSession()
    if (session) {
      setUser(session)
      setIsLoggedIn(true)
      setIsAdminUser(session.role === 'ADMIN')
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user_session') {
        const s = getSession()
        setUser(s)
        setIsLoggedIn(!!s)
        setIsAdminUser(s?.role === 'ADMIN')
      }
    }
    const handleSessionUpdate = () => {
      const s = getSession()
      setUser(s)
      setIsLoggedIn(!!s)
      setIsAdminUser(s?.role === 'ADMIN')
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('session:update', handleSessionUpdate as EventListener)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('session:update', handleSessionUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery)
      } else {
        setSearchResults([])
        setIsSearchOpen(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMegaMenuOpen && !target.closest('[data-mega-menu]')) {
        setIsMegaMenuOpen(false)
      }
      if (isProfileMenuOpen && !target.closest('[data-profile-menu]')) {
        setIsProfileMenuOpen(false)
      }
      if (isSearchOpen && !target.closest('[data-mobile-search]') && window.innerWidth < 768) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMegaMenuOpen, isProfileMenuOpen, isSearchOpen])

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

  const startEditName = () => {
    setNameInput(user?.name || '')
    setIsEditingName(true)
  }

  const saveEditedName = async () => {
    if (!user) return
    const newName = nameInput.trim() || user.name
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, name: newName })
      })
      if (res.ok) {
        const data = await res.json()
        const updated: User = { ...user, ...data.user }
        setUser(updated)
        setSession(updated)
      } else {
        const updated: User = { ...user, name: newName }
        setUser(updated)
        setSession(updated)
      }
    } catch {
      const updated: User = { ...user, name: newName }
      setUser(updated)
      setSession(updated)
    } finally {
      setIsEditingName(false)
    }
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
    const baseClasses = "block px-3 py-2 text-sm rounded-md transition-colors"
    const activeClasses = "text-tech-blue bg-tech-blue/10 font-semibold"
    const inactiveClasses = "text-gray-700 hover:text-tech-blue hover:bg-gray-100"
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`
  }

  const getMegaMenuLinkClasses = (path: string) => {
    const baseClasses = "block text-sm px-2 py-1 rounded transition-colors"
    const activeClasses = "text-tech-blue bg-blue-50 font-medium"
    const inactiveClasses = "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`
  }

  const getMegaMenuTitleClasses = (path: string) => {
    const baseClasses = "font-bold text-lg"
    const activeClasses = "text-tech-blue"
    const inactiveClasses = "text-gray-900"
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`
  }

  const getMobileMenuTitleClasses = (path: string) => {
    const baseClasses = "font-bold px-3 py-2"
    const activeClasses = "text-tech-blue"
    const inactiveClasses = "text-gray-900"
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`
  }

  const getUserInitial = () => {
    const name = user?.name?.trim() || ''
    return name ? name.charAt(0).toUpperCase() : 'U'
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearchOpen(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)
      const data = await response.json()
      setSearchResults(data.results || [])
      setIsSearchOpen(true)
    } catch (error) {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    }
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-tech-blue hover:bg-gray-100 flex items-center justify-center"
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
            <Link href="/" className="flex flex-col items-center">
              <Image
                src="/footer.png"
                alt="TechNova Logo"
                width={220}
                height={220}
                className="mb-1"
              />
              {/* <div className="tech-slogan text-black">
                CÔNG NGHỆ & ĐỜI SỐNG
              </div> */}
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className={getNavLinkClasses('/')}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
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
            {/* <Link href="/nhan-vat-goc-nhin" className={getNavLinkClasses('/nhan-vat-goc-nhin')}>
              Nhân vật & Góc nhìn
            </Link>
            <Link href="/multimedia" className={getNavLinkClasses('/multimedia')}>
              Multimedia
            </Link> */}
            
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="flex items-center text-gray-700 hover:text-tech-blue transition-colors font-medium p-2 rounded-md"
              aria-label="Mở mega menu"
              data-mega-menu
            >
              <div className="w-6 h-6 flex flex-col items-center justify-center space-y-1">
                <span className={`block h-0.5 w-6 bg-current transition-transform duration-200 ${isMegaMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-opacity duration-200 ${isMegaMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-transform duration-200 ${isMegaMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
              </div>
            </button>
          </nav>

          <div className="hidden md:flex items-center">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-tech-blue hover:bg-gray-100 transition-colors flex items-center justify-center"
              aria-label="Tìm kiếm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="relative" data-profile-menu>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-tech-blue text-white flex items-center justify-center font-semibold hover:bg-tech-dark-blue transition-colors"
                    aria-haspopup="menu"
                    aria-label="Mở menu hồ sơ"
                  >
                    {getUserInitial()}
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        {!isEditingName ? (
                          <>
                            <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                            <div className="text-xs text-gray-600 truncate">{user?.email}</div>
                            <div className="text-xs text-gray-500 mt-1">Vai trò: {user?.role}</div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <label className="block text-xs text-gray-600">Chỉnh sửa tên</label>
                            <input
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-tech-blue"
                              placeholder="Nhập tên mới"
                            />
                            <div className="flex justify-end space-x-2 pt-1">
                              <button onClick={() => setIsEditingName(false)} className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">Hủy</button>
                              <button onClick={saveEditedName} className="px-2 py-1 text-xs bg-tech-blue text-white rounded hover:bg-tech-dark-blue">Lưu</button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="py-1">
                        {!isEditingName && (
                          <button
                            onClick={startEditName}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Chỉnh sửa tên
                          </button>
                        )}
                        <Link
                          href="/auth/change-password"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsProfileMenuOpen(false)
                          }}
                        >
                          Đổi mật khẩu
                        </Link>
                        {isAdminUser && (
                          <Link
                            href="/admin"
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsProfileMenuOpen(false)
                            }}
                          >
                            Đi tới Admin
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
            
            <button 
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-tech-blue hover:bg-gray-100"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen)
                if (!isSearchOpen) {
                  setTimeout(() => {
                    const input = document.querySelector('input[placeholder="Tìm kiếm..."]') as HTMLInputElement
                    if (input) input.focus()
                  }, 100)
                }
              }}
              aria-label="Tìm kiếm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
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

        {isMegaMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-100 border-t border-gray-200 shadow-lg z-50" data-mega-menu>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {megaMenuCategories.map((category, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Link href={category.baseHref} className={getMegaMenuTitleClasses(category.baseHref)}>
                        {category.title}
                      </Link>
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      {category.subcategories.map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          href={sub.href}
                          className={getMegaMenuLinkClasses(sub.href)}
                          onClick={() => setIsMegaMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-300">
                <div className="flex justify-start">
                  <div className="flex space-x-4">
                    <button className="bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-xs">TẢI APP TECHNOVA</div>
                        <div className="text-xs opacity-75">APP STORE</div>
                      </div>
                    </button>
                    
                    <button className="bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-xs">TẢI APP TECHNOVA</div>
                        <div className="text-xs opacity-75">ANDROID</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSearchOpen && (
          <div className="hidden md:block fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsSearchOpen(false)}>
            <div className="flex items-start justify-center pt-20 px-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-out">
                <div className="flex items-center p-6 border-b border-gray-200">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="Tìm kiếm bài viết, tag..."
                      className="w-full px-4 py-3 pl-12 pr-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-transparent"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    {isSearching && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-tech-blue"></div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Đóng tìm kiếm"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-4">
                      <div className="text-sm text-gray-500 mb-4 px-2">
                        Tìm thấy {searchResults.length} kết quả cho &quot;{searchQuery}&quot;
                      </div>
                      <div className="space-y-3">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/bai-viet/${result.slug}`}
                            className="block p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 hover:border-tech-blue/20"
                            onClick={closeSearch}
                          >
                            <div className="flex space-x-4">
                              {result.image && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={result.image}
                                    alt={result.imageAlt || result.title}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
                                  {highlightSearchTerm(result.title, searchQuery)}
                                </h4>
                                {result.excerpt && (
                                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                    {highlightSearchTerm(result.excerpt, searchQuery)}
                                  </p>
                                )}
                                <div className="flex items-center text-xs text-gray-500">
                                  <span className="font-medium">{result.authorName || 'Tác giả'}</span>
                                  <span className="mx-2">•</span>
                                  <span>{new Date(result.createdAt).toLocaleString('vi-VN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}</span>
                                  {result.tags.length > 0 && (
                                    <>
                                      <span className="mx-2">•</span>
                                      <span
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                                        style={{ backgroundColor: result.tags[0].color || '#3B82F6' }}
                                      >
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                        {result.tags[0].name}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : searchQuery.trim() && !isSearching ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                      <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                  ) : !searchQuery.trim() ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-tech-blue/10 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-tech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tìm kiếm bài viết</h3>
                      <p className="text-gray-500">Nhập từ khóa để tìm kiếm bài viết, tác giả...</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

        {isSearchOpen && (
          <div className="md:hidden" data-mobile-search>
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Tìm kiếm..."
                    className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tech-blue"></div>
                    </div>
                  )}
                </div>
              </form>

              {searchResults.length > 0 && (
                <div className="mt-3 max-h-64 overflow-y-auto">
                  <div className="text-xs text-gray-500 mb-2">
                    Tìm thấy {searchResults.length} kết quả
                  </div>
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/bai-viet/${result.slug}`}
                      className="block p-3 hover:bg-gray-50 rounded-md transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={closeSearch}
                    >
                      <div className="flex space-x-3">
                        {result.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={result.image}
                              alt={result.imageAlt || result.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {highlightSearchTerm(result.title, searchQuery)}
                          </h4>
                          {result.excerpt && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {highlightSearchTerm(result.excerpt, searchQuery)}
                            </p>
                          )}
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>{result.author}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(result.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {searchQuery.trim() && searchResults.length === 0 && !isSearching && (
                <div className="mt-3 text-center text-gray-500 text-sm">
                  Không tìm thấy kết quả nào
                </div>
              )}
            </div>
          </div>
        )}

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {megaMenuCategories.map((category, index) => (
                <div key={index} className="space-y-1">
                  <Link href={category.baseHref} className={getMobileMenuTitleClasses(category.baseHref)}>
                    {category.title}
                  </Link>
                  <div className="ml-4 space-y-1">
                    {category.subcategories.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        href={sub.href}
                        className={getMobileNavLinkClasses(sub.href)}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
