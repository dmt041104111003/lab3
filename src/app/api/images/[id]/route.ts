import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const image = await prisma.image.findUnique({
      where: { id }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    try {
      await cloudinary.uploader.destroy(image.filename)
    } catch (cloudinaryError) {
    }

    await prisma.image.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
