import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { handleError, createUnauthorizedError, createNotFoundError } from '@/lib/utils/error-handler'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { calculateProgress } from '@/lib/types/project'
import { validateProjectDates } from '@/lib/utils/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw createUnauthorizedError()
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
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

    if (!project) {
      throw createNotFoundError('專案不存在')
    }

    const projectWithProgress = {
      ...project,
      progress: calculateProgress(project.startDate, project.endDate),
    }

    return NextResponse.json(projectWithProgress)
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // 驗證日期
    const dateValidation = validateProjectDates(body.startDate, body.endDate)
    if (!dateValidation.isValid) {
      return NextResponse.json(
        { message: dateValidation.error || '日期驗證失敗', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // 檢查專案是否存在
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!existingProject) {
      throw createNotFoundError('專案不存在')
    }

    // 記錄變更內容
    const changes: any = {}
    if (body.name !== existingProject.name) changes.name = { from: existingProject.name, to: body.name }
    if (body.description !== existingProject.description) changes.description = { from: existingProject.description, to: body.description }
    if (body.startDate !== existingProject.startDate.toISOString().split('T')[0]) {
      changes.startDate = { from: existingProject.startDate.toISOString().split('T')[0], to: body.startDate }
    }
    if (body.endDate !== existingProject.endDate.toISOString().split('T')[0]) {
      changes.endDate = { from: existingProject.endDate.toISOString().split('T')[0], to: body.endDate }
    }
    if (body.responsiblePersonId !== existingProject.responsiblePersonId) {
      changes.responsiblePersonId = { from: existingProject.responsiblePersonId, to: body.responsiblePersonId }
    }

    // 更新專案
    const project = await prisma.project.update({
      where: { id: params.id },
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
        action: 'UPDATE',
        changes: JSON.stringify({
          action: '更新專案',
          details: `更新專案：${project.name}`,
          changes,
        }),
      },
    })

    const projectWithProgress = {
      ...project,
      progress: calculateProgress(project.startDate, project.endDate),
    }

    return NextResponse.json(projectWithProgress)
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw createUnauthorizedError()
    }

    // 檢查權限（需要 ADMIN 角色）
    if (session.user.role !== 'ADMIN') {
      throw createUnauthorizedError()
    }

    // 檢查專案是否存在
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!existingProject) {
      throw createNotFoundError('專案不存在')
    }

    // 軟刪除：將專案狀態設為 ARCHIVED
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        status: 'ARCHIVED',
      },
    })

    // 記錄歷史
    await prisma.projectHistory.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        action: 'DELETE',
        changes: JSON.stringify({
          action: '封存專案',
          details: `封存專案：${project.name}`,
        }),
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return handleError(error)
  }
}