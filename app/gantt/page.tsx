'use client'

import { useState } from 'react'
import { GanttChart } from '@/components/gantt/GanttChart'
import { useProjects } from '@/lib/hooks/useProjects'
import { Button } from '@/components/ui/Button'
import { Project } from '@/lib/types/project'

export default function GanttPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { projects, loading, error, refetch } = useProjects()

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    // 這裡可以開啟專案詳情對話框或跳轉到專案詳情頁
    console.log('專案點擊:', project)
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">專案甘特圖</h1>
          <p className="mt-2 text-gray-600">
            視覺化檢視所有專案的時程安排和進度狀況
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={refetch}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            重新整理
          </Button>
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            新增專案
          </Button>
        </div>
      </div>

      {/* 統計資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">總專案數</p>
              <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">進行中</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.filter(p => p.status === 'ACTIVE').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">已完成</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.filter(p => p.status === 'COMPLETED').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">平均進度</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.length > 0 
                  ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
                  : 0}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 甘特圖 */}
      <GanttChart
        projects={projects}
        loading={loading}
        error={error}
        onProjectClick={handleProjectClick}
      />

      {/* 選中專案的資訊提示 */}
      {selectedProject && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h4 className="font-semibold text-gray-900">{selectedProject.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{selectedProject.description}</p>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => setSelectedProject(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </div>
  )
}