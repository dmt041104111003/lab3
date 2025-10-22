'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function PhongVanChuyenGiaPage() {
  useEffect(() => {
    document.title = 'Phỏng vấn chuyên gia - TechNova'
  }, [])

  return (
    <CategoryPage 
      title="Phỏng vấn chuyên gia"
      subcategory="phong-van-chuyen-gia"
      basePath="nhan-vat-goc-nhin"
    />
  )
}


