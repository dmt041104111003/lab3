import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const topic = await prisma.topic.create({
      data: {
        name,
        slug,
        description: description || null
      }
    })

    return NextResponse.json(topic, { status: 201 })
  } catch (error) {
    console.error('Error creating topic:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Topic with this name already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 })
  }
}
