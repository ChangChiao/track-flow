import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { handleError, createUnauthorizedError } from '@/lib/utils/error-handler'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw createUnauthorizedError()
    }

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const role = searchParams.get('role')
    
    // 建立查詢條件
    const where: any = {}
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (role) {
      where.role = role
    }

    // 取得使用者資料
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        department: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { isActive: 'desc' },  // 活躍使用者優先
        { name: 'asc' },       // 按姓名排序
      ],
    })

    return NextResponse.json({
      data: users,
    })
  } catch (error) {
    return handleError(error)
  }
}