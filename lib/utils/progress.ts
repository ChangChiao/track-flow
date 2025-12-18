export interface ProgressCalculationResult {
  progress: number
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue'
  daysElapsed: number
  totalDays: number
  daysRemaining: number
}

export const calculateProjectProgress = (
  startDate: Date | string,
  endDate: Date | string,
  currentDate?: Date
): ProgressCalculationResult => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const now = currentDate || new Date()
  
  // 計算總天數
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  
  // 計算已過天數
  const daysElapsed = Math.max(0, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  
  // 計算剩餘天數
  const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  
  // 計算進度百分比
  let progress = 0
  let status: ProgressCalculationResult['status'] = 'not-started'
  
  if (now < start) {
    progress = 0
    status = 'not-started'
  } else if (now >= end) {
    progress = 100
    status = 'completed'
  } else {
    progress = Math.round((daysElapsed / totalDays) * 100)
    status = 'in-progress'
  }
  
  // 檢查是否逾期
  if (now > end && status !== 'completed') {
    status = 'overdue'
  }
  
  return {
    progress,
    status,
    daysElapsed,
    totalDays,
    daysRemaining,
  }
}

export const getProgressColor = (progress: number, status: ProgressCalculationResult['status']): string => {
  switch (status) {
    case 'not-started':
      return 'bg-gray-300'
    case 'in-progress':
      if (progress < 33) return 'bg-blue-500'
      if (progress < 66) return 'bg-yellow-500'
      return 'bg-green-500'
    case 'completed':
      return 'bg-green-600'
    case 'overdue':
      return 'bg-red-500'
    default:
      return 'bg-gray-300'
  }
}

export const formatProgressText = (result: ProgressCalculationResult): string => {
  const { progress, status, daysRemaining } = result
  
  switch (status) {
    case 'not-started':
      return '尚未開始'
    case 'in-progress':
      return `進行中 ${progress}% (剩餘 ${daysRemaining} 天)`
    case 'completed':
      return '已完成'
    case 'overdue':
      return `逾期 ${Math.abs(daysRemaining)} 天`
    default:
      return `${progress}%`
  }
}