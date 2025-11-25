'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const getFooterLinkClasses = (path: string) => {
    const base = 'transition-colors text-sm font-medium'
    const active = 'text-tech-blue'
    const inactive = 'text-gray-700 hover:text-tech-blue'
    return `${base} ${isActive(path) ? active : inactive}`
  }
  return (
    <footer className="bg-[#F5F4F0] text-gray-900 border-t border-[#D9D3C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <Image 
              src="/lab3.jpg" 
              alt="LAB3 Logo" 
              width={120} 
              height={60}
              className="mb-2"
            />
            {/* <div className="text-sm text-gray-300 text-center">
              CÔNG NGHỆ & ĐỜI SỐNG
            </div> */}
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link href="/tin-tuc" className={getFooterLinkClasses('/tin-tuc')}>
              TIN TỨC
            </Link>
            <Link href="/proposal" className={getFooterLinkClasses('/proposal')}>
              PROPOSAL
            </Link>
            <Link href="/team" className={getFooterLinkClasses('/team')}>
              TEAM
            </Link>
          </div>
        </div>
      </div>
      
      <div className="w-full h-0.5 bg-[#CFC8BB]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-sm">
              <div className="mb-4">
                <h3 className="font-bold text-sm mb-2">LIÊN HỆ</h3>
                <p className="text-sm leading-relaxed">
                  LAB3 là trang web chuyên cập nhật tin tức công nghệ. Liên hệ với chúng tôi để chia sẻ thông tin, gửi bài cộng tác hoặc đề xuất nội dung.
                </p>
           
              </div>
              
              <div className="mb-4">
                <p className="text-sm">© 2025 LAB3</p>
                <p className="text-sm">Bản tin công nghệ & đời sống số dành cho cộng đồng sáng tạo Việt Nam.</p>
              </div>
              
              <Link href="/chinh-sach-bao-mat" className="text-gray-700 hover:text-tech-blue transition-colors text-sm">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-sm mb-3">VỀ LAB3</h3>
              <p className="text-sm leading-relaxed mb-4">
                LAB3 là chuyên trang tin công nghệ mang tới phân tích chuyên sâu, câu chuyện nhân vật và cập nhật xu hướng giúp độc giả nắm bắt nhịp chuyển đổi số trong nước và quốc tế.
              </p>
              
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2">CAM KẾT</h4>
                <p className="text-xs leading-relaxed mb-2">
                  LAB3 ưu tiên nguồn tin xác thực, kiểm chứng đa chiều và tôn trọng chuẩn mực báo chí để mang đến trải nghiệm đọc đáng tin cậy.
                </p>
                <p className="text-xs leading-relaxed mb-2">
                  Đội ngũ biên tập viên và cộng tác viên giàu kinh nghiệm sẵn sàng đồng hành cùng cộng đồng công nghệ, startup và nhà quản lý.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button className="bg-tech-blue hover:bg-tech-dark-blue text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Theo dõi
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  RSS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
