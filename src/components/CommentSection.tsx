'use client'

import { useState } from 'react'

export default function CommentSection() {
  const [comment, setComment] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState('')

  const handleInputClick = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // TODO: Implement login logic
      console.log('Login with email:', email)
      alert('Đang xử lý đăng nhập...')
      closeModal()
    }
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log('Login with Google')
    alert('Đăng nhập với Google')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      // TODO: Implement comment submission
      console.log('Comment:', comment)
      setComment('')
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Ý kiến</h2>
        </div>
        
        <div className="p-6">
          <div 
            className="relative border-l-4 border-red-500 bg-gray-50 rounded cursor-pointer"
            onClick={handleInputClick}
          >
            <div className="flex items-center p-4">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ ý kiến của bạn"
                className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm cursor-pointer"
                readOnly
              />
              <div className="ml-3 p-2 text-gray-400">
                <svg 
                  className="w-6 h-6" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="8.5" cy="9.5" r="1.5"/>
                  <circle cx="15.5" cy="9.5" r="1.5"/>
                  <path d="M8 14.5 Q12 17 16 14.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
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
              <form onSubmit={handleModalSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập Email của bạn"
                    className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition-colors mb-5"
                >
                  Tiếp tục
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
                href="/dang-ky" 
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
