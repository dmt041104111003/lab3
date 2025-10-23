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
    const active = 'text-blue-400'
    const inactive = 'text-white hover:text-blue-400'
    return `${base} ${isActive(path) ? active : inactive}`
  }
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <Image 
              src="/footer.png" 
              alt="TechNova Logo" 
              width={200} 
              height={80}
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
            <Link href="/ai-chuyen-doi-so" className={getFooterLinkClasses('/ai-chuyen-doi-so')}>
              AI - CHUYỂN ĐỔI SỐ
            </Link>
            <Link href="/doi-moi-sang-tao" className={getFooterLinkClasses('/doi-moi-sang-tao')}>
              ĐỔI MỚI SÁNG TẠO
            </Link>
            <Link href="/san-pham-review" className={getFooterLinkClasses('/san-pham-review')}>
              SẢN PHẨM & REVIEW
            </Link>
            <Link href="/xu-huong-tuong-lai" className={getFooterLinkClasses('/xu-huong-tuong-lai')}>
              XU HƯỚNG TƯƠNG LAI
            </Link>
            <Link href="/nhan-vat-goc-nhin" className={getFooterLinkClasses('/nhan-vat-goc-nhin')}>
              NHÂN VẬT & GÓC NHÌN
            </Link>
            <Link href="/multimedia" className={getFooterLinkClasses('/multimedia')}>
              MULTIMEDIA
            </Link>
          </div>
        </div>
      </div>
      
      <div className="w-full h-0.5 bg-blue-400"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-sm">
              <div className="mb-4">
                <h3 className="font-bold text-sm mb-2">LIÊN HỆ</h3>
                <p className="text-sm leading-relaxed">
                  Tầng 2, Tòa nhà A2 Học viện Báo chí và Tuyên truyền, số 36, đường Xuân Thủy, phường Cầu Giấy, thành phố Hà Nội
                </p>
                <p className="text-sm">Đường dây nóng: +84942017238</p>
                <p className="text-sm">
                  Email: <span className="text-blue-400">technovatintuc@gmail.com</span>
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm">© Copyright 2025 - TechNova</p>
                <p className="text-sm">Công nghệ & Đời sống</p>
              </div>
              
              <Link href="/chinh-sach-bao-mat" className="text-white hover:text-blue-400 transition-colors text-sm">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-sm mb-3">VỀ TECHNOVA</h3>
              <p className="text-sm leading-relaxed mb-4">
                TechNova là trang tin công nghệ hàng đầu, tập trung vào xu hướng công nghệ mới và tác động của chúng tới đời sống con người.
              </p>
              
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2">THÔNG TIN PHÁP LÝ</h4>
                <p className="text-xs leading-relaxed mb-2">
                  <strong>Cơ quan chủ quản:</strong> Hội Tin học Việt Nam
                </p>
                <p className="text-xs leading-relaxed mb-2">
                  <strong>Giấy phép:</strong> Số 207/GP-TTĐT (31/10/2019) - Số 93/GP-TTĐT (10/05/2024)
                </p>
                <p className="text-xs leading-relaxed mb-2">
                  <strong>Chịu trách nhiệm chính:</strong> Tổng biên tập Tạp chí Công nghệ TechNova: Dương Trương Quỳnh Trang
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
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
