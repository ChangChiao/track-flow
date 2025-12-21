'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils/date'
import { validateProjectDates } from '@/lib/utils/validation'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onDateRangeChange: (startDate: string, endDate: string) => void
  disabled?: boolean
  error?: string
}

export function DateRangePicker({ 
  startDate, 
  endDate, 
  onDateRangeChange, 
  disabled = false,
  error 
}: DateRangePickerProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate)
  const [localEndDate, setLocalEndDate] = useState(endDate)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    setLocalStartDate(startDate)
    setLocalEndDate(endDate)
  }, [startDate, endDate])

  const validateAndUpdate = (newStartDate: string, newEndDate: string) => {
    if (!newStartDate || !newEndDate) {
      setValidationError(null)
      return
    }

    const validation = validateProjectDates(newStartDate, newEndDate)
    if (!validation.isValid) {
      setValidationError(validation.error || '日期範圍無效')
    } else {
      setValidationError(null)
      onDateRangeChange(newStartDate, newEndDate)
    }
  }

  const handleStartDateChange = (value: string) => {
    setLocalStartDate(value)
    validateAndUpdate(value, localEndDate)
  }

  const handleEndDateChange = (value: string) => {
    setLocalEndDate(value)
    validateAndUpdate(localStartDate, value)
  }

  const quickOptions = [
    {
      label: '1 週',
      getValue: () => {
        const start = new Date()
        const end = new Date()
        end.setDate(start.getDate() + 7)
        return {
          start: formatDate(start, 'yyyy-MM-dd'),
          end: formatDate(end, 'yyyy-MM-dd'),
        }
      }
    },
    {
      label: '1 個月',
      getValue: () => {
        const start = new Date()
        const end = new Date()
        end.setMonth(start.getMonth() + 1)
        return {
          start: formatDate(start, 'yyyy-MM-dd'),
          end: formatDate(end, 'yyyy-MM-dd'),
        }
      }
    },
    {
      label: '3 個月',
      getValue: () => {
        const start = new Date()
        const end = new Date()
        end.setMonth(start.getMonth() + 3)
        return {
          start: formatDate(start, 'yyyy-MM-dd'),
          end: formatDate(end, 'yyyy-MM-dd'),
        }
      }
    }
  ]

  const handleQuickSelect = (option: typeof quickOptions[0]) => {
    const { start, end } = option.getValue()
    setLocalStartDate(start)
    setLocalEndDate(end)
    validateAndUpdate(start, end)
  }

  const displayError = error || validationError

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            開始日期 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={localStartDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            disabled={disabled}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm
              ${displayError 
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
            `}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            結束日期 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={localEndDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={localStartDate}
            disabled={disabled}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm
              ${displayError 
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
            `}
          />
        </div>
      </div>

      {!disabled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            快速設定
          </label>
          <div className="flex flex-wrap gap-2">
            {quickOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickSelect(option)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {displayError && (
        <div className="flex items-center text-red-600 text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {displayError}
        </div>
      )}

      {localStartDate && localEndDate && !displayError && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            專案期間：{formatDate(localStartDate)} - {formatDate(localEndDate)}
            {(() => {
              const start = new Date(localStartDate)
              const end = new Date(localEndDate)
              const diffTime = Math.abs(end.getTime() - start.getTime())
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              return ` (${diffDays} 天)`
            })()}
          </div>
        </div>
      )}
    </div>
  )
}