# Research Notes: 甘特圖專案進度檢視

**Feature**: 001-gantt-chart-view | **Date**: 2025-11-25

## Overview

此文件記錄實作甘特圖功能所需的技術研究和決策。

## Technical Decisions

### 1. 資料儲存方案

**Decision**: PostgreSQL with Prisma ORM
**Rationale**: 
- PostgreSQL 提供強大的日期時間處理功能，適合專案時程管理
- Prisma 提供型別安全的 ORM，與 TypeScript 完美整合
- 支援關聯式資料模型（專案-使用者關係）
**Alternatives considered**:
- MongoDB: 較適合非結構化資料，專案管理需要嚴格的資料結構
- Firebase: 即時同步功能強大，但對複雜查詢支援較弱

### 2. 甘特圖視覺化庫

**Decision**: 自建組件 + SVG
**Rationale**:
- 完全控制樣式和互動，符合 Tailwind CSS v4 設計系統
- SVG 提供精確的圖形控制和良好的縮放性
- 避免外部依賴，減少套件大小
**Alternatives considered**:
- dhtmlx-gantt: 功能完整但授權費用高，樣式客製化困難
- frappe-gantt: 開源但功能有限，不支援 React
- gantt-task-react: React 組件但樣式固定，難以整合 Tailwind

### 3. 日期處理庫

**Decision**: date-fns
**Rationale**:
- 模組化設計，只引入需要的功能
- 不可變資料處理，避免副作用
- 完整的國際化支援
**Alternatives considered**:
- moment.js: 檔案較大，已不推薦新專案使用
- dayjs: 輕量但功能較少，缺少某些進階日期計算

### 4. 狀態管理

**Decision**: Zustand + React Query (TanStack Query)
**Rationale**:
- Zustand 輕量且簡單，適合客戶端狀態
- React Query 處理伺服器狀態，自動快取和同步
- 兩者結合提供完整的狀態管理方案
**Alternatives considered**:
- Redux Toolkit: 對此規模專案過於複雜
- Context API: 效能考量，頻繁更新可能導致過多重新渲染

### 5. 權限管理

**Decision**: NextAuth.js (Auth.js) + RBAC
**Rationale**:
- Next.js 官方推薦的認證解決方案
- 支援多種登入提供者
- 易於實作角色權限控制（RBAC）
**Alternatives considered**:
- Clerk: 功能豐富但成本較高
- 自建認證: 安全風險高，開發成本大

### 6. 即時更新策略

**Decision**: Server-Sent Events (SSE) + Optimistic Updates
**Rationale**:
- SSE 單向通訊適合進度更新場景
- 比 WebSocket 簡單，符合 MVP 需求
- 樂觀更新提升使用體驗
**Alternatives considered**:
- WebSocket: 雙向通訊對此功能過度設計
- 輪詢: 效能差，不符合即時性要求

## Best Practices

### Next.js 14+ App Router
- 使用 Server Components 預設減少客戶端 JavaScript
- 實作 Streaming 提升載入效能
- 使用 Route Handlers 取代 API Routes

### TypeScript 嚴格模式
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Tailwind CSS v4 最佳實踐
- 使用 CSS 變數定義設計標記
- 實作暗色模式支援
- 使用 Container Queries 實現真正的響應式組件

### 無障礙設計
- 所有互動元素提供鍵盤導航
- 使用語義化 HTML 和 ARIA 標籤
- 確保色彩對比符合 WCAG AA 標準

### 效能優化
- 虛擬滾動處理大量專案
- 使用 React.memo 和 useMemo 優化重新渲染
- 實作漸進式載入策略

## Security Considerations

### API 安全
- 實作請求速率限制
- 使用 JWT 進行身份驗證
- 輸入驗證和消毒

### 資料安全
- 加密敏感資料
- 實作適當的 CORS 政策
- 使用 HTTPS 強制安全連線

## Performance Targets

基於憲章要求和規格：
- 初始載入時間 < 3 秒（50 個專案）
- 互動響應時間 < 100ms
- Lighthouse 效能評分 > 90

## Conclusion

所有技術決策都符合憲章要求，優先考慮使用者體驗、效能和可維護性。選擇的技術堆疊提供了良好的開發體驗和長期支援。