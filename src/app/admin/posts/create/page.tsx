'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCard from '@/components/admin/AdminCard'
import AdminFormField from '@/components/admin/AdminFormField'
import AdminInput from '@/components/admin/AdminInput'
import AdminTextarea from '@/components/admin/AdminTextarea'
import { TipTapEditor } from '@/components/tiptap-editor'
import AdminSelect from '@/components/admin/AdminSelect'
import AdminCheckbox from '@/components/admin/AdminCheckbox'
import AdminButton from '@/components/admin/AdminButton'
import AdminErrorAlert from '@/components/admin/AdminErrorAlert'
import AdminImageUpload from '@/components/admin/AdminImageUpload'
import { CATEGORIES, type Category, type Subcategory } from '@/lib/categories'
import { generateSlug } from '@/lib/slug'

interface Tag {
  id: string
  name: string
  color: string
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
    published: false,
    selectedTags: [] as string[],
    selectedImage: '',
    imageType: 'existing' as 'existing' | 'upload' | 'url',
    newImageFile: null as File | null,
    imageUrl: '',
    category: '',
    subcategory: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [titleError, setTitleError] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [currentUser, setCurrentUser] = useState<{id: string} | null>(null)

  useEffect(() => {
    fetchData()
    fetchCurrentUser()
  }, [])

  const fetchData = async () => {
    try {
      const [tagsRes, imagesRes] = await Promise.all([
        fetch('/api/tags'),
        fetch('/api/images')
      ])

      const [tagsData, imagesData] = await Promise.all([
        tagsRes.json(),
        imagesRes.json()
      ])

      setTags(tagsData)
      setImages(imagesData)
    } catch (error) {
    } finally {
      setLoadingData(false)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/check-admin')
      const data = await response.json()
      if (data.isAdmin) {
        const userSession = document.cookie
          .split('; ')
          .find(row => row.startsWith('user_session='))
          ?.split('=')[1]
        
        if (userSession) {
          const user = JSON.parse(decodeURIComponent(userSession))
          setCurrentUser({ id: user.id })
        }
      }
    } catch (error) {
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setTitleError('')

    if (!formData.title.trim()) {
      setTitleError('Tiêu đề không được để trống')
      setIsLoading(false)
      return
    }

    if (!formData.content.trim()) {
      setError('Nội dung bài viết không được để trống')
      setIsLoading(false)
      return
    }

    if (!formData.category) {
      setError('Vui lòng chọn chuyên mục')
      setIsLoading(false)
      return
    }

    if (!formData.subcategory) {
      setError('Vui lòng chọn tiểu mục')
      setIsLoading(false)
      return
    }

    const titleValidationError = await validateTitle(formData.title)
    if (titleValidationError) {
      setTitleError(titleValidationError)
      setIsLoading(false)
      return
    }

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
          published: formData.published,
          selectedTags: formData.selectedTags,
          selectedImage: formData.selectedImage,
          imageType: formData.imageType,
          imageUrl: formData.imageUrl,
          category: formData.category,
          subcategory: formData.subcategory,
          authorId: currentUser?.id || 'cmh10oekw0001x8rjt3cati7w'
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

  const validateTitle = async (title: string) => {
    if (!title.trim()) {
      return 'Tiêu đề không được để trống'
    }
    
    try {
      const response = await fetch('/api/posts')
      const posts = await response.json()
      const isDuplicate = posts.some((post: any) => 
        post.title.toLowerCase().trim() === title.toLowerCase().trim()
      )
      
      if (isDuplicate) {
        return 'Tiêu đề này đã tồn tại, vui lòng chọn tiêu đề khác'
      }
    } catch (error) {
    }
    
    return ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      
      if (name === 'title') {
        setTitleError('')
        if (value.trim()) {
          setTimeout(async () => {
            const error = await validateTitle(value)
            setTitleError(error)
          }, 500)
        }
      }
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
      <AdminPageHeader 
        title="Tạo bài viết mới"
        description="Viết và xuất bản bài viết mới"
        backButton={{
          text: "Quay lại danh sách bài viết",
          href: "/admin/posts"
        }}
      />

      <AdminCard title="Thông tin bài viết">
        <form onSubmit={handleSubmit}>
          <AdminErrorAlert message={error} />

          <AdminFormField label="Tiêu đề bài viết" required>
            <AdminInput
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
            {titleError && (
              <div className="mt-1 text-sm text-red-600">
                {titleError}
              </div>
            )}
            {formData.title && !titleError && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">URL sẽ là:</span> 
                <span className="ml-2 text-tech-blue font-mono">
                  /{generateSlug(formData.title)}
                </span>
              </div>
            )}
          </AdminFormField>

          <AdminFormField label="Mô tả ngắn">
            <AdminTextarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Nhập mô tả ngắn về bài viết"
              rows={3}
            />
          </AdminFormField>

          <AdminCheckbox
            name="published"
            checked={formData.published}
            onChange={handleChange}
            label="Xuất bản bài viết"
            helpText="Bài viết sẽ hiển thị công khai khi được xuất bản"
          />

          <AdminFormField label="Nội dung bài viết" required>
            <TipTapEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="Viết nội dung bài viết..."
            />
          </AdminFormField>

          <AdminFormField label="Chuyên mục" required>
            <AdminSelect
              name="category"
              value={formData.category}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  category: e.target.value,
                  subcategory: ''
                })
              }}
              options={CATEGORIES.map(cat => ({ value: cat.id, label: cat.name }))}
              placeholder="Chọn chuyên mục"
              required
            />
          </AdminFormField>

          {formData.category && (
            <AdminFormField label="Tiểu mục" required>
              <AdminSelect
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                options={CATEGORIES.find(cat => cat.id === formData.category)?.subcategories.map(sub => ({ 
                  value: sub.id, 
                  label: sub.name 
                })) || []}
                placeholder="Chọn tiểu mục"
                required
              />
            </AdminFormField>
          )}

          <AdminFormField label="Thẻ (Tags)">
            {loadingData ? (
              <div className="text-sm text-gray-500">Đang tải thẻ...</div>
            ) : (
              <AdminSelect
                name="selectedTags"
                value={formData.selectedTags[0] || ''}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    selectedTags: e.target.value ? [e.target.value] : []
                  })
                }}
                options={tags.map(tag => ({ 
                  value: tag.id, 
                  label: tag.name, 
                  color: tag.color 
                }))}
                placeholder="Chọn thẻ (tùy chọn)"
              />
            )}
          </AdminFormField>


          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh nổi bật
            </label>
            
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
                    aria-label="Chọn hình ảnh"
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

            {formData.imageType === 'upload' && (
              <AdminImageUpload
                onImageUploaded={(url) => {
                  setFormData(prev => ({ ...prev, imageUrl: url }))
                }}
                onError={setError}
                disabled={isLoading}
              />
            )}

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
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin/posts')}
            >
              Hủy
            </AdminButton>
            <AdminButton
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Tạo bài viết
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </AdminLayout>
  )
}
