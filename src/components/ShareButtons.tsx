'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
  className?: string
}

export default function ShareButtons({ url, title, className = '' }: ShareButtonsProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleFacebookShare = () => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Facebook Share */}
      <button
        onClick={handleFacebookShare}
        className="p-2 bg-tech-blue/10 text-tech-blue rounded-lg hover:bg-tech-blue/20 transition-colors"
        title="Chia sẻ lên Facebook"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-lg transition-colors ${
          isCopied 
            ? 'bg-tech-blue text-white hover:bg-tech-dark-blue' 
            : 'bg-tech-blue/10 text-tech-blue hover:bg-tech-blue/20'
        }`}
        title={isCopied ? "Đã sao chép!" : "Copy link"}
      >
        {isCopied ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        )}
      </button>
    </div>
  )
}
