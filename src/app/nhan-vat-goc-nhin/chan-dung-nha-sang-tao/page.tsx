'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function ChanDungNhaSangTaoPage() {
  useEffect(() => {
    document.title = 'Chân dung nhà sáng tạo - TechNova'
  }, [])

  return (
    <CategoryPage 
      title="Chân dung nhà sáng tạo"
      subcategory="chan-dung-nha-sang-tao"
      basePath="nhan-vat-goc-nhin"
    />
  )
}


