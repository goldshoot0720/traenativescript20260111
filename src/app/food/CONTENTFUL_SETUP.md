# Contentful 設置指南

## 概述

本食品管理系統已整合 Contentful CMS，可以從雲端獲取和管理食品資料。以下是完整的設置步驟。

## 1. 創建 Contentful 帳戶

1. 前往 [Contentful 官網](https://www.contentful.com/)
2. 點擊 "Start building for free" 註冊免費帳戶
3. 驗證電子郵件並完成註冊流程

## 2. 創建新的 Space

1. 登入 Contentful 控制台
2. 點擊 "Create space"
3. 選擇 "Free" 方案
4. 輸入 Space 名稱（例如：Food Management）
5. 點擊 "Create space"

## 3. 設置 Content Model

### 創建 Food Item Content Type

1. 在 Contentful 控制台中，點擊 "Content model"
2. 點擊 "Add content type"
3. 輸入以下資訊：
   - **Name**: Food Item
   - **API Identifier**: foodItem
   - **Description**: 食品項目資料

4. 點擊 "Create" 後，添加以下欄位：

#### 必要欄位

| 欄位名稱 | API ID | 類型 | 必填 | 說明 |
|---------|--------|------|------|------|
| Name | name | Short text | ✓ | 食品名稱 |
| Amount | amount | Integer | ✓ | 數量 |
| Expiry Date | expiryDate | Date & time | ✓ | 到期日期 |

#### 可選欄位

| 欄位名稱 | API ID | 類型 | 必填 | 說明 |
|---------|--------|------|------|------|
| Price | price | Number |  | 價格 |
| Shop | shop | Short text |  | 購買商店 |
| Image | image | Media |  | 商品圖片 |
| Description | description | Long text |  | 商品說明 |
| Category | category | Short text |  | 商品類別 |
| Barcode | barcode | Short text |  | 條碼 |
| Nutrition Info | nutritionInfo | JSON object |  | 營養資訊 |

### 欄位設置詳細說明

#### Name 欄位
- Type: Short text
- Field ID: name
- Validation: Required, Max length 100

#### Amount 欄位
- Type: Integer
- Field ID: amount
- Validation: Required, Min value 1

#### Price 欄位
- Type: Number
- Field ID: price
- Validation: Min value 0

#### Expiry Date 欄位
- Type: Date & time
- Field ID: expiryDate
- Validation: Required

#### Category 欄位
- Type: Short text
- Field ID: category
- Validation: Max length 50
- Help text: 例如：零食、飲品、主食、調料等

## 4. 獲取 API 金鑰

1. 在 Contentful 控制台中，前往 "Settings" > "API keys"
2. 點擊 "Add API key"
3. 輸入名稱（例如：Food App Key）
4. 複製以下資訊：
   - **Space ID**
   - **Content Delivery API - access token**

## 5. 更新應用程式配置

在 `src/app/services/contentful.service.ts` 中更新以下設定：

```typescript
// 替換為你的實際值
private readonly SPACE_ID = 'your-space-id-here';
private readonly ACCESS_TOKEN = 'your-access-token-here';
```

## 6. 添加測試資料

1. 在 Contentful 控制台中，前往 "Content"
2. 點擊 "Add entry" > "Food Item"
3. 填寫測試資料：

### 範例資料 1
- **Name**: 張君雅小妹妹點心麵
- **Amount**: 5
- **Price**: 25
- **Expiry Date**: 2026-03-15
- **Shop**: 7-11
- **Category**: 零食
- **Description**: 經典台灣零食

### 範例資料 2
- **Name**: 統一麥香奶茶
- **Amount**: 3
- **Price**: 20
- **Expiry Date**: 2026-02-20
- **Shop**: 全聯
- **Category**: 飲品
- **Description**: 香濃奶茶飲品

4. 點擊 "Publish" 發布內容

## 7. 測試連接

1. 啟動應用程式
2. 進入食品管理頁面
3. 點擊同步按鈕 🔄
4. 檢查連接狀態：
   - 綠色 "已連接 Contentful" = 成功
   - 橙色 "使用本地資料" = 連接失敗

## 8. 功能說明

### 已實現功能
- ✅ 從 Contentful 獲取食品清單
- ✅ 搜尋食品
- ✅ 按類別篩選
- ✅ 檢查即將到期的食品
- ✅ 連接狀態顯示
- ✅ 離線模式（使用本地資料）

### 待實現功能
- ⏳ 新增食品到 Contentful（需要 Management API）
- ⏳ 編輯食品資料
- ⏳ 刪除食品資料
- ⏳ 圖片上傳

## 9. 進階設置（可選）

### 環境變數
創建 `.env` 文件：
```
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-access-token
CONTENTFUL_ENVIRONMENT=master
```

### Management API（用於寫入操作）
如需實現新增、編輯、刪除功能：
1. 在 API keys 頁面創建 Management Token
2. 安裝 contentful-management SDK
3. 實現寫入操作

## 10. 疑難排解

### 常見問題

**Q: 顯示 "使用本地資料"**
A: 檢查 Space ID 和 Access Token 是否正確設置

**Q: 無法載入圖片**
A: 確保圖片 URL 包含 `https:` 前綴

**Q: 搜尋功能無效**
A: 檢查 Content Type ID 是否為 `foodItem`

**Q: 日期格式錯誤**
A: 確保 Contentful 中的日期格式為 YYYY-MM-DD

### 除錯步驟
1. 開啟瀏覽器開發者工具
2. 查看 Console 錯誤訊息
3. 檢查 Network 標籤中的 API 請求
4. 驗證 Contentful 控制台中的資料格式

## 11. 資源連結

- [Contentful 官方文檔](https://www.contentful.com/developers/docs/)
- [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- [Content Management API](https://www.contentful.com/developers/docs/references/content-management-api/)
- [JavaScript SDK](https://github.com/contentful/contentful.js)

## 支援

如有問題，請檢查：
1. Contentful 控制台中的資料是否正確發布
2. API 金鑰是否有效
3. 網路連接是否正常
4. 應用程式 Console 中的錯誤訊息