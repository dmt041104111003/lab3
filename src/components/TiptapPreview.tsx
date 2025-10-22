'use client'

import { useEffect, useState } from 'react'
import '../styles/tiptap.css'

interface TiptapPreviewProps {
  content: string
  className?: string
}

export default function TiptapPreview({ content, className = "" }: TiptapPreviewProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={`border border-gray-300 rounded-lg ${className}`}>
        <div className="border-b border-gray-200 p-2 bg-gray-50">
          <div className="text-sm text-gray-500">Đang tải preview...</div>
        </div>
        <div className="min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div 
        className="prose prose-gray max-w-none tiptap-preview"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}
