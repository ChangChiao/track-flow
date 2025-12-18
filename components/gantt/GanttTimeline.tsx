'use client'

import { useMemo } from 'react'
import { TimeScale, getDatesBetween, formatDate } from '@/lib/utils/date'
import { addMonths, addWeeks, addDays } from 'date-fns'

interface GanttTimelineProps {
  startDate: Date
  endDate: Date
  scale: TimeScale
  scaleWidth: number
}

export function GanttTimeline({ startDate, endDate, scale, scaleWidth }: GanttTimelineProps) {
  const timeUnits = useMemo(() => {
    // 擴展時間範圍以確保完整顯示
    const extendedStart = scale === 'month' 
      ? addMonths(startDate, -1)
      : scale === 'week'
      ? addWeeks(startDate, -1)
      : addDays(startDate, -7)
    
    const extendedEnd = scale === 'month'
      ? addMonths(endDate, 1)
      : scale === 'week'
      ? addWeeks(endDate, 1)
      : addDays(endDate, 7)

    return getDatesBetween(extendedStart, extendedEnd, scale)
  }, [startDate, endDate, scale])

  const formatTimeUnit = (date: Date) => {
    switch (scale) {
      case 'day':
        return formatDate(date, 'MM/dd')
      case 'week':
        return `${formatDate(date, 'MM/dd')}`
      case 'month':
        return formatDate(date, 'yyyy/MM')
      default:
        return formatDate(date)
    }
  }

  return (
    <div className="flex border-b border-gray-200 bg-gray-50">
      {/* 專案名稱欄位佔位 */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 px-4 py-3">
        <span className="text-sm font-medium text-gray-900">專案名稱</span>
      </div>
      
      {/* 時間軸 */}
      <div className="flex-1 flex overflow-x-auto">
        {timeUnits.map((date, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-2 py-3 text-center border-r border-gray-200 last:border-r-0"
            style={{ minWidth: scaleWidth }}
          >
            <span className="text-xs text-gray-600 font-medium">
              {formatTimeUnit(date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}