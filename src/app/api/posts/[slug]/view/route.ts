import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDeviceFingerprint } from '@/lib/device-fingerprint'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { deviceData } = await request.json()

    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true, published: true }
    })

    if (!post) {
      return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 })
    }

    if (!post.published) {
      return NextResponse.json({ error: 'Bài viết chưa được xuất bản' }, { status: 403 })
    }

    const deviceFingerprint = await generateDeviceFingerprint(deviceData.userAgent, deviceData)

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
    
    const existingView = await prisma.postView.findFirst({
      where: {
        postId: post.id,
        deviceFingerprint,
        viewedAt: {
          gte: fifteenMinutesAgo
        }
      }
    })

    if (!existingView) {
      await prisma.postView.create({
        data: {
          postId: post.id,
          deviceFingerprint,
          viewedAt: new Date()
        }
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    return NextResponse.json({ error: 'Lỗi tracking view' }, { status: 500 })
  }
}
