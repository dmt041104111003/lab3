import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
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

    // Get image record first
    const image = await prisma.image.findUnique({
      where: { id }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(image.filename)
    } catch (cloudinaryError) {
      console.warn('Failed to delete image from Cloudinary:', cloudinaryError)
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await prisma.image.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
