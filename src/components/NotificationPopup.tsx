'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSession } from '@/lib/session'

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

interface Reply {
  id: string
  content: string
  createdAt: string
  authorName: string
  commentId: string
  parentContent: string
  post: {
    id: string
    title: string
    slug: string
    category?: string
    subcategory?: string
  }
}

interface NotificationPopupProps {
  isOpen: boolean
  onClose: () => void
  onNotificationToggle?: (isEnabled: boolean) => void
}

const ALLOWED_CATEGORIES = new Set(['tin-tuc', 'proposal'])

const isAllowedCategory = (category?: string) => {
  if (!category) return false
  return ALLOWED_CATEGORIES.has(category)
}

export default function NotificationPopup({ isOpen, onClose, onNotificationToggle }: NotificationPopupProps) {
  const [activeTab, setActiveTab] = useState<'thongbao' | 'ykien' | 'daxem'>('thongbao')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(true)

  // Load notification preference from localStorage on mount
  useEffect(() => {
    const savedNotificationState = localStorage.getItem('notificationEnabled')
    if (savedNotificationState !== null) {
      setIsSubscribed(savedNotificationState === 'true')
    }
  }, [])

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
        const filteredNotifications = (data.notifications || []).filter((notification: Notification) =>
          isAllowedCategory(notification.category)
        )
        setNotifications(filteredNotifications)
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

  const fetchReplies = async () => {
    setIsLoading(true)
    try {
      const session = getSession()
      if (!session) {
        setReplies([])
        return
      }

      const deviceData = getDeviceData()
      const params = new URLSearchParams({
        type: 'replies',
        deviceData: JSON.stringify(deviceData),
        userId: session.id
      })
      
      const response = await fetch(`/api/notifications?${params}`)
      const data = await response.json()
      
      if (data.success) {
        const filteredReplies = (data.replies || []).filter((reply: Reply) =>
          isAllowedCategory(reply.post?.category)
        )
        setReplies(filteredReplies)
      }
    } catch (error) {
      console.error('Error fetching replies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      const savedNotificationState = localStorage.getItem('notificationEnabled')
      if (savedNotificationState !== null) {
        setIsSubscribed(savedNotificationState === 'true')
      }
      
      fetchUnreadCount()
      if (activeTab === 'thongbao') {
        fetchNotifications('unread')
      } else if (activeTab === 'ykien') {
        fetchReplies()
      } else if (activeTab === 'daxem') {
        fetchNotifications('read')
      }
    }
  }, [isOpen, activeTab])


  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInMinutes < 1) return 'Vừa xong'
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks} tuần trước`
    }
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getCategoryName = (category?: string, subcategory?: string) => {
    if (subcategory) {
      const categoryMap: { [key: string]: string } = {
        'cong-nghe-viet-nam': 'Công nghệ Việt Nam',
        'cong-nghe-the-gioi': 'Công nghệ thế giới'
      }
      return categoryMap[subcategory] || subcategory
    }
    
    if (category) {
      const categoryMap: { [key: string]: string } = {
        'tin-tuc': 'Tin tức',
        'proposal': 'Proposal',
        'team': 'Team'
      }
      return categoryMap[category] || category
    }
    
    return 'Khác'
  }

  const getPostUrl = (notification: Notification) => {
    // Regular format: /{category}/{subcategory}/{slug}
    if (notification.category && notification.subcategory) {
      return `/${notification.category}/${notification.subcategory}/${notification.slug}`
    }
    
    // Fallback to slug only
    return `/bai-viet/${notification.slug}`
  }

  const getReplyUrl = (reply: Reply) => {
    const { post } = reply
    let baseUrl = ''
    
    if (post.category && post.subcategory) {
      // Regular format: /{category}/{subcategory}/{slug}
      baseUrl = `/${post.category}/${post.subcategory}/${post.slug}`
    } else {
      // Fallback to slug only
      baseUrl = `/bai-viet/${post.slug}`
    }
    
    // Add hash anchor to scroll to comment
    return `${baseUrl}#comment-${reply.commentId}`
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
    const newState = !isSubscribed
    setIsSubscribed(newState)
    localStorage.setItem('notificationEnabled', newState.toString())
    onNotificationToggle?.(newState)
  }

  if (!isOpen) return null

  return (
    <div className="w-full sm:w-96 bg-white sm:rounded-lg sm:shadow-xl sm:border sm:border-gray-200 animate-slideDown">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange('thongbao')}
            className={`flex-1 flex flex-col items-center py-3 px-4 text-sm transition-colors ${
              activeTab === 'thongbao'
                ? 'text-gray-900 border-b-2 border-tech-blue'
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
                ? 'text-gray-900 border-b-2 border-tech-blue'
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
                ? 'text-gray-900 border-b-2 border-tech-blue'
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
        <div className="max-h-[calc(100vh-12rem)] sm:max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {activeTab === 'thongbao' && (
            <div>
              <div className="px-4 my-3">
                <button
                  onClick={handleSubscribeToggle}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    isSubscribed
                      ? 'bg-tech-blue text-white hover:bg-tech-dark-blue'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {isSubscribed ? 'Tắt' : 'Bật'}
              </button>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tech-blue"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={getPostUrl(notification)}
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
                        className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-tech-blue transition-colors"
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
            </div>
          )}

          {activeTab === 'ykien' && (
            <div>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tech-blue"></div>
                </div>
              ) : replies.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {replies.map((reply) => (
                    <Link
                      key={reply.id}
                      href={getReplyUrl(reply)}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                      onClick={onClose}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-tech-blue">
                          {reply.authorName} đã trả lời
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(reply.createdAt)}
                        </span>
                      </div>
                      
                      {/* Parent comment */}
                      <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600 border-l-2 border-gray-300">
                        <span className="font-medium">Bình luận của bạn:</span>
                        <p className="line-clamp-2 mt-1">{reply.parentContent}</p>
                      </div>
                      
                      {/* Reply content */}
                      <p className="text-sm text-gray-900 mb-2 line-clamp-3">
                        {reply.content}
                      </p>
                      
                      {/* Post title */}
                      <div className="text-xs text-gray-500">
                        Trong bài: <span className="font-medium text-gray-700">{reply.post.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p className="text-sm text-gray-500">Chưa có ý kiến nào</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'daxem' && (
            <div>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tech-blue"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={getPostUrl(notification)}
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
                        className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-tech-blue transition-colors"
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
      </div>
  )
}
