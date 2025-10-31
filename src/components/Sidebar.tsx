import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug: string
  subcategory?: string
}

interface SidebarSectionProps {
  title: string
  items: Array<{
    title: string
    href: string
  }>
}

function SidebarSection({ title, items }: SidebarSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="text-gray-600 text-sm">
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

interface Subcategory {
  id: string
  name: string
  slug: string
  parentId: string
}

interface SidebarProps {
  quickNews?: Post[]
  techToday?: Post[]
  mostRead?: Post[]
  subcategories?: Subcategory[]
  basePath?: string
  title?: string
  subcategoryCounts?: Record<string, number>
  subcategoryPosts?: Record<string, any[]>
}

export default function Sidebar({ quickNews = [], techToday = [], mostRead = [], subcategories = [], basePath = '', title = '', subcategoryCounts = {}, subcategoryPosts = {} }: SidebarProps) {
  const mostReadItems = mostRead.length > 0 ? mostRead.slice(0, 3).map(post => ({
    title: post.title,
    href: `/bai-viet/${post.slug}`
  })) : [
    { title: "Bài viết sắp ra mắt", href: "#" },
    { title: "Bài viết sắp ra mắt", href: "#" },
    { title: "Bài viết sắp ra mắt", href: "#" }
  ]

  const quickNewsItems = quickNews.length > 0 ? quickNews.slice(0, 2).map(post => ({
    title: post.title,
    href: `/xu-huong-tuong-lai/${post.subcategory || 'blockchain'}/${post.slug}`
  })) : [
    { title: "Tin nhanh sắp ra mắt", href: "#" },
    { title: "Tin nhanh sắp ra mắt", href: "#" }
  ]

  const techTodayItems = techToday.length > 0 ? techToday.slice(0, 1).map(post => ({
    title: post.title,
    href: `/ai-chuyen-doi-so/${post.subcategory || 'tri-tue-nhan-tao'}/${post.slug}`
  })) : [
    { title: "Công nghệ sắp ra mắt", href: "#" }
  ]

  const subcategoryItems = subcategories.length > 0 ? subcategories.map(sub => ({
    title: sub.name,
    href: `/${basePath}/${sub.slug}`
  })) : []

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {subcategories.length > 0 && (
        <div className="mb-8">
          <div className="space-y-4">
            {subcategories.map((subcategory) => (
              <div key={subcategory.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <a
                  href={`/${basePath}/${subcategory.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <h4 className="text-sm font-semibold text-gray-900">
                    {subcategory.name}
                  </h4>
                  {typeof subcategoryCounts[subcategory.id] === 'number' && (
                    <span className="ml-3 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      {subcategoryCounts[subcategory.id]}
                    </span>
                  )}
                </a>

                {Array.isArray(subcategoryPosts[subcategory.id]) && subcategoryPosts[subcategory.id].length > 0 && (
                  <div className="px-4 pb-3 space-y-3">
                    {subcategoryPosts[subcategory.id].map((post: any) => (
                      <a
                        key={post.id}
                        href={`/${post.category || basePath}/${post.subcategory}/${post.slug}`}
                        className="flex space-x-3 group"
                      >
                        {post.images?.[0]?.image?.path && (
                          <img
                            src={post.images[0].image.path}
                            alt={post.images[0].image.alt || post.title}
                            className="w-14 aspect-video object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span 
                              className="text-xs text-gray-700 group-hover:text-gray-900 line-clamp-2"
                              title={post.title}
                            >
                              {post.title}
                            </span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] uppercase">New</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
