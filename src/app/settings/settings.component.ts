import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings, Dialogs } from '@nativescript/core'

@Component({
  selector: 'Settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  // Contentful Configuration
  contentfulSpaceId = "navontrqk0l3";
  contentfulAccessToken = "83Q5hThGBPCIgXAYX7Fc-gSUN-psxg_j-F-gXSskQBc";
  contentfulManagementToken = "CFPAT-gtUG-iZMJoejxGo3DPECH4Kjl8Hv0dqn5n-tV-WA318";
  contentfulEnvironment = "master";

  // System Status
  lastSyncTime = "2026-01-11 14:30:00";
  appVersion = "1.0.0";
  
  // Theme Settings
  darkMode = true;
  notificationsEnabled = true;

  constructor() {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    // Load settings if they exist
    if (ApplicationSettings.hasKey("contentfulSpaceId")) {
        this.contentfulSpaceId = ApplicationSettings.getString("contentfulSpaceId");
    }
    if (ApplicationSettings.hasKey("contentfulAccessToken")) {
        this.contentfulAccessToken = ApplicationSettings.getString("contentfulAccessToken");
    }
    if (ApplicationSettings.hasKey("contentfulManagementToken")) {
        this.contentfulManagementToken = ApplicationSettings.getString("contentfulManagementToken");
    }
    if (ApplicationSettings.hasKey("contentfulEnvironment")) {
        this.contentfulEnvironment = ApplicationSettings.getString("contentfulEnvironment");
    }
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  
  onSaveContentful(): void {
      ApplicationSettings.setString("contentfulSpaceId", this.contentfulSpaceId);
      ApplicationSettings.setString("contentfulAccessToken", this.contentfulAccessToken);
      ApplicationSettings.setString("contentfulManagementToken", this.contentfulManagementToken);
      ApplicationSettings.setString("contentfulEnvironment", this.contentfulEnvironment);
      
      Dialogs.alert({
          title: "設定已儲存",
          message: "您的 Contentful 設定已成功儲存至本機。",
          okButtonText: "確定"
      });
  }

  onTestToken(): void {
      const url = `https://cdn.contentful.com/spaces/${this.contentfulSpaceId}/environments/${this.contentfulEnvironment}/entries?access_token=${this.contentfulAccessToken}&limit=1`;
      
      fetch(url)
          .then(response => response.json())
          .then(data => {
              if (data.sys && data.sys.type === 'Array') {
                  Dialogs.alert({
                      title: "連線成功",
                      message: "Content Delivery API Token 驗證成功！",
                      okButtonText: "太棒了"
                  });
              } else {
                  console.error(data);
                  Dialogs.alert({
                      title: "驗證失敗",
                      message: "無法連接到 Contentful，請檢查您的 Space ID 或 Token。",
                      okButtonText: "我再檢查看看"
                  });
              }
          })
          .catch(error => {
              console.error(error);
              Dialogs.alert({
                  title: "連線錯誤",
                  message: "發生網路錯誤或無效的設定。\n" + error.message,
                  okButtonText: "確定"
              });
          });
  }
  
  onSyncNow(): void {
      console.log("Syncing now...");
  }
  
  onResetData(): void {
      console.log("Resetting data...");
  }
}
