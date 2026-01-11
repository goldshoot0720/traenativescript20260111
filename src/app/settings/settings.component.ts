import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'

@Component({
  selector: 'Settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  // Contentful Configuration
  contentfulSpaceId = "";
  contentfulAccessToken = "";
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
    // Init your component properties here.
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  
  onSaveContentful(): void {
      console.log("Saving Contentful settings...");
      console.log("Space ID:", this.contentfulSpaceId);
      console.log("Access Token:", this.contentfulAccessToken);
  }
  
  onSyncNow(): void {
      console.log("Syncing now...");
  }
  
  onResetData(): void {
      console.log("Resetting data...");
  }
}
