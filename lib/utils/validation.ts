import { z } from 'zod'

export const emailSchema = z.string().email('請輸入有效的電子郵件地址')

export const nameSchema = z.string()
  .min(1, '姓名為必填')
  .max(100, '姓名不可超過 100 字元')

export const projectNameSchema = z.string()
  .min(1, '專案名稱為必填')
  .max(200, '專案名稱不可超過 200 字元')

export const descriptionSchema = z.string()
  .max(1000, '描述不可超過 1000 字元')
  .optional()

export const dateSchema = z.string()
  .refine((date) => !isNaN(Date.parse(date)), '請輸入有效的日期')
  .transform((date) => new Date(date))

export const dateRangeSchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: '結束日期必須晚於開始日期',
    path: ['endDate'],
  }
)

export const uuidSchema = z.string().uuid('請輸入有效的 UUID')

export const progressSchema = z.number()
  .min(0, '進度不可小於 0')
  .max(100, '進度不可大於 100')

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(200).default(50),
})

export type PaginationParams = z.infer<typeof paginationSchema>

export const validateOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(`驗證失敗: ${result.error.errors.map(e => e.message).join(', ')}`)
  }
  return result.data
}

export const isValidEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success
}

export const isValidUUID = (uuid: string): boolean => {
  return uuidSchema.safeParse(uuid).success
}