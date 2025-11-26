import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const achievementsDir = join(process.cwd(), 'public', 'thanh-tich')
    const files = await readdir(achievementsDir)
    
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
    )
    
    const images = imageFiles.map(file => ({
      filename: file,
      path: `/thanh-tich/${file}`,
      alt: file.replace(/\.[^/.]+$/, '') 
    }))
    
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error reading achievements folder:', error)
    return NextResponse.json(
      { error: 'Failed to read achievements folder' },
      { status: 500 }
    )
  }
}


