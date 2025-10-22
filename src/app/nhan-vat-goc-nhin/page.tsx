'use client'

import { useEffect } from 'react'
import CategoryMainPage from '@/components/CategoryMainPage'

export default function NhanVatGocNhinPage() {
  useEffect(() => {
    document.title = 'Nhân vật & Góc nhìn - TechNova'
  }, [])

  return (
    <CategoryMainPage 
      categoryId="nhan-vat-goc-nhin"
      title="Nhân vật & Góc nhìn"
      basePath="nhan-vat-goc-nhin"
    />
  )
}


