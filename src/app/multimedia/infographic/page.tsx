'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function InfographicPage() {
  useEffect(() => {
    document.title = 'Infographic - Multimedia - TechNova'
  }, [])

  return (
    <CategoryPage 
      title="Infographic"
      subcategory="infographic"
      basePath="multimedia"
    />
  )
}


