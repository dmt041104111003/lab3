'use client'

import { useState, useEffect } from 'react'
import { getSession } from '@/lib/session'
import { useParams } from 'next/navigation'

export default function CommentSection() {
  const params = useParams()
  const [comment, setComment] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [submittingReply, setSubmittingReply] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalComments, setTotalComments] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const session = getSession()
      if (session) {
        setIsLoggedIn(true)
        setUser(session)
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    }
    
    checkAuth()
    
    // Listen for session updates
    const handleSessionUpdate = () => {
      // Force refresh after a small delay to ensure localStorage is updated
      setTimeout(() => {
        checkAuth()
      }, 100)
    }
    
    window.addEventListener('session:update', handleSessionUpdate)
    
    return () => {
      window.removeEventListener('session:update', handleSessionUpdate)
    }
  }, [])
  
  // Load comments
  const loadComments = async (page = 1, limit = 3, append = false) => {
    if (!params?.slug) return
    
    if (append) {
      setLoadingMore(true)
    } else {
      setLoadingComments(true)
    }
    
    try {
      const response = await fetch(`/api/comments?postSlug=${params.slug}&page=${page}&limit=${limit}`)
      const data = await response.json()
      
      if (response.ok) {
        if (append) {
          setComments(prev => [...prev, ...(data.comments || [])])
        } else {
          setComments(data.comments || [])
        }
        setTotalComments(data.pagination?.total || 0)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoadingComments(false)
      setLoadingMore(false)
    }
  }

  // Load comments on mount
  useEffect(() => {
    loadComments()
  }, [params?.slug])

  // Load more comments
  const loadMoreComments = () => {
    const nextPage = currentPage + 1
    loadComments(nextPage, 5, true)
  }

  const handleInputClick = () => {
    if (isLoggedIn) {
      // User is logged in, allow typing
      return
    } else {
      // User not logged in, show login modal
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email là bắt buộc')
      return false
    }
    if (!formData.password.trim()) {
      setError('Mật khẩu là bắt buộc')
      return false
    }
    
    // Trường hợp đặc biệt: admin login
    if (formData.email.toLowerCase() === 'admin') {
      return true
    }
    
    // Validate email format cho user thường
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }
    
    return true
  }

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('user_session', JSON.stringify(data.user))
        try {
          await fetch('/api/set-cookie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: data.user }),
          })
        } catch (error) {}

        // Trigger session update event
        window.dispatchEvent(new CustomEvent('session:update'))
        
        setIsLoggedIn(true)
        setUser(data.user)
        closeModal()
        setFormData({ email: '', password: '' })
      } else {
        setError(data.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGoogleLogin = () => {
    // Redirect to signin page
    window.location.href = '/auth/signin'
  }

  const handleReply = (commentId: number) => {
    if (isLoggedIn) {
      setReplyingTo(commentId)
      setReplyText('')
    } else {
      setIsModalOpen(true)
    }
  }

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (response.ok) {
        setLikedComments(prev => {
          const newSet = new Set(prev)
          if (newSet.has(commentId)) {
            newSet.delete(commentId)
          } else {
            newSet.add(commentId)
          }
          return newSet
        })
        loadComments() // Reload to get updated like count
      }
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !replyingTo) return
    
    setSubmittingReply(true)
    setError('')
    
    try {
      const response = await fetch('/api/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          commentId: replyingTo,
          content: replyText.trim()
        })
      })

      if (response.ok) {
        setReplyText('')
        setReplyingTo(null)
        setCurrentPage(1)
        loadComments(1, 3, false) // Reload comments from page 1
      } else {
        const error = await response.json()
        if (response.status === 403) {
          setError(error.error || 'Tài khoản của bạn đã bị khóa')
        } else {
          setError(error.error || 'Có lỗi xảy ra khi gửi phản hồi')
        }
      }
    } catch (error) {
      console.error('Error submitting reply:', error)
      setError('Có lỗi xảy ra khi gửi phản hồi')
    } finally {
      setSubmittingReply(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !params?.slug) return
    
    setSubmittingComment(true)
    setError('')
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          postSlug: params.slug,
          content: comment.trim()
        })
      })

      if (response.ok) {
        setComment('')
        setCurrentPage(1)
        loadComments(1, 3, false) // Reload comments from page 1
      } else {
        const error = await response.json()
        if (response.status === 403) {
          setError(error.error || 'Tài khoản của bạn đã bị khóa')
        } else {
          setError(error.error || 'Có lỗi xảy ra khi gửi bình luận')
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      setError('Có lỗi xảy ra khi gửi bình luận')
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Ý kiến</h2>
        </div>
        
        <div className="p-6">
          {error && (
            <div className={`mb-4 p-3 border rounded text-sm ${
              error.includes('khóa') || error.includes('banned') 
                ? 'bg-orange-50 border-orange-200 text-orange-600' 
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="relative border-l-4 border-tech-blue bg-gray-50 rounded">
              <div className="flex items-center p-4">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ ý kiến của bạn"
                  className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm"
                  readOnly={!isLoggedIn || submittingComment}
                  onClick={!isLoggedIn ? handleInputClick : undefined}
                  disabled={submittingComment}
                />
                <button
                  type="submit"
                  disabled={!comment.trim() || !isLoggedIn || submittingComment}
                  className="ml-3 px-4 py-2 bg-tech-blue/10 text-tech-blue font-semibold rounded hover:bg-tech-blue/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submittingComment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tech-blue"></div>
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Comments List */}
      <div className="mt-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <div className="pb-3 text-sm text-tech-blue border-b-2 border-tech-blue font-semibold">
            Mới nhất
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-5">
          {loadingComments ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tech-blue mx-auto"></div>
              <p className="text-gray-500 mt-2">Đang tải bình luận...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
            </div>
          ) : (
            comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 pb-5 border-b border-gray-100">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-tech-blue/10 flex items-center justify-center text-sm font-semibold text-tech-blue flex-shrink-0">
                {comment.author.name.charAt(0).toUpperCase()}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {comment.author.name}
                  </span>
                </div>
                
                <div className="text-sm text-gray-800 leading-relaxed mb-3 whitespace-pre-line">
                  {comment.content}
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      likedComments.has(comment.id) 
                        ? 'text-tech-blue hover:text-tech-blue/80' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8.864 2.908a.75.75 0 0 0-1.728 0L5.5 7.5H2.75a.75.75 0 0 0-.712.988l1.817 5.451A.75.75 0 0 0 4.567 14.5h6.866a.75.75 0 0 0 .712-.561l1.817-5.451A.75.75 0 0 0 13.25 7.5H10.5L8.864 2.908z"/>
                    </svg>
                    <span>Thích</span>
                    {comment.likes > 0 && (
                      <span className="ml-1 font-semibold">{comment.likes}</span>
                    )}
                  </button>
                  
                  
                  <button 
                    onClick={() => handleReply(comment.id)}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Trả lời
                  </button>
                  
                  
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-13 mt-3 space-y-3">
                    {comment.replies.map((reply: any) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
                          {reply.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-900">
                              {reply.author.name}
                            </span>
                            {reply.mentionedUser && (
                              <>
                                <span className="text-xs text-gray-500">trả lời</span>
                                <span className="text-xs text-tech-blue font-medium">
                                  @{reply.mentionedUser.name}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-800 leading-relaxed mb-2 whitespace-pre-line">
                            {reply.content}
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleLike(reply.id)}
                              className={`flex items-center gap-1 text-xs transition-colors ${
                                likedComments.has(reply.id) 
                                  ? 'text-tech-blue hover:text-tech-blue/80' 
                                  : 'text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8.864 2.908a.75.75 0 0 0-1.728 0L5.5 7.5H2.75a.75.75 0 0 0-.712.988l1.817 5.451A.75.75 0 0 0 4.567 14.5h6.866a.75.75 0 0 0 .712-.561l1.817-5.451A.75.75 0 0 0 13.25 7.5H10.5L8.864 2.908z"/>
                              </svg>
                              <span>Thích</span>
                              {reply.likes > 0 && (
                                <span className="ml-1 font-semibold">{reply.likes}</span>
                              )}
                            </button>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.createdAt).toLocaleDateString('vi-VN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className="mt-3 ml-13">
                    <form onSubmit={handleReplySubmit}>
                      <div className="relative border-l-4 border-tech-blue bg-gray-50 rounded">
                        <div className="flex items-center p-4">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Trả lời ${comment.author.name}...`}
                            className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm"
                            readOnly={!isLoggedIn || submittingReply}
                            onClick={!isLoggedIn ? handleInputClick : undefined}
                            disabled={submittingReply}
                          />
                          <button
                            type="submit"
                            disabled={!replyText.trim() || !isLoggedIn || submittingReply}
                            className="ml-3 px-3 py-1.5 bg-tech-blue/10 text-tech-blue text-xs font-semibold rounded hover:bg-tech-blue/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {submittingReply ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-tech-blue"></div>
                                Đang gửi...
                              </>
                            ) : (
                              'Gửi'
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))
          )}
        </div>

        {/* Load More Button */}
        {comments.length < totalComments && (
          <button 
            onClick={loadMoreComments}
            disabled={loadingMore}
            className="w-full py-3 bg-tech-blue/10 text-tech-blue font-semibold rounded hover:bg-tech-blue/20 transition-colors mt-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tech-blue"></div>
                Đang tải...
              </>
            ) : (
              `Xem thêm bình luận (${totalComments - comments.length} còn lại)`
            )}
          </button>
        )}
      </div>

      {/* Login Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-lg w-full max-w-md mx-4 animate-slide-down">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                ×
              </button>
              
              <div className="text-center mb-4">
                <div className="flex justify-center">
                  <img 
                    src="/footer.png" 
                    alt="Logo" 
                    className="h-8 w-auto"
                  />
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 text-center">
                Đăng nhập
              </h3>
            </div>
            
            {/* Modal Body */}
            <div className="px-6 py-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleModalSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập Email của bạn"
                    className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-tech-blue"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-tech-blue"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-tech-blue text-white font-semibold rounded hover:bg-tech-blue/90 transition-colors mb-5 disabled:opacity-50"
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
              </div>
              
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20">
                  <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
                  <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
                  <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
                  <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
                </svg>
                Google
              </button>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 text-xs text-gray-600 text-center leading-relaxed">
              Tiếp tục là đồng ý với <a href="#" className="text-blue-600 hover:underline">điều khoản sử dụng</a> và <a href="#" className="text-blue-600 hover:underline">chính sách bảo mật</a> của TechNova.
            </div>
            
            {/* Register Link */}
            <div className="px-6 pb-4 text-center">
              <span className="text-sm text-gray-500">Chưa có tài khoản? </span>
              <a 
                href="/auth/signup" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                Đăng ký ngay
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}