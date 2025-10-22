'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function BinhLuanCongNghePage() {
  useEffect(() => {
    document.title = 'Bình luận công nghệ - TechNova'
  }, [])

  return (
    <CategoryPage 
      title="Bình luận công nghệ"
      subcategory="binh-luan-cong-nghe"
      basePath="nhan-vat-goc-nhin"
    />
  )
}


