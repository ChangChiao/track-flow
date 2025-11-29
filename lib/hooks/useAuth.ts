'use client'

import { useSession } from 'next-auth/react'
import { User, Permission, getRolePermissions } from '@/lib/types/user'

export function useAuth() {
  const { data: session, status } = useSession()
  
  const user: User | null = session?.user ? {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name!,
    role: session.user.role,
    isActive: true,
    department: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } : null

  const permissions: Permission = user 
    ? getRolePermissions(user.role) 
    : {
        canViewProjects: false,
        canEditProjects: false,
        canAssignResponsible: false,
        canManageUsers: false,
      }

  return {
    user,
    permissions,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
  }
}