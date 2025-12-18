import { User as PrismaUser, UserRole } from '@prisma/client'

export type { UserRole } from '@prisma/client'

export interface User extends PrismaUser {
  // 額外的使用者類型定義
}

export interface UserWithProjects extends User {
  responsibleProjects?: Array<{
    id: string
    name: string
    status: string
  }>
}

export interface Permission {
  canViewProjects: boolean
  canEditProjects: boolean
  canAssignResponsible: boolean
  canManageUsers: boolean
}

export const getRolePermissions = (role: UserRole): Permission => {
  switch (role) {
    case 'ADMIN':
      return {
        canViewProjects: true,
        canEditProjects: true,
        canAssignResponsible: true,
        canManageUsers: true,
      }
    case 'EDITOR':
      return {
        canViewProjects: true,
        canEditProjects: true,
        canAssignResponsible: true,
        canManageUsers: false,
      }
    case 'VIEWER':
      return {
        canViewProjects: true,
        canEditProjects: false,
        canAssignResponsible: false,
        canManageUsers: false,
      }
    default:
      return {
        canViewProjects: false,
        canEditProjects: false,
        canAssignResponsible: false,
        canManageUsers: false,
      }
  }
}