import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, Dialogs } from '@nativescript/core'

interface FoodItem {
    id: string;
    name: string;
    amount: number;
    price: number;
    expiryDate: string;
    image?: string; // URL or placeholder
    shop?: string;
}

@Component({
  selector: 'Food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {
  foodItems: FoodItem[] = [
      {
          id: '1',
          name: '【張君雅】五香海苔休閒丸子',
          amount: 3,
          price: 0,
          expiryDate: '2026-01-05',
          image: 'https://img.pchome.com.tw/cs/items/DBAR5Q-A900A9R8H/000001_1603096238.jpg',
          shop: 'PChome'
      },
      {
          id: '2',
          name: '【張君雅】日式串燒休閒丸子',
          amount: 6,
          price: 0,
          expiryDate: '2026-01-06',
          image: 'https://img.pchome.com.tw/cs/items/DBAR5Q-A900A9R8H/000001_1603096238.jpg',
          shop: 'PChome'
      },
      {
          id: '3',
          name: '樂事',
          amount: 5,
          price: 0,
          expiryDate: '2026-01-21',
          image: 'https://www.lays.com.tw/images/products/lays_classic.png',
          shop: '7-11'
      },
      {
          id: '4',
          name: '萬丹保久乳',
          amount: 12,
          price: 0,
          expiryDate: '2026-02-25',
          image: 'https://www.wandan.com.tw/assets/images/product/milk_01.png',
          shop: '全聯'
      },
      {
          id: '5',
          name: '【義美】純豬肉鬆',
          amount: 1,
          price: 0,
          expiryDate: '2026-04-13',
          image: 'https://www.imeifoods.com.tw/assets/images/product/pork_floss.png',
          shop: '義美'
      },
      {
          id: '6',
          name: '【義美】煎餅 (花生) (杏仁)',
          amount: 7,
          price: 0,
          expiryDate: '2026-05-18',
          image: 'https://www.imeifoods.com.tw/assets/images/product/pancake.png',
          shop: '義美'
      }
  ];

  // Form model
  newName = "";
  newAmount = 1;
  newPrice = "";
  newDateYear = 2026;
  newDateMonth = 1;
  newDateDay = 12;
  newShop = "";
  newHash = "";
  
  // UI state
  activeTab = 'list';
  
  constructor() {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    // Init your component properties here.
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  
  onSync(): void {
      console.log("Syncing...");
      setTimeout(() => {
          Dialogs.alert("已同步完成！");
      }, 1000);
  }
  
  onAdd(): void {
      if (!this.newName) {
          Dialogs.alert("請輸入名稱");
          return;
      }

      const newId = (this.foodItems.length + 1).toString();
      const newItem: FoodItem = {
          id: newId,
          name: this.newName,
          amount: this.newAmount,
          price: this.newPrice ? parseInt(this.newPrice) : 0,
          expiryDate: `${this.newDateYear}-${this.newDateMonth.toString().padStart(2, '0')}-${this.newDateDay.toString().padStart(2, '0')}`,
          shop: this.newShop,
          image: '' // Placeholder
      };

      this.foodItems.push(newItem);
      
      // Reset form
      this.newName = "";
      this.newAmount = 1;
      this.newPrice = "";
      this.newShop = "";
      this.newHash = "";
      
      console.log("Added:", newItem);
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
          }
      });
  }
  
  onSelectPhoto(): void {
      console.log("Selecting photo...");
      Dialogs.alert("選擇圖片功能尚未實作");
  }
  
  setActiveTab(tab: string): void {
      this.activeTab = tab;
      console.log("Active tab:", tab);
  }
}
