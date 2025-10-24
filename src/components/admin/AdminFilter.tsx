'use client'

import { useState } from 'react'
import AdminInput from './AdminInput'
import AdminSelect from './AdminSelect'
import AdminButton from './AdminButton'

interface FilterOption {
  value: string
  label: string
}

interface AdminFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  sortBy?: string
  onSortChange?: (value: string) => void
  sortOptions?: FilterOption[]
  filterBy?: string
  onFilterChange?: (value: string) => void
  filterOptions?: FilterOption[]
  showSort?: boolean
  showFilter?: boolean
  onReset?: () => void
  className?: string
}

export default function AdminFilter({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  sortBy,
  onSortChange,
  sortOptions = [],
  filterBy,
  onFilterChange,
  filterOptions = [],
  showSort = true,
  showFilter = true,
  onReset,
  className = ''
}: AdminFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleReset = () => {
    onSearchChange('')
    onSortChange?.('')
    onFilterChange?.('')
    onReset?.()
  }

  return (
    <div className={`bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        <div className="flex-1 w-full">
          <AdminInput
            name="search"
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 sm:flex-none"
          >
            Bộ lọc
          </AdminButton>
          
          {onReset && (
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="flex-1 sm:flex-none"
          >
            Reset
          </AdminButton>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {showSort && sortOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <AdminSelect
                  name="sortBy"
                  value={sortBy || ''}
                  onChange={(e) => onSortChange?.(e.target.value)}
                  options={[
                    { value: '', label: 'Mặc định' },
                    ...sortOptions
                  ]}
                />
              </div>
            )}

            {showFilter && filterOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo
                </label>
                <AdminSelect
                  name="filterBy"
                  value={filterBy || ''}
                  onChange={(e) => onFilterChange?.(e.target.value)}
                  options={[
                    { value: '', label: 'Tất cả' },
                    ...filterOptions
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
