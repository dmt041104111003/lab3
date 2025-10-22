import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, color } = await request.json()
    const { id } = params

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
        color: color || '#3B82F6'
      }
    })

    return NextResponse.json(tag)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Tag with this name already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.tag.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}
