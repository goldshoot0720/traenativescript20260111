import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CONTENTFUL_CONFIG } from '../config/contentful.config';

export interface FoodItem {
  id: string;
  name: string;
  amount: number;
  price: number;
  expiryDate: string;
  shop?: string;
  image?: string;
  description?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {
  private foodItemsSubject = new BehaviorSubject<FoodItem[]>([]);
  public foodItems$ = this.foodItemsSubject.asObservable();
  
  // Contentful 配置
  private readonly SPACE_ID = CONTENTFUL_CONFIG.spaceId;
  private readonly ACCESS_TOKEN = CONTENTFUL_CONFIG.accessToken;
  private readonly CONTENT_TYPE_ID = CONTENTFUL_CONFIG.contentTypes.foodItem;
  private readonly BASE_URL = `https://cdn.contentful.com/spaces/${this.SPACE_ID}`;

  constructor(private http: HttpClient) {}

  /**
   * 獲取所有食品項目
   */
  getFoodItems(): Observable<FoodItem[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`
    });

    return this.http.get<any>(`${this.BASE_URL}/entries`, {
      headers,
      params: {
        content_type: this.CONTENT_TYPE_ID,
        order: '-sys.createdAt'
      }
    }).pipe(
      map((response: any) => {
        const items = response.items.map((entry: any) => this.mapContentfulToFoodItem(entry));
        this.foodItemsSubject.next(items);
        return items;
      }),
      catchError(error => {
        console.error('Error fetching food items:', error);
        return this.getFallbackDataObservable();
      })
    );
  }

  /**
   * 根據 ID 獲取單個食品項目
   */
  getFoodItem(id: string): Observable<FoodItem | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`
    });

    return this.http.get<any>(`${this.BASE_URL}/entries/${id}`, { headers }).pipe(
      map((entry: any) => this.mapContentfulToFoodItem(entry)),
      catchError(error => {
        console.error('Error fetching food item:', error);
        return of(null);
      })
    );
  }

  /**
   * 搜索食品項目
   */
  searchFoodItems(query: string): Observable<FoodItem[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`
    });

    return this.http.get<any>(`${this.BASE_URL}/entries`, {
      headers,
      params: {
        content_type: this.CONTENT_TYPE_ID,
        'fields.name[match]': query
      }
    }).pipe(
      map((response: any) => response.items.map((entry: any) => this.mapContentfulToFoodItem(entry))),
      catchError(error => {
        console.error('Error searching food items:', error);
        const fallbackData = this.getFallbackData();
        const filtered = fallbackData.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        return of(filtered);
      })
    );
  }

  /**
   * 根據類別獲取食品項目
   */
  getFoodItemsByCategory(category: string): Observable<FoodItem[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`
    });

    return this.http.get<any>(`${this.BASE_URL}/entries`, {
      headers,
      params: {
        content_type: this.CONTENT_TYPE_ID,
        'fields.category': category
      }
    }).pipe(
      map((response: any) => response.items.map((entry: any) => this.mapContentfulToFoodItem(entry))),
      catchError(error => {
        console.error('Error fetching food items by category:', error);
        const fallbackData = this.getFallbackData();
        const filtered = fallbackData.filter(item => item.category === category);
        return of(filtered);
      })
    );
  }

  /**
   * 獲取即將到期的食品項目
   */
  getExpiringFoodItems(days: number = 7): Observable<FoodItem[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const futureDateString = futureDate.toISOString().split('T')[0];

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`
    });
    
    return this.http.get<any>(`${this.BASE_URL}/entries`, {
      headers,
      params: {
        content_type: this.CONTENT_TYPE_ID,
        'fields.expiryDate[lte]': futureDateString
      }
    }).pipe(
      map((response: any) => response.items.map((entry: any) => this.mapContentfulToFoodItem(entry))),
      catchError(error => {
        console.error('Error fetching expiring food items:', error);
        const fallbackData = this.getFallbackData();
        const filtered = fallbackData.filter(item => item.expiryDate <= futureDateString);
        return of(filtered);
      })
    );
  }

  /**
   * 將 Contentful 條目映射為 FoodItem 介面
   */
  private mapContentfulToFoodItem(entry: any): FoodItem {
    const fields = entry.fields || {};
    return {
      id: entry.sys?.id || '',
      name: fields.name || '',
      amount: fields.amount || 0,
      price: fields.price || 0,
      expiryDate: fields.expiryDate || '',
      shop: fields.shop || '',
      image: fields.image?.fields?.file?.url ? `https:${fields.image.fields.file.url}` : '',
      description: fields.description || '',
      category: fields.category || '',
      createdAt: entry.sys?.createdAt || '',
      updatedAt: entry.sys?.updatedAt || ''
    };
  }

  /**
   * 後備數據（當 Contentful 無法連接時使用）
   */
  private getFallbackData(): FoodItem[] {
    return [
      {
        id: '1',
        name: '【張君雅】五香海苔休閒丸子',
        amount: 3,
        price: 25,
        expiryDate: '2026-01-05',
        image: 'https://img.pchome.com.tw/cs/items/DBAR5Q-A900A9R8H/000001_1603096238.jpg',
        shop: 'PChome',
        category: '零食'
      },
      {
        id: '2',
        name: '【張君雅】日式串燒休閒丸子',
        amount: 6,
        price: 30,
        expiryDate: '2026-01-06',
        image: 'https://img.pchome.com.tw/cs/items/DBAR5Q-A900A9R8H/000001_1603096238.jpg',
        shop: 'PChome',
        category: '零食'
      },
      {
        id: '3',
        name: '樂事洋芋片',
        amount: 5,
        price: 35,
        expiryDate: '2026-01-21',
        shop: '7-11',
        category: '零食'
      },
      {
        id: '4',
        name: '萬丹保久乳',
        amount: 12,
        price: 28,
        expiryDate: '2026-02-25',
        shop: '全聯',
        category: '飲品'
      },
      {
        id: '5',
        name: '【義美】純豬肉鬆',
        amount: 1,
        price: 85,
        expiryDate: '2026-04-13',
        shop: '義美',
        category: '調料'
      },
      {
        id: '6',
        name: '【義美】煎餅 (花生)',
        amount: 7,
        price: 45,
        expiryDate: '2026-05-18',
        shop: '義美',
        category: '零食'
      }
    ];
  }

  private getFallbackDataObservable(): Observable<FoodItem[]> {
    const fallbackData = this.getFallbackData();
    this.foodItemsSubject.next(fallbackData);
    return of(fallbackData);
  }

  /**
   * 檢查 Contentful 連接狀態
   */
  checkConnection(): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`
    });

    return this.http.get<any>(`https://cdn.contentful.com/spaces/${this.SPACE_ID}`, { headers }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}