import { Project as PrismaProject, ProjectStatus, User } from '@prisma/client'
import { z } from 'zod'

export type { ProjectStatus } from '@prisma/client'

export interface Project extends PrismaProject {
  responsiblePerson?: User | null
}

export interface ProjectWithHistory extends Project {
  histories?: Array<{
    id: string
    action: string
    changes: any
    createdAt: Date
    user: {
      id: string
      name: string
    }
  }>
}

// 專案驗證 schema
export const projectSchema = z.object({
  name: z.string().min(1, '專案名稱為必填').max(200, '專案名稱不可超過 200 字元'),
  description: z.string().max(1000, '專案描述不可超過 1000 字元').optional(),
  startDate: z.date(),
  endDate: z.date(),
  responsiblePersonId: z.string().optional(),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: '結束日期必須晚於開始日期',
    path: ['endDate'],
  }
)

export type ProjectInput = z.infer<typeof projectSchema>

// 計算專案進度
export const calculateProgress = (startDate: Date, endDate: Date): number => {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (now < start) return 0
  if (now > end) return 100
  
  const total = end.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()
  
  return Math.round((elapsed / total) * 100)
}