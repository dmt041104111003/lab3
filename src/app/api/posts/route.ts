import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug, generateUniqueSlug } from '@/lib/slug'
import { parseSessionCookie } from '@/lib/server-session'

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        slug: true,
        published: true,
        createdAt: true,
        authorName: true,
        category: true,
        subcategory: true,
        author: {
          select: {
            name: true,
            email: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        images: {
          include: {
            image: true
          }
        },
        _count: {
          select: {
            views: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách bài viết' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      content, 
      excerpt, 
      published, 
      authorId, 
      category, 
      subcategory,
      authorName,
      selectedTags = [],
      selectedImage,
      imageType,
      imageUrl,
      newImageFile
    } = await request.json()

    const sessionUser = parseSessionCookie(request.cookies.get('user_session')?.value)
    const sessionAuthorId = sessionUser?.id || null

    const resolvedAuthorId = sessionAuthorId || authorId

    if (!resolvedAuthorId) {
      return NextResponse.json(
        { message: 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại' },
        { status: 401 }
      )
    }

    const authorExists = await prisma.user.findUnique({
      where: { id: resolvedAuthorId },
      select: { id: true }
    })

    if (!authorExists) {
      return NextResponse.json(
        { message: 'Không tìm thấy tài khoản tác giả, vui lòng đăng nhập lại' },
        { status: 400 }
      )
    }


    const baseSlug = generateSlug(title)
    
    const existingPosts = await prisma.post.findMany({
      select: { slug: true }
    })
    const existingSlugs = existingPosts.map((post: { slug: string }) => post.slug)
    const uniqueSlug = await generateUniqueSlug(baseSlug, existingSlugs)

    let imageId = null
    if (imageType === 'upload') {
      if (newImageFile) {
        const { v2: cloudinary } = require('cloudinary')
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        })

        try {
          const base64Data = newImageFile.replace(/^data:image\/[a-z]+;base64,/, '')
          const buffer = Buffer.from(base64Data, 'base64')

          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                resource_type: 'auto',
                folder: 'technova',
                public_id: `image_${Date.now()}`,
              },
              (error: any, result: any) => {
                if (error) reject(error)
                else resolve(result)
              }
            ).end(buffer)
          }) as any

          const image = await prisma.image.create({
            data: {
              filename: uploadResult.public_id,
              originalName: 'uploaded-image',
              path: uploadResult.secure_url,
              size: buffer.length,
              mimeType: 'image/jpeg',
              alt: title
            }
          })
          imageId = image.id
        } catch (uploadError) {
        }
      } else if (imageUrl) {
        const image = await prisma.image.create({
          data: {
            filename: `uploaded_${Date.now()}`,
            originalName: 'Uploaded Image',
            path: imageUrl,
            size: 0,
            mimeType: 'image/jpeg',
            alt: title
          }
        })
        imageId = image.id
      }
    } else if (imageType === 'existing' && selectedImage) {
      imageId = selectedImage
    } else if (imageType === 'url' && imageUrl) {
      const image = await prisma.image.create({
        data: {
          filename: `external_${Date.now()}`,
          originalName: 'External Image',
          path: imageUrl,
          size: 0,
          mimeType: 'image/jpeg',
          alt: title
        }
      })
      imageId = image.id
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug: uniqueSlug,
        published,
        authorId: resolvedAuthorId,
        category,
        subcategory,
        authorName,

        tags: selectedTags.length > 0 ? {
          create: selectedTags.map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        } : undefined,

        images: imageId ? {
          create: {
            image: {
              connect: { id: imageId }
            }
          }
        } : undefined
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        images: {
          include: {
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Tạo bài viết thành công',
      post
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo bài viết' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { 
      id, 
      title, 
      content, 
      excerpt, 
      published, 
      category, 
      subcategory,
      authorName,
      selectedTags = [],
      selectedImage,
      imageType,
      imageUrl,
      newImageFile
    } = await request.json()


    const baseSlug = generateSlug(title)
    
    const existingPosts = await prisma.post.findMany({
      select: { slug: true },
      where: { id: { not: id } }
    })
    const existingSlugs = existingPosts.map((post: { slug: string }) => post.slug)
    const uniqueSlug = await generateUniqueSlug(baseSlug, existingSlugs)

    let imageId = null
    if (imageType === 'upload') {
      if (newImageFile) {
        const { v2: cloudinary } = require('cloudinary')
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        })

        try {
          const base64Data = newImageFile.replace(/^data:image\/[a-z]+;base64,/, '')
          const buffer = Buffer.from(base64Data, 'base64')

          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                resource_type: 'auto',
                folder: 'technova',
                public_id: `image_${Date.now()}`,
              },
              (error: any, result: any) => {
                if (error) reject(error)
                else resolve(result)
              }
            ).end(buffer)
          }) as any

          const image = await prisma.image.create({
            data: {
              filename: uploadResult.public_id,
              originalName: 'uploaded-image',
              path: uploadResult.secure_url,
              size: buffer.length,
              mimeType: 'image/jpeg',
              alt: title
            }
          })
          imageId = image.id
        } catch (uploadError) {
        }
      } else if (imageUrl) {
        const image = await prisma.image.create({
          data: {
            filename: `uploaded_${Date.now()}`,
            originalName: 'Uploaded Image',
            path: imageUrl,
            size: 0,
            mimeType: 'image/jpeg',
            alt: title
          }
        })
        imageId = image.id
      }
    } else if (imageType === 'existing' && selectedImage) {
      imageId = selectedImage
    } else if (imageType === 'url' && imageUrl) {
      const image = await prisma.image.create({
        data: {
          filename: `external_${Date.now()}`,
          originalName: 'External Image',
          path: imageUrl,
          size: 0,
          mimeType: 'image/jpeg',
          alt: title
        }
      })
      imageId = image.id
    }

    await prisma.postTag.deleteMany({
      where: { postId: id }
    })
    await prisma.postImage.deleteMany({
      where: { postId: id }
    })

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        slug: uniqueSlug,
        published,
        category,
        subcategory,
        authorName,

        tags: selectedTags.length > 0 ? {
          create: selectedTags.map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        } : undefined,

        images: imageId ? {
          create: {
            image: {
              connect: { id: imageId }
            }
          }
        } : undefined
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        images: {
          include: {
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Cập nhật bài viết thành công',
      post
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật bài viết' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID bài viết không được để trống' },
        { status: 400 }
      )
    }

    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Xóa bài viết thành công'
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xóa bài viết' },
      { status: 500 }
    )
  }
}