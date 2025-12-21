'use client'

import { User } from '@/lib/types/user'
import { useState, useEffect } from 'react'

interface ResponsiblePersonSelectorProps {
  selectedUserId?: string | null
  onChange: (userId: string | null) => void
  users: User[]
  loading?: boolean
  error?: string | null
  disabled?: boolean
}

export function ResponsiblePersonSelector({
  selectedUserId,
  onChange,
  users,
  loading,
  error,
  disabled = false,
}: ResponsiblePersonSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredUsers = users.filter(user => 
    user.isActive &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.department?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const selectedUser = users.find(user => user.id === selectedUserId)

  useEffect(() => {
    // 點擊外部關閉下拉選單
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.responsible-person-selector')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          負責人
        </label>
        <div className="animate-pulse h-10 bg-gray-200 rounded-md"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          負責人
        </label>
        <div className="text-sm text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="w-full responsible-person-selector">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        負責人
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-left border rounded-md shadow-sm
            ${disabled 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' 
              : 'bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border-gray-300'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <span className={selectedUser ? 'text-gray-900' : 'text-gray-500'}>
              {selectedUser ? selectedUser.name : '選擇負責人'}
            </span>
            <svg
              className={`ml-2 h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6 8l4 4 4-4"
              />
            </svg>
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto">
            {/* 搜尋框 */}
            <div className="px-3 py-2 border-b border-gray-200">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="搜尋姓名、Email 或部門..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* 清除選擇 */}
            {selectedUserId && (
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                onClick={() => {
                  onChange(null)
                  setIsOpen(false)
                  setSearchTerm('')
                }}
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 20 20">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  清除選擇
                </div>
              </button>
            )}

            {/* 使用者列表 */}
            {filteredUsers.length === 0 ? (
              <div className="px-3 py-4 text-center text-gray-500">
                沒有找到符合的使用者
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className={`
                    w-full px-3 py-2 text-left hover:bg-gray-100
                    ${user.id === selectedUserId ? 'bg-blue-50' : ''}
                  `}
                  onClick={() => {
                    onChange(user.id)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">
                        {user.email}
                        {user.department && ` • ${user.department}`}
                      </div>
                    </div>
                    {user.id === selectedUserId && (
                      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {selectedUser && (
        <p className="mt-1 text-xs text-gray-500">
          {selectedUser.role === 'ADMIN' && '管理員'}
          {selectedUser.role === 'EDITOR' && '編輯者'}
          {selectedUser.role === 'VIEWER' && '檢視者'}
        </p>
      )}
    </div>
  )
}