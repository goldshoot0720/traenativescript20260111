# Contentful 設置指南

## 🎯 目標
連接到實際的 Contentful 資料，顯示約24筆訂閱管理和13筆食品管理資料。

## 📋 設置步驟

### 1. 獲取 Contentful 憑證

1. 登入你的 [Contentful](https://www.contentful.com/) 帳戶
2. 選擇你的 Space
3. 前往 **Settings** > **API keys**
4. 複製以下資訊：
   - **Space ID**
   - **Content Delivery API - access token**

### 2. 更新應用配置

編輯 `src/app/services/contentful.service.ts` 文件：

```typescript
// 將這些值替換為你的實際 Contentful 憑證
private readonly SPACE_ID = 'your-actual-space-id';  // 替換為你的 Space ID
private readonly ACCESS_TOKEN = 'your-actual-access-token';  // 替換為你的 Access Token
```

### 3. 確認 Content Types

確保你的 Contentful Space 中有以下 Content Types：

#### 食品管理 (foodItem)
- **Content Type ID**: `foodItem`
- **欄位**:
  - `name` (Text) - 食品名稱
  - `amount` (Integer) - 數量
  - `price` (Number) - 價格
  - `expiryDate` (Date) - 到期日期
  - `shop` (Text) - 商店
  - `image` (Media) - 圖片
  - `description` (Text) - 描述
  - `category` (Text) - 類別

#### 訂閱管理 (subscription)
- **Content Type ID**: `subscription`
- **欄位**:
  - `name` (Text) - 服務名稱
  - `price` (Number) - 價格
  - `account` (Text) - 帳號
  - `site` (Text) - 網站
  - `nextDate` (Date) - 下次付款日期
  - `note` (Text) - 備註
  - `category` (Text) - 類別
  - `description` (Text) - 描述

### 4. 測試連接

1. 更新配置後，重新構建應用：
   ```bash
   ns clean
   ns build android
   ```

2. 運行應用並檢查：
   - 訂閱管理頁面是否顯示實際資料
   - 食品管理頁面是否顯示實際資料
   - 連接狀態是否顯示 "已連接 Contentful"

### 5. 故障排除

如果連接失敗，應用會自動使用後備資料。檢查：

1. **Space ID 和 Access Token 是否正確**
2. **Content Type ID 是否匹配**
3. **網路連接是否正常**
4. **Contentful API 配額是否足夠**

### 6. 資料結構範例

#### 食品項目範例
```json
{
  "name": "【張君雅】五香海苔休閒丸子",
  "amount": 3,
  "price": 25,
  "expiryDate": "2026-01-05",
  "shop": "PChome",
  "category": "零食",
  "description": "美味的海苔丸子零食"
}
```

#### 訂閱項目範例
```json
{
  "name": "Netflix Premium",
  "price": 390,
  "account": "user@example.com",
  "site": "https://www.netflix.com/",
  "nextDate": "2026-02-15T16:00:00.000Z",
  "category": "串流媒體",
  "description": "影片串流服務"
}
```

## 🔧 進階配置

### 環境變數 (可選)
如果你想使用環境變數來管理憑證，可以創建 `.env` 文件：

```env
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-access-token
```

### 多環境支援
你可以為不同環境設置不同的 Space：
- 開發環境：測試資料
- 生產環境：實際資料

## 📊 預期結果

設置完成後，你應該看到：
- ✅ 訂閱管理：約24筆實際資料
- ✅ 食品管理：約13筆實際資料
- ✅ 連接狀態：顯示 "已連接 Contentful"
- ✅ 所有功能正常運作（搜尋、篩選、分類等）

## 🆘 需要幫助？

如果遇到問題，請檢查：
1. 瀏覽器開發者工具的網路請求
2. 應用的控制台日誌
3. Contentful 的 API 使用情況

---

**注意**: 請確保不要將 Access Token 提交到公開的程式碼庫中！