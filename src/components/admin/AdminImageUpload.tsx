'use client'

import { useState } from 'react'
import AdminToast from './AdminToast'

interface AdminImageUploadProps {
  onImageUploaded: (url: string) => void
  onError: (error: string) => void
  className?: string
  disabled?: boolean
}

export default function AdminImageUpload({ 
  onImageUploaded, 
  onError, 
  className = '',
  disabled = false 
}: AdminImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      
      // Tự động upload ngay khi chọn file
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/images', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const uploadedImage = await response.json()
          setUploadedUrl(uploadedImage.path)
          onImageUploaded(uploadedImage.path)
          setSelectedFile(null)
          setPreviewUrl(null)
        } else {
          onError('Upload ảnh thất bại')
        }
      } catch (error) {
        onError('Có lỗi xảy ra khi upload ảnh')
      } finally {
        setUploading(false)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Chọn file hình ảnh"
        />
      </div>

      {uploading && (
        <div className="flex items-center space-x-3 p-3 bg-tech-blue bg-opacity-10 rounded-md">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tech-blue"></div>
          <span className="text-sm text-tech-blue">Đang upload lên Cloudinary...</span>
        </div>
      )}

      {uploadedUrl && (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-tech-blue bg-opacity-10 rounded-md">
            <div className="w-4 h-4 bg-tech-blue rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm text-tech-blue">Upload thành công!</span>
          </div>
          
          <div className="p-3 bg-tech-blue bg-opacity-5 rounded-md border border-tech-blue border-opacity-20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-tech-dark-blue">URL ảnh:</span>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(uploadedUrl)
                    setToast(`Đã copy: ${uploadedUrl}`)
                    setTimeout(() => setToast(''), 2000)
                  } catch (error) {
                    setToast('Không thể copy URL')
                    setTimeout(() => setToast(''), 2000)
                  }
                }}
                className="text-xs bg-tech-blue text-white px-2 py-1 rounded hover:bg-tech-dark-blue transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="text-xs text-tech-dark-blue break-all bg-white p-2 rounded border border-tech-blue border-opacity-30">
              {uploadedUrl}
            </div>
          </div>
        </div>
      )}

      <AdminToast 
        message={toast}
        isVisible={!!toast}
        onClose={() => setToast('')}
      />
    </div>
  )
}
