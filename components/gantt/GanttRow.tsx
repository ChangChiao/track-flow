'use client'

import { Project } from '@/lib/types/project'
import { TimeScale, formatDate } from '@/lib/utils/date'
import { GanttBar } from './GanttBar'

interface GanttRowProps {
  project: Project
  timelineStart: Date
  timelineEnd: Date
  scale: TimeScale
  scaleWidth: number
  onProjectClick?: (project: Project) => void
}

export function GanttRow({
  project,
  timelineStart,
  timelineEnd,
  scale,
  scaleWidth,
  onProjectClick,
}: GanttRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100'
      case 'COMPLETED':
        return 'text-blue-600 bg-blue-100'
      case 'ARCHIVED':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '進行中'
      case 'COMPLETED':
        return '已完成'
      case 'ARCHIVED':
        return '已封存'
      default:
        return status
    }
  }

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50">
      {/* 專案資訊欄 */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 px-4 py-3">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900 truncate" title={project.name}>
            {project.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
            <span className="text-xs text-gray-500">
              {project.progress}%
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </div>
          {project.responsiblePerson && (
            <div className="text-xs text-gray-600">
              負責人: {project.responsiblePerson.name}
            </div>
          )}
        </div>
      </div>
      
      {/* 甘特圖區域 */}
      <div className="flex-1 relative px-2 py-3" style={{ minHeight: '60px' }}>
        <GanttBar
          project={project}
          timelineStart={timelineStart}
          timelineEnd={timelineEnd}
          scale={scale}
          scaleWidth={scaleWidth}
          onProjectClick={onProjectClick}
        />
      </div>
    </div>
  )
}