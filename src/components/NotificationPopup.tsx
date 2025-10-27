'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Notification {
  id: string
  title: string
  slug: string
  excerpt?: string
  createdAt: string
  viewedAt?: string
  category?: string
  subcategory?: string
  authorName?: string
  image?: string
  imageAlt?: string
}

interface NotificationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPopup({ isOpen, onClose }: NotificationPopupProps) {
  const [activeTab, setActiveTab] = useState<'thongbao' | 'ykien' | 'daxem'>('thongbao')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(true)
  const popupRef = useRef<HTMLDivElement>(null)

  const getDeviceData = () => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
    }
  }

  const fetchNotifications = async (type: 'unread' | 'read') => {
    setIsLoading(true)
    try {
      const deviceData = getDeviceData()
      const params = new URLSearchParams({
        type: type === 'unread' ? 'unread' : 'read',
        deviceData: JSON.stringify(deviceData)
      })
      
      const response = await fetch(`/api/notifications?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const deviceData = getDeviceData()
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'count',
          deviceData
        })
      })
      const data = await response.json()
      
      if (data.success) {
        setUnreadCount(data.count)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchUnreadCount()
      if (activeTab === 'thongbao') {
        fetchNotifications('unread')
      } else if (activeTab === 'daxem') {
        fetchNotifications('read')
      }
    }
  }, [isOpen, activeTab])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Vừa xong'
    if (diffInHours < 24) return `${diffInHours}h trước`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  const getCategoryName = (category?: string, subcategory?: string) => {
    if (subcategory) {
      const categoryMap: { [key: string]: string } = {
        'cong-nghe-viet-nam': 'Công nghệ Việt Nam',
        'cong-nghe-the-gioi': 'Công nghệ thế giới',
        'tri-tue-nhan-tao': 'Trí tuệ nhân tạo',
        'du-lieu-lon-iot': 'Dữ liệu lớn & IoT',
        'chuyen-doi-so-doanh-nghiep-giao-duc': 'Chuyển đổi số',
        'startup-viet': 'Startup Việt',
        'y-tuong-hay': 'Ý tưởng hay',
        'doanh-nghiep-sang-tao': 'Doanh nghiệp sáng tạo',
        'thiet-bi-moi': 'Thiết bị mới',
        'ung-dung-phan-mem': 'Ứng dụng & phần mềm',
        'danh-gia-san-pham': 'Đánh giá sản phẩm',
        'blockchain': 'Blockchain',
        'cong-nghe-xanh': 'Công nghệ xanh',
        'metaverse': 'Metaverse',
        'chan-dung-nha-sang-tao': 'Chân dung nhà sáng tạo',
        'phong-van-chuyen-gia': 'Phỏng vấn chuyên gia',
        'binh-luan-cong-nghe': 'Bình luận công nghệ',
        'video': 'Video',
        'anh': 'Ảnh',
        'infographic': 'Infographic'
      }
      return categoryMap[subcategory] || subcategory
    }
    
    if (category) {
      const categoryMap: { [key: string]: string } = {
        'tin-tuc': 'Tin tức',
        'ai-chuyen-doi-so': 'AI - Chuyển đổi số',
        'doi-moi-sang-tao': 'Đổi mới sáng tạo',
        'san-pham-review': 'Sản phẩm & Review',
        'xu-huong-tuong-lai': 'Xu hướng tương lai',
        'nhan-vat-goc-nhin': 'Nhân vật & Góc nhìn',
        'multimedia': 'Multimedia',
        'ban-doc': 'Bạn đọc'
      }
      return categoryMap[category] || category
    }
    
    return 'Khác'
  }

  const handleTabChange = (tab: 'thongbao' | 'ykien' | 'daxem') => {
    setActiveTab(tab)
    if (tab === 'thongbao') {
      fetchNotifications('unread')
    } else if (tab === 'daxem') {
      fetchNotifications('read')
    }
  }

  const handleSubscribeToggle = () => {
    setIsSubscribed(!isSubscribed)
    // Here you can add logic to save subscription preference
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      
      {/* Popup */}
      <div 
        ref={popupRef}
        className="fixed top-12 right-3 w-96 bg-white rounded-lg shadow-xl z-50 animate-slideDown"
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange('thongbao')}
            className={`flex-1 flex flex-col items-center py-3 px-4 text-sm transition-colors ${
              activeTab === 'thongbao'
                ? 'text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Thông báo
          </button>
          <button
            onClick={() => handleTabChange('ykien')}
            className={`flex-1 flex flex-col items-center py-3 px-4 text-sm transition-colors ${
              activeTab === 'ykien'
                ? 'text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Ý kiến
          </button>
          <button
            onClick={() => handleTabChange('daxem')}
            className={`flex-1 flex flex-col items-center py-3 px-4 text-sm transition-colors ${
              activeTab === 'daxem'
                ? 'text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Tin đã xem
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {activeTab === 'thongbao' && (
            <div>
              <button
                onClick={handleSubscribeToggle}
                className={`w-full mx-4 my-3 px-6 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  isSubscribed
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {isSubscribed ? 'Tắt nhận thông báo' : 'Bật nhận thông báo'}
              </button>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={`/bai-viet/${notification.slug}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                      onClick={onClose}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">
                          {getCategoryName(notification.category, notification.subcategory)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <h4 
                        className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                        title={notification.title}
                      >
                        {notification.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <p className="text-sm text-gray-500">Không có thông báo mới</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ykien' && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p className="text-sm text-gray-500">Chưa có ý kiến nào</p>
            </div>
          )}

          {activeTab === 'daxem' && (
            <div>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={`/bai-viet/${notification.slug}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                      onClick={onClose}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">
                          {getCategoryName(notification.category, notification.subcategory)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {notification.viewedAt ? formatTimeAgo(notification.viewedAt) : formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <h4 
                        className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                        title={notification.title}
                      >
                        {notification.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <p className="text-sm text-gray-500">Chưa có tin nào đã xem</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
