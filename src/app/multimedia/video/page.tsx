'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function VideoPage() {
  useEffect(() => {
    document.title = 'Video - Multimedia - TechNova'
  }, [])

  return (
    <CategoryPage 
      title="Video"
      subcategory="video"
      basePath="multimedia"
    />
  )
}


