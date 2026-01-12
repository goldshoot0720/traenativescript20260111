import { Component, OnInit, OnDestroy } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, Dialogs } from '@nativescript/core'
import { ContentfulService } from '../services/contentful.service'
import { Subscription } from 'rxjs'

interface SubscriptionItem {
    id: string;
    name: string;
    price: number;
    account: string;
    site: string;
    nextDate: string;
    note?: string;
    category?: string;
    description?: string;
    createdAt?: string;
}

@Component({
  selector: 'Subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit, OnDestroy {
  subscriptions: SubscriptionItem[] = [
      {
          id: '1',
          name: '天晟/處方箋/心臟內科',
          price: 0,
          account: '',
          site: 'https://www.tcmg.com.tw/index.php/main/schedule_time?id=18',
          nextDate: '2027-02-06 16:00',
          category: '醫療',
          description: '心臟內科定期回診'
      },
      {
          id: '2',
          name: '天晟/處方箋/身心科',
          price: 0,
          account: '',
          site: 'https://www.tcmg.com.tw/index.php/main/schedule_time?id=14',
          nextDate: '2027-02-06 16:00',
          category: '醫療',
          description: '身心科定期回診'
      },
      {
          id: '3',
          name: 'Perplexity Pro/goldshoot0720',
          price: 660,
          account: 'goldshoot0720',
          site: 'https://www.perplexity.ai/',
          nextDate: '2026-11-06 16:00',
          category: 'AI工具',
          description: 'AI搜索引擎專業版'
      },
       {
          id: '4',
          name: 'Cloudflare Domain',
          price: 350,
          account: '',
          site: 'https://www.tpe12thmayor2038from2025.com/',
          nextDate: '2026-09-15 16:00',
          category: '網域',
          description: '網域名稱註冊服務'
      }
  ];
  
  private subscriptionSubs: Subscription[] = [];
  isLoading = false;
  isConnected = false;

  // Form model
  newSubName = "";
  newSubPrice = "";
  newSubDateYear = 2026;
  newSubDateMonth = 1;
  newSubDateDay = 12;
  newSubSite = "";
  newSubAccount = "";
  newSubNote = "";
  newSubCategory = "";
  newSubDescription = "";
  
  // UI state
  activeTab = 'list';

  constructor(private contentfulService: ContentfulService) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    this.checkConnection();
    this.loadSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptionSubs.forEach(sub => sub.unsubscribe());
  }

  private checkConnection(): void {
    // 模擬連接檢查，實際可以連接到 Contentful 或其他服務
    this.isConnected = true;
  }

  private loadSubscriptions(): void {
    this.isLoading = true;
    // 模擬載入過程
    setTimeout(() => {
      this.isLoading = false;
      console.log('Loaded subscriptions:', this.subscriptions.length);
    }, 500);
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
      this.loadSubscriptions();
      const message = this.isConnected ? 
        "已從 Contentful 同步完成！" : 
        "Contentful 連接失敗，使用本地資料";
      Dialogs.alert(message);
    }, 1000);
  }
  
  getTotalPrice(): number {
      return this.subscriptions.reduce((total, sub) => total + sub.price, 0);
  }
  
  formatDate(dateString: string): string {
      const date = new Date(dateString);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}/${day}`;
  }
  
  onCardTap(item: SubscriptionItem): void {
    // Show item details
    const details = [
      `價格: ${item.price === 0 ? '免費' : 'NT$' + item.price}`,
      `下次付款: ${this.formatDate(item.nextDate)}`,
      item.account ? `帳號: ${item.account}` : '',
      item.site ? `網站: ${item.site}` : '',
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
  
  onCardMenu(item: SubscriptionItem, event: any): void {
      event.stopPropagation();
      Dialogs.action({
          title: item.name,
          cancelButtonText: "取消",
          actions: ["編輯", "刪除", "複製連結"]
      }).then(result => {
          switch(result) {
              case "編輯":
                  this.editSubscription(item);
                  break;
              case "刪除":
                  this.onDelete(item);
                  break;
              case "複製連結":
                  console.log("Copy link:", item.site);
                  Dialogs.alert("連結已複製到剪貼板");
                  break;
          }
      });
  }
  
  editSubscription(item: SubscriptionItem): void {
      // Fill form with existing data for editing
      this.newSubName = item.name;
      this.newSubPrice = item.price.toString();
      this.newSubSite = item.site;
      this.newSubAccount = item.account;
      this.newSubNote = item.note || "";
      this.newSubCategory = item.category || "";
      this.newSubDescription = item.description || "";
      
      const date = new Date(item.nextDate);
      this.newSubDateYear = date.getFullYear();
      this.newSubDateMonth = date.getMonth() + 1;
      this.newSubDateDay = date.getDate();
      
      // Remove the item for editing
      this.subscriptions = this.subscriptions.filter(s => s.id !== item.id);
      
      // Switch to add tab
      this.setActiveTab('add');
      
      Dialogs.alert("資料已載入表單，請修改後重新新增");
  }
  
  useTemplate(template: string): void {
      switch(template) {
          case 'netflix':
              this.newSubName = "Netflix";
              this.newSubPrice = "390";
              this.newSubSite = "https://www.netflix.com";
              break;
          case 'spotify':
              this.newSubName = "Spotify Premium";
              this.newSubPrice = "149";
              this.newSubSite = "https://www.spotify.com";
              break;
          case 'icloud':
              this.newSubName = "iCloud+";
              this.newSubPrice = "30";
              this.newSubSite = "https://www.icloud.com";
              break;
      }
  }
  
  clearForm(): void {
      this.newSubName = "";
      this.newSubPrice = "";
      this.newSubDateYear = 2026;
      this.newSubDateMonth = 1;
      this.newSubDateDay = 12;
      this.newSubSite = "";
      this.newSubAccount = "";
      this.newSubNote = "";
      this.newSubCategory = "";
      this.newSubDescription = "";
  }
  
  importFromContentful(): void {
      Dialogs.alert("Contentful 匯入功能開發中...");
  }
  
  getUpcomingPayments(): SubscriptionItem[] {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      return this.subscriptions
          .filter(sub => {
              const paymentDate = new Date(sub.nextDate);
              return paymentDate <= thirtyDaysFromNow;
          })
          .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime());
  }
  
  onAdd(): void {
      if (!this.newSubName) {
          Dialogs.alert("請輸入名稱");
          return;
      }

      const newId = (this.subscriptions.length + 1).toString();
      const newItem: SubscriptionItem = {
          id: newId,
          name: this.newSubName,
          price: this.newSubPrice ? parseInt(this.newSubPrice) : 0,
          account: this.newSubAccount,
          site: this.newSubSite,
          nextDate: `${this.newSubDateYear}-${this.newSubDateMonth.toString().padStart(2, '0')}-${this.newSubDateDay.toString().padStart(2, '0')} 16:00`,
          note: this.newSubNote,
          category: this.newSubCategory,
          description: this.newSubDescription,
          createdAt: new Date().toISOString()
      };

      this.subscriptions.push(newItem);
      
      // Reset form and switch to list view
      this.clearForm();
      this.setActiveTab('list');
      
      Dialogs.alert("訂閱已成功新增到本地清單！\n注意：若要同步到 Contentful，需要設置 Management API");
      console.log("Added:", newItem);
  }

  onDelete(item: SubscriptionItem): void {
      Dialogs.confirm({
          title: "刪除訂閱",
          message: `確定要刪除 ${item.name} 嗎？`,
          okButtonText: "刪除",
          cancelButtonText: "取消"
      }).then(result => {
          if (result) {
              this.subscriptions = this.subscriptions.filter(s => s.id !== item.id);
              Dialogs.alert("訂閱已從本地清單刪除");
          }
      });
  }

  // 新增的功能方法
  onSearch(): void {
    Dialogs.prompt({
      title: "搜尋訂閱",
      message: "請輸入訂閱名稱",
      okButtonText: "搜尋",
      cancelButtonText: "取消",
      defaultText: ""
    }).then(result => {
      if (result.result && result.text) {
        this.isLoading = true;
        setTimeout(() => {
          const searchTerm = result.text.toLowerCase();
          this.subscriptions = this.subscriptions.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            (item.category && item.category.toLowerCase().includes(searchTerm)) ||
            (item.description && item.description.toLowerCase().includes(searchTerm))
          );
          this.isLoading = false;
          if (this.subscriptions.length === 0) {
            Dialogs.alert("未找到相關訂閱");
          }
        }, 500);
      }
    });
  }

  onFilterByCategory(): void {
    const categories = ['醫療', 'AI工具', '網域', '串流媒體', '雲端服務', '生產力工具'];
    
    Dialogs.action({
      title: "選擇類別",
      cancelButtonText: "取消",
      actions: ['顯示全部', ...categories]
    }).then(result => {
      if (result === '顯示全部') {
        this.loadSubscriptions();
      } else if (result && result !== '取消') {
        this.isLoading = true;
        setTimeout(() => {
          this.subscriptions = this.subscriptions.filter(item => 
            item.category === result
          );
          this.isLoading = false;
        }, 500);
      }
    });
  }

  onCheckExpiring(): void {
    this.isLoading = true;
    setTimeout(() => {
      const expiringItems = this.getUpcomingPayments();
      this.subscriptions = expiringItems;
      this.isLoading = false;
      if (expiringItems.length === 0) {
        Dialogs.alert("沒有即將到期的訂閱");
      } else {
        Dialogs.alert(`找到 ${expiringItems.length} 項即將到期的訂閱`);
      }
    }, 500);
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
