import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, Dialogs } from '@nativescript/core'

interface Subscription {
    id: string;
    name: string;
    price: number;
    account: string;
    site: string;
    nextDate: string;
    note?: string;
}

@Component({
  selector: 'Subscriptions',
  templateUrl: './subscriptions.component.html',
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Subscription[] = [
      {
          id: '1',
          name: '天晟/處方箋/心臟內科',
          price: 0,
          account: '',
          site: 'https://www.tcmg.com.tw/index.php/main/schedule_time?id=18',
          nextDate: '2027-02-06 16:00'
      },
      {
          id: '2',
          name: '天晟/處方箋/身心科',
          price: 0,
          account: '',
          site: 'https://www.tcmg.com.tw/index.php/main/schedule_time?id=14',
          nextDate: '2027-02-06 16:00'
      },
      {
          id: '3',
          name: 'Perplexity Pro/goldshoot0720',
          price: 660,
          account: '',
          site: 'https://www.perplexity.ai/',
          nextDate: '2026-11-06 16:00'
      },
       {
          id: '4',
          name: 'Cloudflare Domain',
          price: 350,
          account: '',
          site: 'https://www.tpe12thmayor2038from2025.com/',
          nextDate: '2026-09-15 16:00'
      }
  ];

  // Form model
  newSubName = "";
  newSubPrice = "";
  newSubDateYear = 2026;
  newSubDateMonth = 1;
  newSubDateDay = 12;
  newSubSite = "";
  newSubAccount = "";
  newSubNote = "";

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
      // Simulate sync
      setTimeout(() => {
          Dialogs.alert("已同步完成！");
      }, 1000);
  }
  
  onAdd(): void {
      if (!this.newSubName) {
          Dialogs.alert("請輸入名稱");
          return;
      }

      const newId = (this.subscriptions.length + 1).toString();
      const newItem: Subscription = {
          id: newId,
          name: this.newSubName,
          price: this.newSubPrice ? parseInt(this.newSubPrice) : 0,
          account: this.newSubAccount,
          site: this.newSubSite,
          nextDate: `${this.newSubDateYear}-${this.newSubDateMonth.toString().padStart(2, '0')}-${this.newSubDateDay.toString().padStart(2, '0')} 16:00`,
          note: this.newSubNote
      };

      this.subscriptions.push(newItem);
      
      // Reset form
      this.newSubName = "";
      this.newSubPrice = "";
      this.newSubSite = "";
      this.newSubAccount = "";
      this.newSubNote = "";
      
      console.log("Added:", newItem);
  }

  onDelete(item: Subscription): void {
      Dialogs.confirm({
          title: "刪除訂閱",
          message: `確定要刪除 ${item.name} 嗎？`,
          okButtonText: "刪除",
          cancelButtonText: "取消"
      }).then(result => {
          if (result) {
              this.subscriptions = this.subscriptions.filter(s => s.id !== item.id);
          }
      });
  }
}
