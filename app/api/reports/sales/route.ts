// app/api/reports/sales/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  subDays, 
  subMonths, 
  startOfDay,
  endOfDay,
  format,
  eachDayOfInterval,
  eachMonthOfInterval
} from 'date-fns'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || 'month'

    let startDate = new Date()
    let dateFormat = ''
    let interval: Date[]

    switch (range) {
      case 'week':
        startDate = subDays(new Date(), 7)
        dateFormat = 'MMM d'
        interval = eachDayOfInterval({ start: startDate, end: new Date() })
        break
      case 'month':
        startDate = subDays(new Date(), 30)
        dateFormat = 'MMM d'
        interval = eachDayOfInterval({ start: startDate, end: new Date() })
        break
      case 'year':
        startDate = subMonths(new Date(), 12)
        dateFormat = 'MMM yyyy'
        interval = eachMonthOfInterval({ start: startDate, end: new Date() })
        break
    }

    // Get sales data
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    })

    // Process data for chart
    const trend = interval.map(date => {
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return range === 'year'
          ? orderDate.getMonth() === date.getMonth() && 
            orderDate.getFullYear() === date.getFullYear()
          : orderDate.toDateString() === date.toDateString()
      })

      return {
        date: format(date, dateFormat),
        sales: dayOrders.reduce((sum, order) => sum + order.total, 0),
        orders: dayOrders.length,
      }
    })

    return NextResponse.json({ trend })
  } catch (error) {
    console.error('Failed to fetch sales data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    )
  }
}


