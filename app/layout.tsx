import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrackFlow - 甘特圖專案管理',
  description: '使用甘特圖視覺化專案進度的管理系統',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}