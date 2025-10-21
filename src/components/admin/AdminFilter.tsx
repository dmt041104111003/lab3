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
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <AdminInput
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Bộ lọc
          </AdminButton>
          
          {onReset && (
            <AdminButton
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Reset
            </AdminButton>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sort Options */}
            {showSort && sortOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <AdminSelect
                  value={sortBy || ''}
                  onChange={(e) => onSortChange?.(e.target.value)}
                  options={[
                    { value: '', label: 'Mặc định' },
                    ...sortOptions
                  ]}
                />
              </div>
            )}

            {/* Filter Options */}
            {showFilter && filterOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo
                </label>
                <AdminSelect
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
