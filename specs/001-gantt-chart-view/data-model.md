# Data Model: 甘特圖專案進度檢視

**Feature**: 001-gantt-chart-view | **Date**: 2025-11-25

## Overview

此文件定義甘特圖功能所需的資料模型、關係和驗證規則。

## Entities

### Project (專案)

**描述**: 代表一個工作項目，包含時程和進度資訊

**屬性**:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | UUID | Yes | 唯一識別碼 | 自動產生 |
| name | String | Yes | 專案名稱 | 1-200 字元 |
| description | String | No | 專案描述 | 最多 1000 字元 |
| startDate | Date | Yes | 開始日期 | 必須為有效日期 |
| endDate | Date | Yes | 結束日期 | 必須晚於 startDate |
| progress | Float | Yes | 進度百分比 | 0-100，自動計算 |
| responsiblePersonId | UUID | No | 負責人 ID | 必須存在於 User |
| createdAt | DateTime | Yes | 建立時間 | 自動設定 |
| updatedAt | DateTime | Yes | 更新時間 | 自動更新 |
| status | Enum | Yes | 專案狀態 | ACTIVE, COMPLETED, ARCHIVED |

**關係**:
- belongsTo: User (through responsiblePersonId)
- hasMany: ProjectHistory

### User (使用者)

**描述**: 系統使用者，可作為專案負責人

**屬性**:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | UUID | Yes | 唯一識別碼 | 自動產生 |
| email | String | Yes | 電子郵件 | 有效 Email 格式 |
| name | String | Yes | 姓名 | 1-100 字元 |
| role | Enum | Yes | 角色 | VIEWER, EDITOR, ADMIN |
| isActive | Boolean | Yes | 是否活躍 | 預設 true |
| department | String | No | 部門 | 最多 100 字元 |
| createdAt | DateTime | Yes | 建立時間 | 自動設定 |
| updatedAt | DateTime | Yes | 更新時間 | 自動更新 |

**關係**:
- hasMany: Project (as responsible person)

### ProjectHistory (專案歷程)

**描述**: 記錄專案的變更歷史

**屬性**:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | UUID | Yes | 唯一識別碼 | 自動產生 |
| projectId | UUID | Yes | 專案 ID | 必須存在於 Project |
| userId | UUID | Yes | 操作者 ID | 必須存在於 User |
| action | Enum | Yes | 操作類型 | CREATE, UPDATE, DELETE |
| changes | JSON | Yes | 變更內容 | JSON 物件 |
| createdAt | DateTime | Yes | 操作時間 | 自動設定 |

**關係**:
- belongsTo: Project
- belongsTo: User

## Enumerations

### UserRole
```typescript
enum UserRole {
  VIEWER = 'VIEWER',     // 檢視者
  EDITOR = 'EDITOR',     // 編輯者
  ADMIN = 'ADMIN'        // 管理員
}
```

### ProjectStatus
```typescript
enum ProjectStatus {
  ACTIVE = 'ACTIVE',         // 進行中
  COMPLETED = 'COMPLETED',   // 已完成
  ARCHIVED = 'ARCHIVED'      // 已封存
}
```

### HistoryAction
```typescript
enum HistoryAction {
  CREATE = 'CREATE',     // 建立
  UPDATE = 'UPDATE',     // 更新
  DELETE = 'DELETE'      // 刪除
}
```

## Validation Rules

### 日期驗證
- `endDate` 必須晚於 `startDate`
- 日期不可為 null 或 undefined
- 支援的日期格式：ISO 8601

### 進度計算
```typescript
// 基於已消逝時間自動計算
progress = (currentDate - startDate) / (endDate - startDate) * 100
```

### 權限規則
- VIEWER: 只能檢視專案資料
- EDITOR: 可以建立、編輯專案，指派負責人
- ADMIN: 擁有所有權限，包含使用者管理

## Indexes

為優化查詢效能，建立以下索引：

```sql
-- 專案查詢優化
CREATE INDEX idx_project_dates ON Project(startDate, endDate);
CREATE INDEX idx_project_responsible ON Project(responsiblePersonId);
CREATE INDEX idx_project_status ON Project(status);

-- 使用者查詢優化
CREATE INDEX idx_user_role ON User(role);
CREATE INDEX idx_user_active ON User(isActive);

-- 歷史記錄查詢優化
CREATE INDEX idx_history_project ON ProjectHistory(projectId);
CREATE INDEX idx_history_created ON ProjectHistory(createdAt);
```

## Migration Strategy

1. 初始遷移建立基本表格結構
2. 添加索引以優化查詢效能
3. 設定預設值和約束條件
4. 建立觸發器自動更新 `updatedAt`

## Data Integrity

### 外鍵約束
- Project.responsiblePersonId → User.id (SET NULL on delete)
- ProjectHistory.projectId → Project.id (CASCADE on delete)
- ProjectHistory.userId → User.id (RESTRICT on delete)

### 業務規則
- 刪除使用者時，相關專案的負責人設為 null 但標記為需重新指派
- 專案刪除採用軟刪除（status = ARCHIVED）
- 保留完整的變更歷史記錄