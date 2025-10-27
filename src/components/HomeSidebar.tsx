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
      <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="text-gray-600 text-xs">
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
  techToday?: Post[]
  mostRead?: Post[]
}

export default function HomeSidebar({ quickNews = [], techToday = [], mostRead = [] }: HomeSidebarProps) {
  const mostReadItems = mostRead.length > 0 ? mostRead.slice(0, 3).map(post => ({
    title: post.title,
    href: `/tin-tuc/${post.subcategory || 'cong-nghe-viet-nam'}/${post.slug}`
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

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <SidebarSection title="ĐỌC NHIỀU NHẤT" items={mostReadItems} />
      <SidebarSection title="TIN NHANH" items={quickNewsItems} />
      <SidebarSection title="CÔNG NGHỆ HÔM NAY" items={techTodayItems} />
    </aside>
  )
}
