# Quick Start: 甘特圖專案進度檢視

本指南協助開發者快速開始實作甘特圖功能。

## 前置需求

- Node.js 18+ 和 npm/yarn/pnpm
- PostgreSQL 14+
- Git

## 環境設定

### 1. 安裝依賴

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 2. 環境變數設定

建立 `.env.local` 檔案：

```env
# 資料庫連線
DATABASE_URL="postgresql://user:password@localhost:5432/trackflow"

# NextAuth 設定
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# 應用程式設定
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. 資料庫設定

```bash
# 執行 Prisma 遷移
npx prisma migrate dev

# 產生 Prisma Client
npx prisma generate

# (選擇性) 載入種子資料
npx prisma db seed
```

## 開發流程

### 1. 啟動開發伺服器

```bash
npm run dev
```

訪問 http://localhost:3000/gantt 查看甘特圖頁面。

### 2. 主要開發任務

#### 實作甘特圖組件
```typescript
// components/gantt/GanttChart.tsx
import { Project } from '@/lib/types/project';

interface GanttChartProps {
  projects: Project[];
  scale: 'day' | 'week' | 'month';
  onProjectClick?: (project: Project) => void;
}

export function GanttChart({ projects, scale, onProjectClick }: GanttChartProps) {
  // 實作甘特圖渲染邏輯
}
```

#### 設定 API 路由
```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // 實作專案列表 API
}

export async function POST(request: NextRequest) {
  // 實作建立專案 API
}
```

### 3. 測試

#### 單元測試
```bash
npm run test:unit
```

#### 整合測試
```bash
npm run test:integration
```

#### E2E 測試
```bash
npm run test:e2e
```

## 核心功能實作順序

1. **基礎設定** (Day 1)
   - 設定 Next.js 專案結構
   - 配置 Prisma 和資料庫
   - 設定 ESLint 和 Prettier

2. **資料模型** (Day 2)
   - 實作 Prisma schema
   - 建立 API 路由處理器
   - 實作資料驗證

3. **甘特圖視覺化** (Day 3-4)
   - 實作 GanttChart 主組件
   - 實作時間軸和縮放功能
   - 實作專案條狀圖渲染

4. **互動功能** (Day 5-6)
   - 實作專案編輯表單
   - 實作負責人選擇器
   - 實作日期驗證

5. **權限和優化** (Day 7)
   - 實作角色權限檢查
   - 優化渲染效能
   - 實作載入和錯誤狀態

## 常見問題

### 如何處理大量專案的效能問題？
使用虛擬滾動和分頁載入：
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

### 如何實現即時更新？
使用 Server-Sent Events：
```typescript
// app/api/projects/stream/route.ts
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      // 實作 SSE 邏輯
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### 如何確保無障礙性？
- 使用語義化 HTML 元素
- 提供鍵盤導航支援
- 添加適當的 ARIA 標籤

## 相關資源

- [Next.js App Router 文件](https://nextjs.org/docs/app)
- [Prisma 文件](https://www.prisma.io/docs)
- [Tailwind CSS v4 文件](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

## 取得協助

如遇到問題，請查看：
1. 專案 README.md
2. 技術研究文件 (research.md)
3. API 規格 (contracts/api.yaml)