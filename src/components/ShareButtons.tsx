'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
}

export default function ShareButtons({ url, title, description, className = '' }: ShareButtonsProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleFacebookShare = () => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = description ? encodeURIComponent(description) : ''
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}${encodedDescription ? `&description=${encodedDescription}` : ''}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleLinkedInShare = () => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = description ? encodeURIComponent(description) : ''
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}${encodedDescription ? `&summary=${encodedDescription}` : ''}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleTelegramShare = () => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleFacebookShare}
        className="p-2 bg-blue-600/10 text-blue-600 rounded-lg hover:bg-blue-600/20 transition-colors"
        title="Chia sẻ lên Facebook"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>

      <button
        onClick={handleTwitterShare}
        className="p-2 bg-sky-500/10 text-sky-500 rounded-lg hover:bg-sky-500/20 transition-colors"
        title="Chia sẻ lên Twitter"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      </button>

      <button
        onClick={handleLinkedInShare}
        className="p-2 bg-blue-700/10 text-blue-700 rounded-lg hover:bg-blue-700/20 transition-colors"
        title="Chia sẻ lên LinkedIn"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>

      <button
        onClick={handleTelegramShare}
        className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
        title="Chia sẻ lên Telegram"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </button>

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