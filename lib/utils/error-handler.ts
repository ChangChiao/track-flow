import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export interface ErrorResponse {
  message: string
  code: string
  details?: any
}

export const handleError = (error: unknown): NextResponse<ErrorResponse> => {
  console.error('API Error:', error)

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: '資料驗證失敗',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      },
      { status: 400 }
    )
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        message: error.message,
        code: 'APP_ERROR',
      },
      { status: error.statusCode }
    )
  }

  // 未知錯誤
  return NextResponse.json(
    {
      message: '內部伺服器錯誤',
      code: 'INTERNAL_SERVER_ERROR',
    },
    { status: 500 }
  )
}

export const createNotFoundError = (resource: string) => 
  new AppError(`${resource} 不存在`, 404)

export const createUnauthorizedError = () => 
  new AppError('未授權', 401)

export const createForbiddenError = () => 
  new AppError('權限不足', 403)