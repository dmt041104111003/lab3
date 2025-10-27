import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDeviceFingerprint } from '@/lib/device-fingerprint'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'unread'
    const deviceData = JSON.parse(searchParams.get('deviceData') || '{}')
    
    const fingerprint = await generateDeviceFingerprint(deviceData.userAgent || '', deviceData)
    
    if (type === 'unread') {
      const unreadPosts = await prisma.post.findMany({
        where: {
          published: true,
          NOT: {
            views: {
              some: {
                deviceFingerprint: fingerprint
              }
            }
          }
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          createdAt: true,
          category: true,
          subcategory: true,
          authorName: true,
          images: {
            select: {
              image: {
                select: {
                  path: true,
                  alt: true
                }
              }
            },
            take: 1
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      })

      return NextResponse.json({
        success: true,
        notifications: unreadPosts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          createdAt: post.createdAt,
          category: post.category,
          subcategory: post.subcategory,
          authorName: post.authorName,
          image: post.images[0]?.image?.path || null,
          imageAlt: post.images[0]?.image?.alt || null
        }))
      })
    } else if (type === 'read') {
      const readPosts = await prisma.post.findMany({
        where: {
          published: true,
          views: {
            some: {
              deviceFingerprint: fingerprint
            }
          }
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          createdAt: true,
          category: true,
          subcategory: true,
          authorName: true,
          images: {
            select: {
              image: {
                select: {
                  path: true,
                  alt: true
                }
              }
            },
            take: 1
          },
          views: {
            where: {
              deviceFingerprint: fingerprint
            },
            select: {
              viewedAt: true
            },
            orderBy: {
              viewedAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      })

      return NextResponse.json({
        success: true,
        notifications: readPosts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          createdAt: post.createdAt,
          viewedAt: post.views[0]?.viewedAt,
          category: post.category,
          subcategory: post.subcategory,
          authorName: post.authorName,
          image: post.images[0]?.image?.path || null,
          imageAlt: post.images[0]?.image?.alt || null
        }))
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid type parameter'
    }, { status: 400 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, deviceData } = await request.json()
    
    if (!deviceData) {
      return NextResponse.json({
        success: false,
        error: 'Device data is required'
      }, { status: 400 })
    }

    const fingerprint = await generateDeviceFingerprint(deviceData.userAgent || '', deviceData)
    
    if (type === 'count') {
      const unreadCount = await prisma.post.count({
        where: {
          published: true,
          NOT: {
            views: {
              some: {
                deviceFingerprint: fingerprint
              }
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        count: unreadCount
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid type parameter'
    }, { status: 400 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
