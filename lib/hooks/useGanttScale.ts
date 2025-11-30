'use client'

import { useState, useMemo } from 'react'
import { TimeScale } from '@/lib/utils/date'

export function useGanttScale() {
  const [scale, setScale] = useState<TimeScale>('month')

  const scaleOptions = useMemo(() => [
    { value: 'day' as TimeScale, label: '日' },
    { value: 'week' as TimeScale, label: '週' },
    { value: 'month' as TimeScale, label: '月' },
  ], [])

  const getScaleWidth = (scale: TimeScale): number => {
    switch (scale) {
      case 'day':
        return 30 // 每日 30px
      case 'week':
        return 80 // 每週 80px
      case 'month':
        return 120 // 每月 120px
      default:
        return 80
    }
  }

  const getScaleLabel = (scale: TimeScale): string => {
    const option = scaleOptions.find(opt => opt.value === scale)
    return option?.label || scale
  }

  return {
    scale,
    setScale,
    scaleOptions,
    getScaleWidth,
    getScaleLabel,
  }
}