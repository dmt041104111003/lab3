import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const { id, name } = await request.json()

    if (!id || !name || typeof name !== 'string') {
      return NextResponse.json({ message: 'Thiếu id hoặc name' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { name },
      select: { id: true, name: true, email: true, role: true, updatedAt: true }
    })

    return NextResponse.json({ message: 'Cập nhật tên thành công', user: updated })
  } catch (error) {
    return NextResponse.json({ message: 'Cập nhật tên thất bại' }, { status: 500 })
  }
}


