import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            TrackFlow
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            專案進度視覺化管理系統，使用甘特圖清楚展示所有專案的時程安排和當前狀況
          </p>
          <div className="flex space-x-4">
            <Link href="/gantt">
              <Button size="lg">
                檢視甘特圖
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="secondary" size="lg">
                登入
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}