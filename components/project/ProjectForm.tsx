'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/lib/types/project'
import { User } from '@/lib/types/user'
import { Button } from '@/components/ui/Button'
import { ResponsiblePersonSelector } from './ResponsiblePersonSelector'
import { useUsers } from '@/lib/hooks/useUsers'
import { validateProjectDates } from '@/lib/utils/validation'
import { formatDate } from '@/lib/utils/date'

interface ProjectFormProps {
  project?: Project
  onSubmit: (data: ProjectFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export interface ProjectFormData {
  name: string
  description?: string
  startDate: string
  endDate: string
  responsiblePersonId?: string | null
}

export function ProjectForm({ 
  project, 
  onSubmit, 
  onCancel,
  submitLabel = '儲存'
}: ProjectFormProps) {
  const { users, loading: usersLoading, error: usersError } = useUsers({ isActive: true })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: project?.name || '',
    description: project?.description || '',
    startDate: project?.startDate ? formatDate(project.startDate, 'yyyy-MM-dd') : '',
    endDate: project?.endDate ? formatDate(project.endDate, 'yyyy-MM-dd') : '',
    responsiblePersonId: project?.responsiblePerson?.id || null,
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = '專案名稱為必填'
    } else if (formData.name.length > 200) {
      errors.name = '專案名稱不得超過 200 字元'
    }

    if (!formData.startDate) {
      errors.startDate = '開始日期為必填'
    }

    if (!formData.endDate) {
      errors.endDate = '結束日期為必填'
    }

    if (formData.startDate && formData.endDate) {
      const dateValidation = validateProjectDates(formData.startDate, formData.endDate)
      if (!dateValidation.isValid) {
        errors.endDate = dateValidation.error || '日期驗證失敗'
      }
    }

    if (formData.description && formData.description.length > 1000) {
      errors.description = '專案描述不得超過 1000 字元'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '儲存失敗，請稍後再試')
      setLoading(false)
    }
  }

  const handleChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除該欄位的驗證錯誤
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          專案名稱 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`
            mt-1 block w-full rounded-md shadow-sm
            ${validationErrors.name 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
          placeholder="輸入專案名稱"
          disabled={loading}
        />
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          專案描述
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`
            mt-1 block w-full rounded-md shadow-sm
            ${validationErrors.description 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
          placeholder="輸入專案描述（選填）"
          disabled={loading}
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            開始日期 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className={`
              mt-1 block w-full rounded-md shadow-sm
              ${validationErrors.startDate 
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
            `}
            disabled={loading}
          />
          {validationErrors.startDate && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.startDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            結束日期 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            min={formData.startDate}
            className={`
              mt-1 block w-full rounded-md shadow-sm
              ${validationErrors.endDate 
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
            `}
            disabled={loading}
          />
          {validationErrors.endDate && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.endDate}</p>
          )}
        </div>
      </div>

      <ResponsiblePersonSelector
        selectedUserId={formData.responsiblePersonId}
        onChange={(userId) => setFormData(prev => ({ ...prev, responsiblePersonId: userId }))}
        users={users}
        loading={usersLoading}
        error={usersError}
        disabled={loading}
      />

      <div className="pt-4 flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              儲存中...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}