import { ReactNode } from 'react'

interface Column {
  key: string
  label: string
  className?: string
}

interface AdminTableProps {
  columns: Column[]
  data: any[]
  renderRow: (item: any, index: number) => ReactNode
  emptyMessage?: string
  emptyDescription?: string
  className?: string
}

export default function AdminTable({ 
  columns, 
  data, 
  renderRow, 
  emptyMessage = 'Không có dữ liệu',
  emptyDescription = 'Chưa có dữ liệu nào trong hệ thống.',
  className = ''
}: AdminTableProps) {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
            <p className="mt-1 text-sm text-gray-500">{emptyDescription}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <div key={index} className="p-4">
                {renderRow(item, index)}
              </div>
            ))}
          </div>
        )}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyDescription}</p>
        </div>
      )}
    </div>
  )
}
