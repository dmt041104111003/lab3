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
  subcategoryLinks?: Array<{
    title: string
    href: string
  }>
}

function SidebarSection({ title, items, subcategoryLinks }: SidebarSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
        {title}
      </h3>
      {subcategoryLinks && subcategoryLinks.length > 0 && (
        <div className="space-y-2 mb-4">
          {subcategoryLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="block text-gray-700 text-xs hover:text-red-600 transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 min-h-[60px]"
          >
            <div className="text-gray-600 text-xs line-clamp-2 h-full flex items-center" title={item.title}>
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

interface HomeSidebarProps {
  quickNews?: Post[]
  mostRead?: Post[]
}

export default function HomeSidebar({ 
  quickNews = [], 
  mostRead = []
}: HomeSidebarProps) {
  const mostReadItems = mostRead.length > 0 ? mostRead.slice(0, 5).map(post => ({
    title: post.title,
    href: `/tin-tuc/${post.subcategory || 'cong-nghe-viet-nam'}/${post.slug}`
  })) : []

  const quickNewsItems = quickNews.length > 0 ? quickNews.slice(0, 5).map(post => ({
    title: post.title,
    href: `/tin-tuc/${post.subcategory || 'cong-nghe-viet-nam'}/${post.slug}`
  })) : []

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <SidebarSection title="ĐỌC NHIỀU NHẤT" items={mostReadItems} />
      <SidebarSection title="TIN NHANH" items={quickNewsItems} />
    </aside>
  )
}
