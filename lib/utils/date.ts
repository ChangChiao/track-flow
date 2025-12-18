import { format, parseISO, startOfDay, endOfDay, addDays, addWeeks, addMonths } from 'date-fns'
import { zhTW } from 'date-fns/locale'

export type TimeScale = 'day' | 'week' | 'month'

export const formatDate = (date: Date | string, pattern = 'yyyy-MM-dd'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, pattern, { locale: zhTW })
}

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'yyyy-MM-dd HH:mm')
}

export const formatDateForInput = (date: Date | string): string => {
  return formatDate(date, 'yyyy-MM-dd')
}

export const parseInputDate = (dateString: string): Date => {
  return parseISO(dateString)
}

export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return endDate > startDate
}

export const getDatesBetween = (startDate: Date, endDate: Date, scale: TimeScale): Date[] => {
  const dates: Date[] = []
  let current = startOfDay(startDate)
  const end = endOfDay(endDate)

  while (current <= end) {
    dates.push(current)
    
    switch (scale) {
      case 'day':
        current = addDays(current, 1)
        break
      case 'week':
        current = addWeeks(current, 1)
        break
      case 'month':
        current = addMonths(current, 1)
        break
    }
  }

  return dates
}

export const calculateDaysBetween = (startDate: Date, endDate: Date): number => {
  const start = startOfDay(startDate)
  const end = startOfDay(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export const getTimeScaleUnit = (scale: TimeScale): string => {
  switch (scale) {
    case 'day':
      return '日'
    case 'week':
      return '週'
    case 'month':
      return '月'
    default:
      return scale
  }
}