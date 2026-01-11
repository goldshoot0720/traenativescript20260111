import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings, Dialogs } from '@nativescript/core'

interface GalleryItem {
  id: string;
  title: string;
  url: string;
  description?: string;
}

@Component({
  selector: 'Gallery',
  templateUrl: './gallery.component.html',
})
export class GalleryComponent implements OnInit {
  isLoading = false;
  items: GalleryItem[] = [];
  
  // Default placeholder if no contentful data
  private defaultItems: GalleryItem[] = [
    { id: '1', title: 'Default Image 1', url: 'https://placehold.co/300x200/png', description: 'Placeholder 1' },
    { id: '2', title: 'Default Image 2', url: 'https://placehold.co/300x200/png', description: 'Placeholder 2' }
  ];

  constructor() {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    this.loadImages();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  loadImages(): void {
      const spaceId = ApplicationSettings.getString("contentfulSpaceId");
      const accessToken = ApplicationSettings.getString("contentfulAccessToken");
      const environment = ApplicationSettings.getString("contentfulEnvironment", "master");
      
      // Always start with default/local items if you want them mixed in, 
      // or only use them as fallback. Here we use them as fallback or if specifically added.
      let localItems: GalleryItem[] = [
          // Add your local files here manually
          // { id: 'l1', title: 'My Local Pic', url: '~/assets/images/mypic.jpg' }
      ];

      if (!spaceId || !accessToken) {
          console.log("No Contentful settings found, using default items.");
          this.items = [...localItems, ...this.defaultItems];
          return;
      }

      this.isLoading = true;
      // Fetch assets (images) from Contentful
      const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/assets?access_token=${accessToken}`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
              this.isLoading = false;
              if (data.items && data.items.length > 0) {
                  // Filter for image MIME types
                  const imageAssets = data.items.filter((asset: any) => 
                      asset.fields.file.contentType && asset.fields.file.contentType.startsWith('image/')
                  );

                  if (imageAssets.length > 0) {
                      this.items = imageAssets.map((asset: any) => {
                          return {
                              id: asset.sys.id,
                              title: asset.fields.title,
                              url: 'https:' + asset.fields.file.url,
                              description: asset.fields.description || ''
                          };
                      });
                  } else {
                      this.items = [];
                      Dialogs.alert({
                          title: "無圖片",
                          message: "Contentful 中找不到任何圖片資產 (MIME type starting with 'image/')。",
                          okButtonText: "了解"
                      });
                  }
              } else {
                  // No assets found in Contentful
                  this.items = []; 
                  Dialogs.alert({
                      title: "無圖片",
                      message: "Contentful 中找不到任何圖片資產 (Assets)。",
                      okButtonText: "了解"
                  });
              }
          })
          .catch(error => {
              this.isLoading = false;
              console.error("Contentful Fetch Error:", error);
              Dialogs.alert({
                  title: "載入失敗 (Load Failed)",
                  message: "無法從 Contentful 載入圖片。請檢查網路或設定。\nFailed to load from Contentful.\n" + error.message,
                  okButtonText: "OK"
              });
              this.items = [...this.defaultItems];
          });
  }

  onRefresh(): void {
      this.loadImages();
  }
}
