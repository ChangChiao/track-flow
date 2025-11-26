# TrackFlow - 專案進度追蹤系統

使用 Speckit 開發流程建立的專案管理系統，支援甘特圖視覺化專案進度。

## 🚀 快速開始

### 使用 Speckit 開發流程

Speckit 是一套結構化的功能開發流程，從需求規格到實作任務的完整工作流。

## 📋 Speckit 命令流程

### 1. 建立專案憲章
```bash
/speckit.constitution
```
定義專案的核心原則、技術標準和治理規則。

### 2. 建立功能規格
```bash
/speckit.specify <功能描述>
```
範例：
```bash
/speckit.specify 可以用甘特圖的方式檢視每個專案的進度，每個專案可以指派負責人，專案會設定開始時間和結束時間
```
這會建立：
- 功能分支 (如 `001-gantt-chart-view`)
- 規格文件 (`specs/001-gantt-chart-view/spec.md`)

### 3. 釐清需求
```bash
/speckit.clarify
```
互動式問答，解決規格中的模糊點：
- 自動識別需要澄清的項目
- 提供選項和建議
- 更新規格文件

### 4. 建立實作計畫
```bash
/speckit.plan <技術選擇>
```
範例：
```bash
/speckit.plan use Next.js, playwright, typescript, tailwindcss@4
```
產生：
- `plan.md` - 技術架構
- `research.md` - 技術研究
- `data-model.md` - 資料模型
- `contracts/` - API 規格
- `quickstart.md` - 開發指南

### 5. 產生實作任務
```bash
/speckit.tasks
```
將計畫分解為具體的開發任務。

## 📁 專案結構

```
track-flow/
├── .specify/               # Speckit 設定和範本
│   ├── memory/            # 專案記憶（憲章等）
│   ├── templates/         # 各種範本
│   └── scripts/           # 輔助腳本
├── specs/                 # 功能規格
│   └── 001-gantt-chart-view/
│       ├── spec.md        # 功能規格
│       ├── plan.md        # 實作計畫
│       ├── research.md    # 技術研究
│       ├── data-model.md  # 資料模型
│       ├── contracts/     # API 契約
│       └── quickstart.md  # 快速開始
├── app/                   # Next.js 應用程式
├── components/            # React 組件
├── lib/                   # 工具函式
└── tests/                 # 測試檔案
```

## 🛠️ 技術堆疊

- **框架**: Next.js 14+ (App Router)
- **語言**: TypeScript 5.x
- **樣式**: Tailwind CSS v4
- **資料庫**: PostgreSQL + Prisma ORM
- **測試**: Playwright (E2E), Jest (Unit)
- **認證**: NextAuth.js

## 🎯 開發原則

根據專案憲章：
1. **程式碼品質優先** - TypeScript、ESLint、測試覆蓋
2. **使用者體驗一致性** - 統一設計系統、響應式設計
3. **效能要求** - 3秒內載入、100ms 互動響應
4. **技術標準** - 模組化架構、RESTful API
5. **文件規範** - 正體中文文件和註解

## 🚦 開始開發

1. 克隆專案
```bash
git clone <repository-url>
cd track-flow
```

2. 安裝依賴
```bash
npm install
```

3. 設定環境變數
```bash
cp .env.example .env.local
# 編輯 .env.local 填入必要設定
```

4. 初始化資料庫
```bash
npx prisma migrate dev
npx prisma generate
```

5. 啟動開發伺服器
```bash
npm run dev
```

## 📚 相關文件

- [專案憲章](.specify/memory/constitution.md)
- [甘特圖功能規格](specs/001-gantt-chart-view/spec.md)
- [實作計畫](specs/001-gantt-chart-view/plan.md)
- [開發快速指南](specs/001-gantt-chart-view/quickstart.md)

## 🤝 貢獻指南

1. 新功能請先使用 `/speckit.specify` 建立規格
2. 遵循專案憲章的所有原則
3. 確保通過所有測試
4. 提交 PR 前執行 lint 和 typecheck

## 📝 授權

MIT License

Copyright (c) 2025 TrackFlow

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.