export interface Category {
  id: string
  name: string
  slug: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  parentId: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'tin-tuc',
    name: 'Tin tức',
    slug: 'tin-tuc',
    subcategories: [
      { id: 'cong-nghe-viet-nam', name: 'Công nghệ Việt Nam', slug: 'cong-nghe-viet-nam', parentId: 'tin-tuc' },
      { id: 'cong-nghe-the-gioi', name: 'Công nghệ thế giới', slug: 'cong-nghe-the-gioi', parentId: 'tin-tuc' }
    ]
  },
  {
    id: 'ai-chuyen-doi-so',
    name: 'AI – Chuyển đổi số',
    slug: 'ai-chuyen-doi-so',
    subcategories: [
      { id: 'tri-tue-nhan-tao', name: 'Trí tuệ nhân tạo (AI)', slug: 'tri-tue-nhan-tao', parentId: 'ai-chuyen-doi-so' },
      { id: 'du-lieu-lon-iot', name: 'Dữ liệu lớn & IoT', slug: 'du-lieu-lon-iot', parentId: 'ai-chuyen-doi-so' },
      { id: 'chuyen-doi-so-doanh-nghiep-giao-duc', name: 'Chuyển đổi số trong doanh nghiệp và giáo dục', slug: 'chuyen-doi-so-doanh-nghiep-giao-duc', parentId: 'ai-chuyen-doi-so' }
    ]
  },
  {
    id: 'doi-moi-sang-tao',
    name: 'Đổi mới sáng tạo',
    slug: 'doi-moi-sang-tao',
    subcategories: [
      { id: 'startup-viet', name: 'Startup Việt', slug: 'startup-viet', parentId: 'doi-moi-sang-tao' },
      { id: 'y-tuong-hay', name: 'Ý tưởng hay', slug: 'y-tuong-hay', parentId: 'doi-moi-sang-tao' },
      { id: 'doanh-nghiep-sang-tao', name: 'Doanh nghiệp sáng tạo', slug: 'doanh-nghiep-sang-tao', parentId: 'doi-moi-sang-tao' }
    ]
  },
  {
    id: 'san-pham-review',
    name: 'Sản phẩm & Review',
    slug: 'san-pham-review',
    subcategories: [
      { id: 'thiet-bi-moi', name: 'Thiết bị mới', slug: 'thiet-bi-moi', parentId: 'san-pham-review' },
      { id: 'ung-dung-phan-mem', name: 'Ứng dụng & phần mềm', slug: 'ung-dung-phan-mem', parentId: 'san-pham-review' },
      { id: 'danh-gia-san-pham', name: 'Đánh giá sản phẩm', slug: 'danh-gia-san-pham', parentId: 'san-pham-review' }
    ]
  },
  {
    id: 'nhan-vat-goc-nhin',
    name: 'Nhân vật & Góc nhìn',
    slug: 'nhan-vat-goc-nhin',
    subcategories: [
      { id: 'chan-dung-nha-sang-tao', name: 'Chân dung nhà sáng tạo', slug: 'chan-dung-nha-sang-tao', parentId: 'nhan-vat-goc-nhin' },
      { id: 'phong-van-chuyen-gia', name: 'Phỏng vấn chuyên gia', slug: 'phong-van-chuyen-gia', parentId: 'nhan-vat-goc-nhin' },
      { id: 'binh-luan-cong-nghe', name: 'Bình luận công nghệ', slug: 'binh-luan-cong-nghe', parentId: 'nhan-vat-goc-nhin' }
    ]
  },
  {
    id: 'multimedia',
    name: 'Multimedia',
    slug: 'multimedia',
    subcategories: [
      { id: 'video', name: 'Video', slug: 'video', parentId: 'multimedia' },
      { id: 'anh', name: 'Ảnh', slug: 'anh', parentId: 'multimedia' },
      { id: 'infographic', name: 'Infographic', slug: 'infographic', parentId: 'multimedia' }
    ]
  },
  {
    id: 'xu-huong-tuong-lai',
    name: 'Xu hướng tương lai',
    slug: 'xu-huong-tuong-lai',
    subcategories: [
      { id: 'blockchain', name: 'Blockchain', slug: 'blockchain', parentId: 'xu-huong-tuong-lai' },
      { id: 'cong-nghe-xanh', name: 'Công nghệ xanh (GreenTech)', slug: 'cong-nghe-xanh', parentId: 'xu-huong-tuong-lai' },
      { id: 'metaverse', name: 'Metaverse', slug: 'metaverse', parentId: 'xu-huong-tuong-lai' }
    ]
  },
  {
    id: 'ban-doc',
    name: 'Bạn đọc',
    slug: 'ban-doc',
    subcategories: []
  }
]

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(category => category.id === id)
}

export function getSubcategoryById(id: string): Subcategory | undefined {
  for (const category of CATEGORIES) {
    const subcategory = category.subcategories.find(sub => sub.id === id)
    if (subcategory) return subcategory
  }
  return undefined
}

export function getAllSubcategories(): Subcategory[] {
  return CATEGORIES.flatMap(category => category.subcategories)
}
