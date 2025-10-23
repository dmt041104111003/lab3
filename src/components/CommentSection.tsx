'use client'

import { useState } from 'react'

export default function CommentSection() {
  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      // TODO: Implement comment submission
      console.log('Comment:', comment)
      setComment('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Ý kiến</h2>
        </div>
        
        <div className="p-6">
          <div className="relative border-l-4 border-red-500 bg-gray-50 rounded">
            <form onSubmit={handleSubmit} className="flex items-center p-4">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ ý kiến của bạn"
                className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm"
              />
              <button
                type="submit"
                aria-label="Gửi ý kiến"
                className="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
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
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}
