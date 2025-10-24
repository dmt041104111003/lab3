'use client'

import Link from 'next/link'
import { CATEGORIES, getCategoryById } from '@/lib/categories'

interface CategoryBreadcrumbProps {
  category?: string
  subcategory?: string
  showHome?: boolean
  className?: string
}

export default function CategoryBreadcrumb({ 
  category, 
  subcategory, 
  showHome = true,
  className = ""
}: CategoryBreadcrumbProps) {
  const getCategoryDisplayName = (categoryId: string) => {
    const categoryData = getCategoryById(categoryId)
    return categoryData?.name || categoryId
  }

  const getSubcategoryDisplayName = (subcategoryId: string) => {
    const categoryData = CATEGORIES.find(cat => 
      cat.subcategories.some(sub => sub.id === subcategoryId)
    )
    
    if (categoryData) {
      const subcategoryData = categoryData.subcategories.find(sub => sub.id === subcategoryId)
      return subcategoryData?.name || subcategoryId
    }
    
    return subcategoryId
  }

  return (
    <nav className={`mb-6 ${className}`}>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        {showHome && (
          <>
            <Link 
              href="/" 
              className="inline-flex items-center hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Trang chủ
            </Link>
            {category && <span>/</span>}
          </>
        )}
        
        {category && (
          <>
            <Link 
              href={`/${category}`}
              className="hover:text-gray-700 transition-colors"
            >
              {getCategoryDisplayName(category)}
            </Link>
            {subcategory && <span>/</span>}
          </>
        )}
        
        {subcategory && (
          <Link 
            href={`/${category}/${subcategory}`}
            className="hover:text-gray-700 transition-colors"
          >
            {getSubcategoryDisplayName(subcategory)}
          </Link>
        )}
      </div>
    </nav>
  )
}
