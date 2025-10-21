# TechNova - Công nghệ & Đời sống

Trang báo mạng điện tử chuyên về công nghệ và đổi mới sáng tạo tại Việt Nam.

## Tính năng

- **Trang chủ**: Layout 2 cột với nội dung chính và sidebar
- **Chuyên mục**: Tin tức, AI - Chuyển đổi số, Đổi mới sáng tạo, Sản phẩm & Review, Xu hướng tương lai
- **Tiểu mục**: Các trang con cho từng lĩnh vực chuyên sâu
- **Đăng nhập/Đăng ký**: Hệ thống authentication với database thật
- **Responsive**: Tối ưu cho mọi thiết bị
- **SEO**: Tối ưu hóa cho công cụ tìm kiếm

## Công nghệ sử dụng

- **Next.js 14**: Framework React với App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Prisma**: ORM cho database
- **PostgreSQL**: Database chính
- **bcryptjs**: Hash password
- **Google Fonts**: Paytone One, Asap, Roboto

## Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd technova
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình database
```bash
# Copy file environment
cp env.example .env.local

# Cập nhật DATABASE_URL trong .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/technova"
```

### 4. Setup database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Hoặc tạo migration
npm run db:migrate
```

### 5. Chạy development server
```bash
npm run dev
```

## Database Schema

### User Model
- `id`: String (Primary Key)
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum (USER, ADMIN)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Post Model
- `id`: String (Primary Key)
- `title`: String
- `content`: String (Optional)
- `excerpt`: String (Optional)
- `slug`: String (Unique)
- `published`: Boolean
- `authorId`: String (Foreign Key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Scripts

- `npm run dev`: Chạy development server
- `npm run build`: Build cho production
- `npm run start`: Chạy production server
- `npm run lint`: Kiểm tra code style
- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push schema changes
- `npm run db:migrate`: Tạo migration
- `npm run db:studio`: Mở Prisma Studio

## Cấu trúc dự án

```
src/
├── app/                    # App Router pages
│   ├── page.tsx           # Trang chủ
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Đăng nhập
│   │   └── signup/        # Đăng ký
│   ├── api/               # API routes
│   │   └── auth/          # Auth API
│   ├── tin-tuc/           # Chuyên mục Tin tức
│   ├── ai-chuyen-doi-so/  # Chuyên mục AI
│   ├── doi-moi-sang-tao/  # Chuyên mục Đổi mới
│   ├── san-pham-review/   # Chuyên mục Sản phẩm
│   └── xu-huong-tuong-lai/ # Chuyên mục Xu hướng
├── components/             # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   ├── SectionBanner.tsx
│   ├── ArticleCard.tsx
│   └── ContentSection.tsx
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # Auth configuration
└── globals.css            # Global styles
```

## Bộ nhận diện thương hiệu

- **Logo**: TechNova với font Paytone One
- **Màu chủ đạo**: Lam nhạt (#38b6ff) và Xanh da trời (#165a87)
- **Typography**: Roboto, Asap, Paytone One
- **Slogan**: "Công nghệ & Đời sống"

## Chuyên mục

1. **Tin tức**
   - Công nghệ Việt Nam
   - Công nghệ thế giới

2. **AI – Chuyển đổi số**
   - Trí tuệ nhân tạo (AI)
   - Dữ liệu lớn & IoT
   - Chuyển đổi số trong doanh nghiệp và giáo dục

3. **Đổi mới sáng tạo**
   - Startup Việt
   - Ý tưởng hay
   - Doanh nghiệp sáng tạo

4. **Sản phẩm & Review**
   - Thiết bị mới
   - Ứng dụng & phần mềm
   - Đánh giá sản phẩm

5. **Xu hướng tương lai**
   - Blockchain
   - Công nghệ xanh (GreenTech)
   - Metaverse

## Phát triển

Dự án được phát triển với Next.js 14, TypeScript, Prisma ORM và PostgreSQL database.