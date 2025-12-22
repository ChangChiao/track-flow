# Feature Specification: 甘特圖專案進度檢視

**Feature Branch**: `001-gantt-chart-view`  
**Created**: 2025-11-25  
**Status**: Draft  
**Input**: User description: "可以用甘特圖的方式檢視每個專案的進度，每個專案可以指派負責人，專案會設定開始時間和結束時間"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 檢視專案甘特圖 (Priority: P1)

專案管理者需要以甘特圖的視覺化方式檢視所有專案的時間軸和進度狀態，快速了解專案的整體時程安排和當前狀況。

**Why this priority**: 這是核心功能的基礎，提供最基本的視覺化價值，是 MVP 的核心組件。

**Independent Test**: 可以通過載入專案列表並顯示甘特圖介面來完全測試，直接提供專案時程的視覺化價值。

**Acceptance Scenarios**:

1. **Given** 系統中存在多個專案，**When** 使用者開啟甘特圖檢視頁面，**Then** 顯示所有專案的時間軸條狀圖
2. **Given** 甘特圖已載入，**When** 使用者查看專案條狀圖，**Then** 可以清楚識別每個專案的開始時間、結束時間和當前進度

---

### User Story 2 - 指派專案負責人 (Priority: P2)

具有編輯權限的專案管理者需要為每個專案指派負責人，並在甘特圖中顯示負責人資訊，以便追蹤專案責任歸屬。

**Why this priority**: 責任歸屬是專案管理的重要組成部分，提升管理效率和責任追蹤。

**Independent Test**: 可以通過選擇專案和指派負責人功能來獨立測試，提供專案責任管理價值。

**Acceptance Scenarios**:

1. **Given** 存在未指派負責人的專案，**When** 管理者點選專案並指派負責人，**Then** 專案顯示負責人資訊
2. **Given** 甘特圖顯示專案，**When** 使用者檢視專案詳情，**Then** 可以看到當前負責人姓名

---

### User Story 3 - 設定專案時間 (Priority: P3)

具有編輯權限的專案管理者需要設定和調整專案的開始時間和結束時間，並在甘特圖中即時反映變更。

**Why this priority**: 時程調整是專案管理的常見需求，但屬於進階功能，不影響基本檢視功能。

**Independent Test**: 可以通過修改專案時間並檢視甘特圖更新來獨立測試，提供時程管理價值。

**Acceptance Scenarios**:

1. **Given** 甘特圖顯示專案時程，**When** 管理者修改專案開始或結束時間，**Then** 甘特圖即時更新專案條狀圖位置和長度
2. **Given** 專案時間已修改，**When** 使用者重新載入甘特圖，**Then** 顯示最新的專案時程安排

---

### Edge Cases

- 專案開始時間晚於結束時間時，系統如何處理？（已解決：顯示驗證錯誤並阻止儲存）
- 多個專案時程重疊時，甘特圖如何清楚顯示？（已解決：使用獨立泳道垂直堆疊）
- 負責人離職或調動時，如何處理專案指派？（已解決：保留指派並標記為非活躍）
- 專案時程跨越多個年度時，甘特圖如何適當縮放？

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須以甘特圖格式顯示所有專案的時間軸
- **FR-002**: 系統必須顯示每個專案的開始時間和結束時間  
- **FR-003**: 使用者必須能夠檢視每個專案的當前進度狀態（基於已消逝時間與總時程的百分比自動計算）
- **FR-004**: 系統必須允許為專案指派負責人
- **FR-005**: 系統必須顯示每個專案的負責人資訊
- **FR-012**: 系統必須標記非活躍負責人（已離職或調動）但保留其指派記錄
- **FR-013**: 系統必須實施角色權限控制（檢視者/編輯者/管理員）

#### Permission Matrix

| Action | Viewer | Editor | Admin |
|--------|--------|--------|-------|
| 檢視甘特圖 | ✅ | ✅ | ✅ |
| 檢視專案詳情 | ✅ | ✅ | ✅ |
| 指派/變更負責人 | ❌ | ✅ | ✅ |
| 修改專案時間 | ❌ | ✅ | ✅ |
| 建立新專案 | ❌ | ❌ | ✅ |
| 刪除專案 | ❌ | ❌ | ✅ |
| 管理使用者角色 | ❌ | ❌ | ✅ |

- **FR-006**: 系統必須允許具有編輯權限的使用者設定和修改專案的開始時間
- **FR-007**: 系統必須允許具有編輯權限的使用者設定和修改專案的結束時間
- **FR-011**: 系統必須驗證專案結束時間不早於開始時間，否則顯示錯誤訊息並阻止儲存
- **FR-008**: 甘特圖必須支援時間軸縮放（日、週、月視圖）
- **FR-009**: 系統必須即時反映專案時程的變更
- **FR-010**: 系統必須處理專案時程重疊的顯示方式（使用獨立泳道垂直堆疊每個專案）

### Key Entities

- **專案 (Project)**: 代表一個工作項目，包含名稱、描述、開始時間、結束時間、進度百分比
- **負責人 (ResponsiblePerson)**: 代表專案負責的人員，包含姓名、聯絡資訊、職位
- **時程 (Timeline)**: 代表專案的時間安排，包含開始日期、結束日期、里程碑

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者能在 3 秒內載入包含 50 個專案的甘特圖檢視
- **SC-002**: 使用者能在首次使用時成功識別專案時程和負責人，驗證方式：
  - 甘特圖條狀圖清楚顯示專案名稱標籤
  - 滑鼠懸停時顯示完整專案資訊（開始日期、結束日期、負責人、進度百分比）
  - 負責人頭像或姓名縮寫直接顯示於條狀圖上
  - 色彩對比度符合 WCAG 2.1 AA 標準（4.5:1 最小對比度）
- **SC-003**: 專案時程修改後能在 1 秒內更新甘特圖顯示
- **SC-004**: 支援同時顯示 200 個專案而不影響視覺清晰度
- **SC-005**: 使用者完成專案負責人指派的平均時間少於 30 秒

## Clarifications

### Session 2025-11-25

- Q: Progress Calculation Method → A: Automatic calculation based on elapsed time vs total duration
- Q: Project Overlap Display Strategy → A: Separate swim lanes (rows) for each project with vertical stacking
- Q: Invalid Date Range Handling → A: Prevent saving with validation error message
- Q: Responsible Person Change Handling → A: Retain assignment with inactive flag
- Q: User Permission Model → A: Role-based permissions (viewer/editor/admin)

## Assumptions

- 使用者具備基本的專案管理概念
- 專案資料已存在於系統中
- 負責人資料可從現有使用者系統取得
- 甘特圖將在網頁瀏覽器中顯示
- 支援常見的日期格式（年/月/日）