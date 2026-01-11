import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'

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
  newSubDateDay = 11;
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
  }
  
  onAdd(): void {
      console.log("Adding...");
  }

  onDelete(item: Subscription): void {
      console.log("Deleting...", item);
  }
}
