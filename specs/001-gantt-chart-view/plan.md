# Implementation Plan: 甘特圖專案進度檢視

**Branch**: `001-gantt-chart-view` | **Date**: 2025-11-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-gantt-chart-view/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

實作甘特圖視覺化專案進度檢視功能，支援專案時程顯示、負責人指派和時間管理。使用 Next.js、TypeScript、Tailwind CSS v4 建立響應式 Web 應用程式，並以 Playwright 進行端對端測試。

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js 14+, React 18, Tailwind CSS v4  
**Storage**: PostgreSQL with Prisma ORM  
**Testing**: Playwright (E2E), Jest + React Testing Library (Unit/Integration)  
**Target Platform**: Web (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: web - Next.js application  
**Performance Goals**: <3s initial load (50 projects), <1s update response  
**Constraints**: Support 200 concurrent projects display, Responsive design  
**Scale/Scope**: Initial MVP for project management teams (10-50 users)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### 程式碼品質優先
- ✅ TypeScript 提供型別安全
- ✅ ESLint + Prettier 將配置於專案中
- ✅ Playwright + Jest 提供測試覆蓋
- ✅ 程式碼審查流程將遵循 PR 機制

### 使用者體驗一致性
- ✅ Tailwind CSS v4 確保設計系統一致性
- ✅ 響應式設計支援所有裝置
- ✅ 載入狀態將清楚顯示
- ⚠️ WCAG 2.1 AA 無障礙標準需在實作時特別注意

### 效能要求
- ✅ 3 秒內載入目標符合憲章要求
- ✅ React 18 並行特性支援 100ms 互動響應
- ✅ Next.js 自動程式碼分割和懶載入
- ⚠️ Lighthouse 90 分需持續監控

### 技術標準
- ✅ TypeScript 已選定
- ✅ Tailwind CSS 已選定
- ✅ 模組化架構將實施
- ✅ RESTful API 設計原則將遵循

### 文件與註解規範
- ✅ 所有文件將使用正體中文
- ✅ 程式碼註解將使用正體中文
- ✅ UI 文字將使用正體中文

**結論**: 通過所有憲章檢查，可繼續進行 Phase 0 研究。

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Next.js Web Application Structure
app/
├── (auth)/
│   └── layout.tsx           # 認證相關頁面佈局
├── gantt/
│   ├── page.tsx            # 甘特圖主頁面
│   ├── layout.tsx          # 甘特圖頁面佈局
│   └── loading.tsx         # 載入狀態組件
├── api/
│   ├── projects/
│   │   ├── route.ts        # GET/POST 專案列表
│   │   └── [id]/
│   │       └── route.ts    # GET/PUT/DELETE 單一專案
│   └── users/
│       └── route.ts        # 使用者資料 API
├── layout.tsx              # 根佈局
└── globals.css             # 全域樣式

components/
├── gantt/
│   ├── GanttChart.tsx      # 甘特圖主組件
│   ├── GanttTimeline.tsx   # 時間軸組件
│   ├── GanttRow.tsx        # 專案列組件
│   ├── GanttBar.tsx        # 進度條組件
│   └── TimeScaleSelector.tsx # 時間縮放選擇器
├── project/
│   ├── ProjectForm.tsx     # 專案編輯表單
│   ├── ResponsiblePersonSelector.tsx # 負責人選擇器
│   └── DateRangePicker.tsx # 日期範圍選擇器
└── ui/
    ├── Button.tsx          # 通用按鈕組件
    ├── Dialog.tsx          # 對話框組件
    └── ErrorMessage.tsx    # 錯誤訊息組件

lib/
├── types/
│   ├── project.ts          # 專案相關型別定義
│   ├── user.ts             # 使用者相關型別定義
│   └── permission.ts       # 權限相關型別定義
├── utils/
│   ├── date.ts             # 日期處理工具
│   ├── progress.ts         # 進度計算工具
│   └── validation.ts       # 驗證工具
└── hooks/
    ├── useProjects.ts      # 專案資料 Hook
    ├── usePermissions.ts   # 權限檢查 Hook
    └── useGanttScale.ts    # 甘特圖縮放 Hook

tests/
├── e2e/
│   ├── gantt.spec.ts       # 甘特圖 E2E 測試
│   └── project-management.spec.ts # 專案管理 E2E 測試
├── integration/
│   └── api/
│       └── projects.test.ts # API 整合測試
└── unit/
    ├── utils/
    │   ├── date.test.ts    # 日期工具單元測試
    │   └── progress.test.ts # 進度計算單元測試
    └── components/
        └── GanttBar.test.tsx # 組件單元測試
```

**Structure Decision**: 採用 Next.js App Router 結構，將甘特圖功能組織在專門的路由下，組件按功能領域分組，並保持清晰的關注點分離。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

無違反憲章項目，所有技術決策都符合簡潔性和 MVP 原則。

## Phase Status

### Phase 0: Research ✅
- 完成技術研究和決策文件
- 解決所有 NEEDS CLARIFICATION 項目
- 產出: research.md

### Phase 1: Design & Contracts ✅
- 建立完整資料模型
- 定義 API 契約規格
- 產出: data-model.md, contracts/api.yaml, quickstart.md
- 更新 CLAUDE.md agent context

### Phase 2: Implementation Planning 🔄
- 待執行 `/speckit.tasks` 命令產生任務分解
