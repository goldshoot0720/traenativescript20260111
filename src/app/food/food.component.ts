import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'

interface FoodItem {
    id: string;
    name: string;
    amount: number;
    price: number;
    expiryDate: string;
    image?: string; // URL or placeholder
}

@Component({
  selector: 'Food',
  templateUrl: './food.component.html',
})
export class FoodComponent implements OnInit {
  foodItems: FoodItem[] = [
      {
          id: '1',
          name: '樂事',
          amount: 5,
          price: 0,
          expiryDate: '2026-01-21',
          image: 'https://via.placeholder.com/50'
      },
      {
          id: '2',
          name: '萬丹保久乳',
          amount: 12,
          price: 0,
          expiryDate: '2026-02-25',
          image: 'https://via.placeholder.com/50'
      },
      {
          id: '3',
          name: '【義美】純豬肉鬆',
          amount: 1,
          price: 0,
          expiryDate: '2026-04-13',
          image: 'https://via.placeholder.com/50'
      },
      {
          id: '4',
          name: '【義美】煎餅 (花生) (杏仁)',
          amount: 7,
          price: 0,
          expiryDate: '2026-05-18',
          image: 'https://via.placeholder.com/50'
      },
      {
          id: '5',
          name: '黑松FIN補給飲料',
          amount: 6,
          price: 0,
          expiryDate: '2026-06-09',
          image: 'https://via.placeholder.com/50'
      },
       {
          id: '6',
          name: '義美榛果巧克力酥片',
          amount: 1,
          price: 0,
          expiryDate: '2026-07-14',
          image: 'https://via.placeholder.com/50'
      }
  ];

  // Form model
  newName = "";
  newAmount = 1;
  newPrice = "";
  newDateYear = 2026;
  newDateMonth = 1;
  newDateDay = 11;
  newShop = "";
  newHash = "";

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

  onDelete(item: FoodItem): void {
      console.log("Deleting...", item);
  }
  
  onSelectPhoto(): void {
      console.log("Selecting photo...");
  }
}
