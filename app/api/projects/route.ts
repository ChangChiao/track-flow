import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { handleError, createUnauthorizedError } from '@/lib/utils/error-handler'
import { paginationSchema } from '@/lib/utils/validation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { calculateProgress } from '@/lib/types/project'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw createUnauthorizedError()
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const responsiblePersonId = searchParams.get('responsiblePersonId')
    
    const { page: validPage, limit: validLimit } = paginationSchema.parse({ page, limit })

    // 建立查詢條件
    const where: any = {}
    if (status) {
      where.status = status
    }
    if (responsiblePersonId) {
      where.responsiblePersonId = responsiblePersonId
    }

    // 計算總數
    const total = await prisma.project.count({ where })
    
    // 取得專案資料
    const projects = await prisma.project.findMany({
      where,
      include: {
        responsiblePerson: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (validPage - 1) * validLimit,
      take: validLimit,
    })

    // 計算每個專案的進度
    const projectsWithProgress = projects.map((project: any) => ({
      ...project,
      progress: calculateProgress(project.startDate, project.endDate),
    }))

    const totalPages = Math.ceil(total / validLimit)

    return NextResponse.json({
      data: projectsWithProgress,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw createUnauthorizedError()
    }

    // 檢查權限（需要 EDITOR 或 ADMIN 角色）
    if (session.user.role === 'VIEWER') {
      throw createUnauthorizedError()
    }

    const body = await request.json()
    
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        responsiblePersonId: body.responsiblePersonId || null,
      },
      include: {
        responsiblePerson: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    // 記錄歷史
    await prisma.projectHistory.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        action: 'CREATE',
        changes: JSON.stringify({
          action: '建立專案',
          details: `建立專案：${project.name}`,
        }),
      },
    })

    const projectWithProgress = {
      ...project,
      progress: calculateProgress(project.startDate, project.endDate),
    }

    return NextResponse.json(projectWithProgress, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}