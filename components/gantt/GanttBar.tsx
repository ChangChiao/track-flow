'use client'

import { useMemo } from 'react'
import { Project } from '@/lib/types/project'
import { TimeScale } from '@/lib/utils/date'
import { calculateProjectProgress, getProgressColor } from '@/lib/utils/progress'
import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns'

interface GanttBarProps {
  project: Project
  timelineStart: Date
  timelineEnd: Date
  scale: TimeScale
  scaleWidth: number
  onProjectClick?: (project: Project) => void
}

export function GanttBar({
  project,
  timelineStart,
  timelineEnd,
  scale,
  scaleWidth,
  onProjectClick,
}: GanttBarProps) {
  const barPosition = useMemo(() => {
    const projectStart = new Date(project.startDate)
    const projectEnd = new Date(project.endDate)

    // 計算開始位置
    let startOffset = 0
    let duration = 0

    switch (scale) {
      case 'day':
        startOffset = Math.max(0, differenceInDays(projectStart, timelineStart))
        duration = differenceInDays(projectEnd, projectStart) + 1
        break
      case 'week':
        startOffset = Math.max(0, differenceInWeeks(projectStart, timelineStart))
        duration = differenceInWeeks(projectEnd, projectStart) + 1
        break
      case 'month':
        startOffset = Math.max(0, differenceInMonths(projectStart, timelineStart))
        duration = differenceInMonths(projectEnd, projectStart) + 1
        break
    }

    const left = startOffset * scaleWidth
    const width = Math.max(scaleWidth * 0.8, duration * scaleWidth)

    return { left, width }
  }, [project, timelineStart, scale, scaleWidth])

  const progressData = useMemo(() => {
    return calculateProjectProgress(project.startDate, project.endDate)
  }, [project.startDate, project.endDate])

  const progressColor = getProgressColor(progressData.progress, progressData.status)

  const handleClick = () => {
    onProjectClick?.(project)
  }

  return (
    <div className="relative h-8 my-1">
      <div
        className={`
          absolute h-6 rounded cursor-pointer transition-all hover:shadow-md
          ${progressColor} bg-opacity-80 hover:bg-opacity-100
        `}
        style={{
          left: barPosition.left,
          width: barPosition.width,
        }}
        onClick={handleClick}
        title={`${project.name} (${progressData.progress}%)`}
      >
        {/* 進度指示器 */}
        <div
          className="h-full bg-black bg-opacity-20 rounded-l"
          style={{ width: `${progressData.progress}%` }}
        />
        
        {/* 專案名稱標籤 */}
        {barPosition.width > 80 && (
          <div className="absolute inset-0 flex items-center px-2">
            <span className="text-xs text-white font-medium truncate">
              {project.name}
            </span>
          </div>
        )}
      </div>
      
      {/* 負責人資訊 */}
      {project.responsiblePerson && (
        <div className="absolute -bottom-4 left-0 text-xs text-gray-500">
          {project.responsiblePerson.name}
        </div>
      )}
    </div>
  )
}