import { ProjectHistory as PrismaProjectHistory, HistoryAction } from '@prisma/client'

export type { HistoryAction } from '@prisma/client'

export interface ProjectHistory extends PrismaProjectHistory {
  // 額外的歷史記錄類型定義
}

export interface HistoryChange {
  field: string
  oldValue: any
  newValue: any
}

export const formatHistoryAction = (action: HistoryAction): string => {
  switch (action) {
    case 'CREATE':
      return '建立'
    case 'UPDATE':
      return '更新'
    case 'DELETE':
      return '刪除'
    default:
      return action
  }
}

export const createHistoryEntry = (
  projectId: string,
  userId: string,
  action: HistoryAction,
  changes: HistoryChange[]
) => {
  return {
    projectId,
    userId,
    action,
    changes: JSON.stringify(changes),
  }
}