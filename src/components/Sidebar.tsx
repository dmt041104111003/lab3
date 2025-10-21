import Link from 'next/link'

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

export default function Sidebar() {
  const mostReadItems = [
    { title: "Bài phụ 1", href: "/bai-viet/1" },
    { title: "Bài phụ 2", href: "/bai-viet/2" },
    { title: "Bài phụ 3", href: "/bai-viet/3" }
  ]

  const quickNewsItems = [
    { title: "Bài phụ 1", href: "/bai-viet/4" },
    { title: "Bài phụ 2", href: "/bai-viet/5" }
  ]

  const techTodayItems = [
    { title: "Bài phụ 1", href: "/bai-viet/6" }
  ]

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <SidebarSection title="ĐỌC NHIỀU NHẤT" items={mostReadItems} />
      <SidebarSection title="TIN NHANH" items={quickNewsItems} />
      <SidebarSection title="CÔNG NGHỆ HÔM NAY" items={techTodayItems} />
    </aside>
  )
}
