'use client'

import { useAuth } from './useAuth'

export function usePermissions() {
  const { permissions, user } = useAuth()

  const canViewProjects = () => permissions.canViewProjects
  const canEditProjects = () => permissions.canEditProjects
  const canAssignResponsible = () => permissions.canAssignResponsible
  const canManageUsers = () => permissions.canManageUsers
  
  const isAdmin = () => user?.role === 'ADMIN'
  const isEditor = () => user?.role === 'EDITOR' || isAdmin()
  const isViewer = () => user?.role === 'VIEWER' || isEditor()

  const requirePermission = (action: string, condition: boolean) => {
    if (!condition) {
      throw new Error(`權限不足：無法執行 ${action}`)
    }
  }

  return {
    canViewProjects,
    canEditProjects,
    canAssignResponsible,
    canManageUsers,
    isAdmin,
    isEditor,
    isViewer,
    requirePermission,
    permissions,
  }
}