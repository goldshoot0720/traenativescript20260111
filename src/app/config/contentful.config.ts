export interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  environment: string;
  contentTypes: {
    foodItem: string;
    category: string;
  };
}

// 開發環境配置
export const CONTENTFUL_CONFIG: ContentfulConfig = {
  spaceId: 'your-space-id',
  accessToken: 'your-access-token',
  environment: 'master',
  contentTypes: {
    foodItem: 'foodItem',
    category: 'category'
  }
};

// Contentful Content Type 定義
export const FOOD_ITEM_CONTENT_TYPE = {
  id: 'foodItem',
  name: 'Food Item',
  fields: [
    {
      id: 'name',
      name: 'Name',
      type: 'Symbol',
      required: true
    },
    {
      id: 'amount',
      name: 'Amount',
      type: 'Integer',
      required: true
    },
    {
      id: 'price',
      name: 'Price',
      type: 'Number'
    },
    {
      id: 'expiryDate',
      name: 'Expiry Date',
      type: 'Date',
      required: true
    },
    {
      id: 'shop',
      name: 'Shop',
      type: 'Symbol'
    },
    {
      id: 'image',
      name: 'Image',
      type: 'Link',
      linkType: 'Asset'
    },
    {
      id: 'description',
      name: 'Description',
      type: 'Text'
    },
    {
      id: 'category',
      name: 'Category',
      type: 'Symbol'
    },
    {
      id: 'barcode',
      name: 'Barcode',
      type: 'Symbol'
    },
    {
      id: 'nutritionInfo',
      name: 'Nutrition Information',
      type: 'Object'
    }
  ]
};

// 使用說明
export const CONTENTFUL_SETUP_INSTRUCTIONS = `
# Contentful 設置說明

## 1. 創建 Contentful 帳戶
1. 前往 https://www.contentful.com/ 註冊帳戶
2. 創建新的 Space

## 2. 獲取 API 金鑰
1. 在 Contentful 控制台中，前往 Settings > API keys
2. 創建新的 Content Delivery API key
3. 複製 Space ID 和 Access Token

## 3. 創建 Content Type
1. 前往 Content model
2. 創建新的 Content Type，命名為 "Food Item"
3. 添加以下欄位：
   - name (Short text, required)
   - amount (Integer, required)
   - price (Number)
   - expiryDate (Date & time, required)
   - shop (Short text)
   - image (Media)
   - description (Long text)
   - category (Short text)
   - barcode (Short text)
   - nutritionInfo (JSON object)

## 4. 更新配置
在 src/app/config/contentful.config.ts 中更新：
- CONTENTFUL_SPACE_ID: 你的 Space ID
- CONTENTFUL_ACCESS_TOKEN: 你的 Access Token

## 5. 環境變數（可選）
創建 .env 文件並添加：
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-access-token
CONTENTFUL_ENVIRONMENT=master
`;