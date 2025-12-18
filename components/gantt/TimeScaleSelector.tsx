'use client'

import { TimeScale } from '@/lib/utils/date'

interface TimeScaleSelectorProps {
  value: TimeScale
  onChange: (scale: TimeScale) => void
  options: Array<{ value: TimeScale; label: string }>
}

export function TimeScaleSelector({ value, onChange, options }: TimeScaleSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700">時間縮放:</label>
      <div className="flex rounded-md shadow-sm">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-3 py-1 text-sm font-medium transition-colors
              ${option.value === value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }
              ${option.value === options[0].value ? 'rounded-l-md' : ''}
              ${option.value === options[options.length - 1].value ? 'rounded-r-md' : ''}
              ${option.value !== options[options.length - 1].value ? 'border-r border-gray-200' : ''}
              border border-gray-300
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}