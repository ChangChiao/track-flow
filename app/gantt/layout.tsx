import { ReactNode } from 'react'

export default function GanttLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">TrackFlow</h1>
              <nav className="flex space-x-6">
                <a
                  href="/gantt"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  甘特圖
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-600 hover:text-gray-800">
                設定
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                登出
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}