'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/lib/types/project'

interface UseProjectsOptions {
  status?: string
  responsiblePersonId?: string
  page?: number
  limit?: number
}

interface ProjectsData {
  data: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useProjects(options: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.status) params.append('status', options.status)
      if (options.responsiblePersonId) params.append('responsiblePersonId', options.responsiblePersonId)
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())

      const response = await fetch(`/api/projects?${params}`)
      
      if (!response.ok) {
        throw new Error('專案資料載入失敗')
      }

      const data: ProjectsData = await response.json()
      setProjects(data.data)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [options.status, options.responsiblePersonId, options.page, options.limit])

  const refetch = () => {
    fetchProjects()
  }

  return {
    projects,
    loading,
    error,
    pagination,
    refetch,
  }
}