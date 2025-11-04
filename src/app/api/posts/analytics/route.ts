import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const viewType = searchParams.get('viewType') || 'day' 
    
    const getDateKey = (utcDate: Date, type: string): string => {
      const vnDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000)
      
      if (type === 'year') {
        return vnDate.getUTCFullYear().toString()
      } else if (type === 'month') {
        return `${vnDate.getUTCFullYear()}-${String(vnDate.getUTCMonth() + 1).padStart(2, '0')}`
      } else {
        const year = vnDate.getUTCFullYear()
        const month = String(vnDate.getUTCMonth() + 1).padStart(2, '0')
        const day = String(vnDate.getUTCDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    }
    
    const now = new Date()
    const nowVN = new Date(now.getTime() + 7 * 60 * 60 * 1000)
    let startDate: Date
    
    if (viewType === 'month') {
      startDate = new Date(Date.UTC(nowVN.getUTCFullYear(), nowVN.getUTCMonth() - 11, 1))
      startDate.setTime(startDate.getTime() - 7 * 60 * 60 * 1000) // Convert về UTC
    } else if (viewType === 'year') {
      startDate = new Date(Date.UTC(nowVN.getUTCFullYear() - 4, 0, 1))
      startDate.setTime(startDate.getTime() - 7 * 60 * 60 * 1000) 
    } else {
      const vnStartDate = new Date(Date.UTC(nowVN.getUTCFullYear(), nowVN.getUTCMonth(), nowVN.getUTCDate() - 29))
      vnStartDate.setUTCHours(0, 0, 0, 0)
      startDate = new Date(vnStartDate.getTime() - 7 * 60 * 60 * 1000) 
    }
    
    const views = await prisma.postView.findMany({
      where: {
        viewedAt: {
          gte: startDate
        }
      },
      select: {
        viewedAt: true,
        postId: true
      }
    })
    
    const comments = await prisma.comment.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
        postId: true
      }
    })
    
    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        published: true
      },
      select: {
        createdAt: true
      }
    })
    
    const dataMap = new Map<string, { views: number, comments: number, posts: number }>()
    const periods: string[] = []
    
    // Tạo periods theo múi giờ Việt Nam
    if (viewType === 'year') {
      for (let i = 0; i < 5; i++) {
        const year = nowVN.getUTCFullYear() - 4 + i
        const yearStr = year.toString()
        periods.push(yearStr)
        dataMap.set(yearStr, { views: 0, comments: 0, posts: 0 })
      }
    } else if (viewType === 'month') {
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(Date.UTC(nowVN.getUTCFullYear(), nowVN.getUTCMonth() - 11 + i, 1))
        const monthStr = getDateKey(monthDate, 'month')
        periods.push(monthStr)
        dataMap.set(monthStr, { views: 0, comments: 0, posts: 0 })
      }
    } else {
      const vnStartDate = new Date(Date.UTC(nowVN.getUTCFullYear(), nowVN.getUTCMonth(), nowVN.getUTCDate() - 29))
      vnStartDate.setUTCHours(0, 0, 0, 0)
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(vnStartDate)
        date.setUTCDate(vnStartDate.getUTCDate() + i)
        const dateStr = getDateKey(date, 'day')
        periods.push(dateStr)
        dataMap.set(dateStr, { views: 0, comments: 0, posts: 0 })
      }
    }
    
    views.forEach(view => {
      const key = getDateKey(new Date(view.viewedAt), viewType)
      const existing = dataMap.get(key)
      if (existing) {
        existing.views++
      }
    })
    
    comments.forEach(comment => {
      const key = getDateKey(new Date(comment.createdAt), viewType)
      const existing = dataMap.get(key)
      if (existing) {
        existing.comments++
      }
    })
    
    posts.forEach(post => {
      const postDate = new Date(post.createdAt)
      
      if (isNaN(postDate.getTime())) {
        return
      }
      
      const key = getDateKey(postDate, viewType)
      const existing = dataMap.get(key)
      
      if (existing) {
        existing.posts++
      }
    })
    
    const result = periods
      .map(period => ({
        date: period,
        views: dataMap.get(period)?.views || 0,
        comments: dataMap.get(period)?.comments || 0,
        posts: dataMap.get(period)?.posts || 0
      }))
      .filter(item => item.date)
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy dữ liệu phân tích' },
      { status: 500 }
    )
  }
}

