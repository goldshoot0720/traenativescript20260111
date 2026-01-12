import { Component, OnInit, OnDestroy } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, Dialogs } from '@nativescript/core'
import { ContentfulService, FoodItem } from '../services/contentful.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'Food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit, OnDestroy {
  foodItems: FoodItem[] = [];
  private subscriptions: Subscription[] = [];
  isLoading = false;
  isConnected = false;

  // Form model
  newName = "";
  newAmount = 1;
  newPrice = "";
  newDateYear = 2026;
  newDateMonth = 1;
  newDateDay = 12;
  newShop = "";
  newCategory = "";
  newDescription = "";
  
  // UI state
  activeTab = 'list';
  
  constructor(private contentfulService: ContentfulService) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    this.checkConnection();
    this.loadFoodItems();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private checkConnection(): void {
    const connectionSub = this.contentfulService.checkConnection().subscribe(
      connected => {
        this.isConnected = connected;
        if (!connected) {
          console.log('Contentful connection failed, using fallback data');
        }
      }
    );
    this.subscriptions.push(connectionSub);
  }

  private loadFoodItems(): void {
    this.isLoading = true;
    const foodSub = this.contentfulService.getFoodItems().subscribe(
      items => {
        this.foodItems = items;
        this.isLoading = false;
        console.log('Loaded food items:', items.length);
      },
      error => {
        console.error('Error loading food items:', error);
        this.isLoading = false;
        Dialogs.alert('載入食品資料時發生錯誤，使用本地資料');
      }
    );
    this.subscriptions.push(foodSub);
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  
  onSync(): void {
    console.log("Syncing with Contentful...");
    this.isLoading = true;
    
    // 重新檢查連接並載入資料
    this.checkConnection();
    
    setTimeout(() => {
      this.loadFoodItems();
      const message = this.isConnected ? 
        "已從 Contentful 同步完成！" : 
        "Contentful 連接失敗，使用本地資料";
      Dialogs.alert(message);
    }, 1000);
  }
  
  onAdd(): void {
    if (!this.newName) {
      Dialogs.alert("請輸入名稱");
      return;
    }

    // 注意：這裡只是本地添加，實際的 Contentful 寫入需要 Management API
    const newId = (this.foodItems.length + 1).toString();
    const newItem: FoodItem = {
      id: newId,
      name: this.newName,
      amount: this.newAmount,
      price: this.newPrice ? parseInt(this.newPrice) : 0,
      expiryDate: `${this.newDateYear}-${this.newDateMonth.toString().padStart(2, '0')}-${this.newDateDay.toString().padStart(2, '0')}`,
      shop: this.newShop,
      category: this.newCategory,
      description: this.newDescription,
      image: '' // Placeholder
    };

    this.foodItems.push(newItem);
    
    // Reset form and switch to list view
    this.onClear();
    this.setActiveTab('list');
    
    Dialogs.alert("食品已成功新增到本地清單！\n注意：若要同步到 Contentful，需要設置 Management API");
    console.log("Added:", newItem);
  }

  onClear(): void {
    this.newName = "";
    this.newAmount = 1;
    this.newPrice = "";
    this.newShop = "";
    this.newCategory = "";
    this.newDescription = "";
    this.newDateYear = 2026;
    this.newDateMonth = 1;
    this.newDateDay = 12;
  }

  onDelete(item: FoodItem): void {
    Dialogs.confirm({
      title: "刪除食品",
      message: `確定要刪除 ${item.name} 嗎？`,
      okButtonText: "刪除",
      cancelButtonText: "取消"
    }).then(result => {
      if (result) {
        this.foodItems = this.foodItems.filter(f => f.id !== item.id);
        Dialogs.alert("食品已從本地清單刪除");
      }
    });
  }
  
  onItemTap(item: FoodItem): void {
    // Show item details
    const details = [
      `數量: ${item.amount}`,
      `價格: NT$${item.price}`,
      `到期日: ${item.expiryDate}`,
      item.shop ? `商店: ${item.shop}` : '',
      item.category ? `類別: ${item.category}` : '',
      item.description ? `說明: ${item.description}` : '',
      item.createdAt ? `建立時間: ${new Date(item.createdAt).toLocaleDateString()}` : ''
    ].filter(line => line).join('\n');

    Dialogs.alert({
      title: item.name,
      message: details,
      okButtonText: "確定"
    });
  }

  onSearch(): void {
    Dialogs.prompt({
      title: "搜尋食品",
      message: "請輸入食品名稱",
      okButtonText: "搜尋",
      cancelButtonText: "取消",
      defaultText: ""
    }).then(result => {
      if (result.result && result.text) {
        this.isLoading = true;
        const searchSub = this.contentfulService.searchFoodItems(result.text).subscribe(
          items => {
            this.foodItems = items;
            this.isLoading = false;
            if (items.length === 0) {
              Dialogs.alert("未找到相關食品");
            }
          },
          error => {
            console.error('Search error:', error);
            this.isLoading = false;
            Dialogs.alert("搜尋時發生錯誤");
          }
        );
        this.subscriptions.push(searchSub);
      }
    });
  }

  onFilterByCategory(): void {
    const categories = ['零食', '飲品', '主食', '調料', '冷凍食品', '生鮮'];
    
    Dialogs.action({
      title: "選擇類別",
      cancelButtonText: "取消",
      actions: ['顯示全部', ...categories]
    }).then(result => {
      if (result === '顯示全部') {
        this.loadFoodItems();
      } else if (result && result !== '取消') {
        this.isLoading = true;
        const filterSub = this.contentfulService.getFoodItemsByCategory(result).subscribe(
          items => {
            this.foodItems = items;
            this.isLoading = false;
          },
          error => {
            console.error('Filter error:', error);
            this.isLoading = false;
            Dialogs.alert("篩選時發生錯誤");
          }
        );
        this.subscriptions.push(filterSub);
      }
    });
  }

  onCheckExpiring(): void {
    this.isLoading = true;
    const expiringSub = this.contentfulService.getExpiringFoodItems(7).subscribe(
      items => {
        this.foodItems = items;
        this.isLoading = false;
        if (items.length === 0) {
          Dialogs.alert("沒有即將到期的食品");
        } else {
          Dialogs.alert(`找到 ${items.length} 項即將到期的食品`);
        }
      },
      error => {
        console.error('Expiring check error:', error);
        this.isLoading = false;
        Dialogs.alert("檢查到期食品時發生錯誤");
      }
    );
    this.subscriptions.push(expiringSub);
  }
  
  onSelectPhoto(): void {
    console.log("Selecting photo...");
    Dialogs.alert("選擇圖片功能尚未實作");
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    console.log("Active tab:", tab);
  }

  getConnectionStatus(): string {
    return this.isConnected ? "已連接 Contentful" : "使用本地資料";
  }

  getConnectionStatusClass(): string {
    return this.isConnected ? "status-connected" : "status-offline";
  }
}
