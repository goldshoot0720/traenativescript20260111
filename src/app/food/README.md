# 食品管理系統 - Contentful 集成版

## 概述

本食品管理系統已完全集成 Contentful CMS，提供雲端數據管理功能。系統支援從 Contentful 獲取食品資料，並在連接失敗時自動切換到本地資料。

## 主要功能

### ✅ 已實現功能

**Contentful 集成**
- 從 Contentful 獲取食品清單
- 搜尋食品功能
- 按類別篩選食品
- 檢查即將到期的食品
- 連接狀態即時顯示
- 離線模式支援（自動切換本地資料）

**手機優化介面**
- 響應式手機介面設計
- 標籤式導航（清單/新增）
- 觸控優化的按鈕和輸入框
- 視覺反饋效果
- 載入狀態指示器

**進階功能**
- 🔍 即時搜尋
- 🏷️ 類別篩選
- ⚠️ 到期提醒
- 🔄 資料同步
- 📱 手機優化體驗

### ⏳ 待實現功能
- 新增食品到 Contentful（需要 Management API）
- 編輯食品資料
- 刪除 Contentful 中的食品
- 圖片上傳功能

## 快速開始

### 1. 設置 Contentful

請參考 `CONTENTFUL_SETUP.md` 文件進行詳細設置，或按以下步驟：

1. 註冊 [Contentful 帳戶](https://www.contentful.com/)
2. 創建新的 Space
3. 設置 Content Model（參考設置指南）
4. 獲取 API 金鑰
5. 更新應用程式配置

### 2. 更新配置

在 `src/app/services/contentful.service.ts` 中更新：

```typescript
private readonly SPACE_ID = 'your-actual-space-id';
private readonly ACCESS_TOKEN = 'your-actual-access-token';
```

### 3. 測試連接

1. 啟動應用程式
2. 進入食品管理頁面
3. 查看頂部連接狀態：
   - 🟢 "已連接 Contentful" = 成功連接
   - 🟠 "使用本地資料" = 連接失敗，使用後備資料

## 介面說明

### 頂部導航
- **🍎 應用圖標**: 品牌標識
- **連接狀態**: 顯示 Contentful 連接狀況
- **🔍 搜尋按鈕**: 搜尋食品
- **🔄 同步按鈕**: 重新載入資料

### 標籤導航
- **📋 清單**: 顯示食品清單和數量
- **➕ 新增**: 新增食品表單
- **🏷️ 分類**: 按類別篩選
- **⚠️ 到期**: 檢查即將到期食品

### 食品清單
- **點擊項目**: 查看詳細資訊
- **🗑️ 刪除**: 從清單中移除
- **類別標籤**: 顯示食品分類
- **到期提醒**: 紅色顯示到期日

### 新增表單
- **必填欄位**: 名稱、數量、到期日期
- **可選欄位**: 價格、商店、類別、說明
- **清除按鈕**: 重置表單
- **新增按鈕**: 添加到本地清單

## 技術架構

### 前端技術
- **NativeScript + Angular**: 跨平台手機應用框架
- **TypeScript**: 強型別程式語言
- **SCSS**: 樣式預處理器
- **RxJS**: 響應式程式設計

### 後端服務
- **Contentful CMS**: 無頭內容管理系統
- **Content Delivery API**: 讀取資料
- **Content Management API**: 寫入資料（待實現）

### 資料流程
1. 應用啟動時檢查 Contentful 連接
2. 成功連接時從 Contentful 獲取資料
3. 連接失敗時使用本地後備資料
4. 所有操作都有錯誤處理和使用者反饋

## Content Model 結構

### Food Item Content Type

| 欄位 | API ID | 類型 | 必填 | 說明 |
|------|--------|------|------|------|
| 名稱 | name | Short text | ✓ | 食品名稱 |
| 數量 | amount | Integer | ✓ | 庫存數量 |
| 價格 | price | Number |  | 購買價格 |
| 到期日 | expiryDate | Date | ✓ | 到期日期 |
| 商店 | shop | Short text |  | 購買商店 |
| 圖片 | image | Media |  | 商品圖片 |
| 說明 | description | Long text |  | 商品描述 |
| 類別 | category | Short text |  | 食品分類 |

## 使用場景

### 日常使用
1. **查看庫存**: 開啟應用查看所有食品
2. **搜尋食品**: 使用搜尋功能快速找到特定食品
3. **檢查到期**: 點擊到期按鈕查看即將過期的食品
4. **分類管理**: 使用分類篩選整理不同類型食品
5. **新增食品**: 購買新食品時立即記錄

### 管理功能
1. **同步資料**: 定期同步確保資料最新
2. **離線使用**: 網路不穩定時仍可查看本地資料
3. **狀態監控**: 即時了解系統連接狀況

## 疑難排解

### 常見問題

**Q: 顯示 "使用本地資料"**
A: 檢查網路連接和 Contentful 配置是否正確

**Q: 搜尋功能無效**
A: 確認 Content Type ID 設置正確

**Q: 圖片無法顯示**
A: 檢查圖片 URL 格式和網路連接

**Q: 新增的食品不見了**
A: 目前新增功能僅保存在本地，重啟應用會重置

### 除錯步驟
1. 檢查瀏覽器 Console 錯誤訊息
2. 驗證 Contentful 控制台中的資料
3. 確認 API 金鑰有效性
4. 測試網路連接狀況

## 未來規劃

### 短期目標
- 實現 Management API 集成
- 新增食品直接保存到 Contentful
- 編輯和刪除功能
- 圖片上傳功能

### 長期目標
- 多使用者支援
- 食品營養資訊
- 購物清單功能
- 到期提醒推播
- 統計分析功能

## 相關文件

- `CONTENTFUL_SETUP.md`: 詳細設置指南
- `src/app/config/contentful.config.ts`: 配置文件
- `src/app/services/contentful.service.ts`: 服務實現

## 支援

如有問題或建議，請檢查：
1. Contentful 官方文檔
2. 應用程式 Console 錯誤訊息
3. 網路連接狀況
4. API 金鑰有效性