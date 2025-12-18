import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 開始執行種子資料...')

  // 建立測試使用者
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trackflow.com' },
    update: {},
    create: {
      email: 'admin@trackflow.com',
      name: '系統管理員',
      role: 'ADMIN',
      isActive: true,
      department: 'IT部門',
    },
  })

  const editor = await prisma.user.upsert({
    where: { email: 'editor@trackflow.com' },
    update: {},
    create: {
      email: 'editor@trackflow.com',
      name: '專案編輯者',
      role: 'EDITOR',
      isActive: true,
      department: '專案管理部',
    },
  })

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@trackflow.com' },
    update: {},
    create: {
      email: 'viewer@trackflow.com',
      name: '專案檢視者',
      role: 'VIEWER',
      isActive: true,
      department: '業務部',
    },
  })

  console.log('👥 建立使用者完成')

  // 建立測試專案
  const project1 = await prisma.project.create({
    data: {
      name: '網站重新設計專案',
      description: '重新設計公司官方網站以提升使用者體驗和轉換率',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-04-15'),
      responsiblePersonId: editor.id,
      status: 'ACTIVE',
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: '行動應用程式開發',
      description: '開發 iOS 和 Android 原生應用程式',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-06-30'),
      responsiblePersonId: editor.id,
      status: 'ACTIVE',
    },
  })

  const project3 = await prisma.project.create({
    data: {
      name: '客戶關係管理系統',
      description: '升級現有 CRM 系統以支援更多功能',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2024-02-28'),
      responsiblePersonId: viewer.id,
      status: 'COMPLETED',
    },
  })

  console.log('📊 建立專案完成')

  // 建立專案歷史記錄
  await prisma.projectHistory.createMany({
    data: [
      {
        projectId: project1.id,
        userId: admin.id,
        action: 'CREATE',
        changes: JSON.stringify({
          action: '建立專案',
          details: '初始建立網站重新設計專案',
        }),
      },
      {
        projectId: project1.id,
        userId: editor.id,
        action: 'UPDATE',
        changes: JSON.stringify({
          action: '指派負責人',
          field: 'responsiblePersonId',
          oldValue: null,
          newValue: editor.id,
        }),
      },
      {
        projectId: project3.id,
        userId: admin.id,
        action: 'UPDATE',
        changes: JSON.stringify({
          action: '專案完成',
          field: 'status',
          oldValue: 'ACTIVE',
          newValue: 'COMPLETED',
        }),
      },
    ],
  })

  console.log('📝 建立歷史記錄完成')
  console.log('✅ 種子資料執行完成！')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })