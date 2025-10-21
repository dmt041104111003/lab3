import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description } = await request.json()
    const { id } = params

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const topic = await prisma.topic.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null
      }
    })

    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error updating topic:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Topic with this name already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.topic.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 })
  }
}
