'use client'

import { useMemo } from 'react'
import { Project } from '@/lib/types/project'
import { TimeScale } from '@/lib/utils/date'
import { GanttTimeline } from './GanttTimeline'
import { GanttRow } from './GanttRow'
import { TimeScaleSelector } from './TimeScaleSelector'
import { useGanttScale } from '@/lib/hooks/useGanttScale'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

interface GanttChartProps {
  projects: Project[]
  loading?: boolean
  error?: string | null
  onProjectClick?: (project: Project) => void
}

export function GanttChart({ projects, loading, error, onProjectClick }: GanttChartProps) {
  const { scale, setScale, scaleOptions, getScaleWidth } = useGanttScale()
  const scaleWidth = getScaleWidth(scale)

  const timelineBounds = useMemo(() => {
    if (projects.length === 0) {
      const now = new Date()
      return {
        start: now,
        end: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 天後
      }
    }

    const startDates = projects.map(p => new Date(p.startDate))
    const endDates = projects.map(p => new Date(p.endDate))

    return {
      start: new Date(Math.min(...startDates.map(d => d.getTime()))),
      end: new Date(Math.max(...endDates.map(d => d.getTime()))),
    }
  }, [projects])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">載入中...</span>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">目前沒有專案</h3>
        <p className="mt-1 text-sm text-gray-500">建立您的第一個專案來開始使用甘特圖</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* 控制列 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">專案甘特圖</h2>
          <TimeScaleSelector
            value={scale}
            onChange={setScale}
            options={scaleOptions}
          />
        </div>
      </div>

      {/* 甘特圖內容 */}
      <div className="overflow-hidden">
        <GanttTimeline
          startDate={timelineBounds.start}
          endDate={timelineBounds.end}
          scale={scale}
          scaleWidth={scaleWidth}
        />
        
        <div className="max-h-96 overflow-y-auto">
          {projects.map((project) => (
            <GanttRow
              key={project.id}
              project={project}
              timelineStart={timelineBounds.start}
              timelineEnd={timelineBounds.end}
              scale={scale}
              scaleWidth={scaleWidth}
              onProjectClick={onProjectClick}
            />
          ))}
        </div>
      </div>

      {/* 圖例 */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>進行中</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span>已完成</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>逾期</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span>尚未開始</span>
          </div>
        </div>
      </div>
    </div>
  )
}