import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings, Dialogs } from '@nativescript/core'

interface BankItem {
  name: string;
  balance: number;
}

@Component({
  selector: 'Bank',
  templateUrl: './bank.component.html',
})
export class BankComponent implements OnInit {
  items: BankItem[] = [];
  statusText: string = "";

  // Default items from the screenshot
  private defaultItems: BankItem[] = [
    { name: '台北富邦', balance: 423 },
    { name: '國泰世華', balance: 360 },
    { name: '兆豐銀行', balance: 452 },
    { name: '王道銀行', balance: 500 },
    { name: '新光銀行', balance: 200 },
    { name: '中華郵政', balance: 601 },
    { name: '玉山銀行', balance: 496 },
    { name: '中國信託', balance: 1253 },
    { name: '台新銀行', balance: 611 }
  ];

  constructor() {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    this.onLoad();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  get totalAmount(): number {
    return this.items.reduce((sum, item) => sum + (Number(item.balance) || 0), 0);
  }

  onLoad(): void {
    const savedData = ApplicationSettings.getString("bankItems");
    if (savedData) {
      try {
        this.items = JSON.parse(savedData);
        this.updateStatus(`已讀取 ${this.items.length} 筆資料`);
      } catch (e) {
        console.error("Failed to parse saved bank data", e);
        this.items = this.defaultItems.map(item => ({ ...item }));
        this.updateStatus("讀取失敗，載入預設資料");
      }
    } else {
      this.items = this.defaultItems.map(item => ({ ...item }));
      this.updateStatus(`已讀取 ${this.items.length} 筆資料`);
    }
  }

  onSave(): void {
    try {
      ApplicationSettings.setString("bankItems", JSON.stringify(this.items));
      this.updateStatus(`已儲存 ${this.items.length} 筆資料`);
      Dialogs.alert({
        title: "儲存成功",
        message: "您的銀行速記已儲存至本機。",
        okButtonText: "確定"
      });
    } catch (e) {
      console.error("Failed to save bank data", e);
      Dialogs.alert({
        title: "儲存失敗",
        message: "無法儲存資料。\n" + e,
        okButtonText: "確定"
      });
    }
  }

  private updateStatus(msg: string): void {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0]; // HH:MM:SS
    this.statusText = `${msg} (${timeString})`;
  }
}
