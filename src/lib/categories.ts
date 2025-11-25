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
    id: 'proposal',
    name: 'Proposal',
    slug: 'proposal',
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
