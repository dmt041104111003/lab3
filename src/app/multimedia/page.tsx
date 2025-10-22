'use client'

import { useEffect } from 'react'
import CategoryMainPage from '@/components/CategoryMainPage'

export default function MultimediaPage() {
  useEffect(() => {
    document.title = 'Multimedia - TechNova'
  }, [])

  return (
    <CategoryMainPage 
      categoryId="multimedia"
      title="Multimedia"
      basePath="multimedia"
    />
  )
}


