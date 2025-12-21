'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/types/user'

interface UseUsersOptions {
  isActive?: boolean
  role?: string
}

interface UsersData {
  data: User[]
}

export function useUsers(options: UseUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.isActive !== undefined) params.append('isActive', options.isActive.toString())
      if (options.role) params.append('role', options.role)

      const response = await fetch(`/api/users?${params}`)
      
      if (!response.ok) {
        throw new Error('使用者資料載入失敗')
      }

      const data: UsersData = await response.json()
      setUsers(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [options.isActive, options.role])

  const refetch = () => {
    fetchUsers()
  }

  return {
    users,
    loading,
    error,
    refetch,
  }
}