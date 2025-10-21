'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

interface Tag {
  id: string
  name: string
  color: string
}

interface Topic {
  id: string
  name: string
  description: string | null
}

interface Image {
  id: string
  originalName: string
  path: string
  alt: string | null
}

export default function CreatePost() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    selectedTags: [] as string[],
    selectedTopics: [] as string[],
    selectedImage: '',
    imageType: 'existing' as 'existing' | 'upload' | 'url',
    newImageFile: null as File | null,
    imageUrl: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tagsRes, topicsRes, imagesRes] = await Promise.all([
        fetch('/api/tags'),
        fetch('/api/topics'),
        fetch('/api/images')
      ])

      const [tagsData, topicsData, imagesData] = await Promise.all([
        tagsRes.json(),
        topicsRes.json(),
        imagesRes.json()
      ])

      setTags(tagsData)
      setTopics(topicsData)
      setImages(imagesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          selectedTags: formData.selectedTags,
          selectedTopics: formData.selectedTopics,
          selectedImage: formData.selectedImage,
          imageType: formData.imageType,
          imageUrl: formData.imageUrl,
          authorId: '1' // In a real app, get from session
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/posts')
      } else {
        setError(data.message || 'Tạo bài viết thất bại')
      }
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }


  const handleTopicChange = (topicId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        selectedTopics: [...formData.selectedTopics, topicId]
      })
    } else {
      setFormData({
        ...formData,
        selectedTopics: formData.selectedTopics.filter(id => id !== topicId)
      })
    }
  }

  const handleImageTypeChange = (type: 'existing' | 'upload' | 'url') => {
    setFormData({
      ...formData,
      imageType: type,
      selectedImage: '',
      newImageFile: null,
      imageUrl: ''
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        newImageFile: file
      })
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tạo bài viết mới</h1>
        <p className="mt-2 text-gray-600">Viết và xuất bản bài viết mới</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Thông tin bài viết</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề bài viết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả ngắn
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
              placeholder="Nhập mô tả ngắn về bài viết"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung bài viết <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
              placeholder="Viết nội dung bài viết..."
              required
            />
          </div>

          {/* Tags Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thẻ (Tags)
            </label>
            {loadingData ? (
              <div className="text-sm text-gray-500">Đang tải thẻ...</div>
            ) : (
              <select
                name="selectedTags"
                value={formData.selectedTags[0] || ''}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    selectedTags: e.target.value ? [e.target.value] : []
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
              >
                <option value="">Chọn thẻ (tùy chọn)</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id} style={{ color: tag.color }}>
                    {tag.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Topics Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chủ đề (Topics)
            </label>
            {loadingData ? (
              <div className="text-sm text-gray-500">Đang tải chủ đề...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {topics.map((topic) => (
                  <label key={topic.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.selectedTopics.includes(topic.id)}
                      onChange={(e) => handleTopicChange(topic.id, e.target.checked)}
                      className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium">{topic.name}</span>
                      {topic.description && (
                        <p className="text-xs text-gray-500">{topic.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh nổi bật
            </label>
            
            {/* Image Type Selection */}
            <div className="mb-4">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    value="existing"
                    checked={formData.imageType === 'existing'}
                    onChange={(e) => handleImageTypeChange('existing')}
                    className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300"
                  />
                  <span className="ml-2 text-sm">Chọn từ thư viện</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    value="upload"
                    checked={formData.imageType === 'upload'}
                    onChange={(e) => handleImageTypeChange('upload')}
                    className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300"
                  />
                  <span className="ml-2 text-sm">Tải lên ảnh mới</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    value="url"
                    checked={formData.imageType === 'url'}
                    onChange={(e) => handleImageTypeChange('url')}
                    className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300"
                  />
                  <span className="ml-2 text-sm">Dán link ảnh</span>
                </label>
              </div>
            </div>

            {/* Existing Images */}
            {formData.imageType === 'existing' && (
              <>
                {loadingData ? (
                  <div className="text-sm text-gray-500">Đang tải hình ảnh...</div>
                ) : (
                  <select
                    name="selectedImage"
                    value={formData.selectedImage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                  >
                    <option value="">Chọn hình ảnh (tùy chọn)</option>
                    {images.map((image) => (
                      <option key={image.id} value={image.id}>
                        {image.originalName} {image.alt && `(${image.alt})`}
                      </option>
                    ))}
                  </select>
                )}
                {formData.selectedImage && (
                  <div className="mt-2">
                    {(() => {
                      const selectedImage = images.find(img => img.id === formData.selectedImage)
                      return selectedImage ? (
                        <div className="flex items-center space-x-2">
                          <img
                            src={selectedImage.path}
                            alt={selectedImage.alt || selectedImage.originalName}
                            className="w-16 h-16 object-cover rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder-image.png'
                            }}
                          />
                          <span className="text-sm text-gray-600">{selectedImage.originalName}</span>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </>
            )}

            {/* Upload New Image */}
            {formData.imageType === 'upload' && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                />
                {formData.newImageFile && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={URL.createObjectURL(formData.newImageFile)}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div>
                        <p className="text-sm font-medium">{formData.newImageFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(formData.newImageFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image URL */}
            {formData.imageType === 'url' && (
              <div>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-image.png'
                        }}
                      />
                      <span className="text-sm text-gray-600">Hình ảnh từ URL</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/posts')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-tech-blue rounded-md hover:bg-tech-dark-blue disabled:opacity-50"
            >
              {isLoading ? 'Đang tạo...' : 'Tạo bài viết'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
