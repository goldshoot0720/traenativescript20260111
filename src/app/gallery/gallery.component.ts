import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings, Dialogs, Folder, knownFolders, path, File } from '@nativescript/core'

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
      this.isLoading = true;
      
      // Load local images dynamically from assets/images
      const appPath = knownFolders.currentApp().path;
      const imagesPath = path.join(appPath, 'assets/images');
      
      let localItems: GalleryItem[] = [];

      if (Folder.exists(imagesPath)) {
          const folder = Folder.fromPath(imagesPath);
          folder.getEntities()
              .then(entities => {
                  localItems = entities
                      .filter(entity => {
                          const name = entity.name.toLowerCase();
                          return (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg'));
                      })
                      .map(entity => {
                          return {
                              id: entity.name,
                              title: entity.name,
                              url: `~/assets/images/${entity.name}`,
                              description: 'Local Image'
                          };
                      });
                  
                  this.processContentful(localItems);
              })
              .catch(err => {
                  console.error("Error loading local images:", err);
                  this.processContentful([]);
              });
      } else {
          console.warn("assets/images folder not found at:", imagesPath);
          this.processContentful([]);
      }
  }

  processContentful(localItems: GalleryItem[]) {
      const spaceId = ApplicationSettings.getString("contentfulSpaceId");
      const accessToken = ApplicationSettings.getString("contentfulAccessToken");
      const environment = ApplicationSettings.getString("contentfulEnvironment", "master");

      this.items = [...localItems];

      if (!spaceId || !accessToken) {
          console.log("No Contentful settings found, using local items only.");
          this.isLoading = false;
          if (this.items.length === 0) {
              this.items = [...this.defaultItems];
          }
          return;
      }

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
                      const contentfulItems = imageAssets.map((asset: any) => {
                          return {
                              id: asset.sys.id,
                              title: asset.fields.title,
                              url: 'https:' + asset.fields.file.url,
                              description: asset.fields.description || ''
                          };
                      });
                      this.items = [...localItems, ...contentfulItems];
                  } else {
                      // Keep local items
                      if (this.items.length === 0) {
                           Dialogs.alert({
                              title: "無圖片",
                              message: "Contentful 中找不到任何圖片資產 (MIME type starting with 'image/')。",
                              okButtonText: "了解"
                          });
                      }
                  }
              } else {
                  // Keep local items
                  if (this.items.length === 0) {
                      Dialogs.alert({
                          title: "無圖片",
                          message: "Contentful 中找不到任何圖片資產 (Assets)。",
                          okButtonText: "了解"
                      });
                  }
              }
          })
          .catch(error => {
              this.isLoading = false;
              console.error("Contentful Fetch Error:", error);
              // Keep local items
              if (this.items.length === 0) {
                  this.items = [...this.defaultItems];
                  Dialogs.alert({
                      title: "載入失敗 (Load Failed)",
                      message: "無法從 Contentful 載入圖片。請檢查網路或設定。\nFailed to load from Contentful.\n" + error.message,
                      okButtonText: "OK"
                  });
              }
          });
  }

  onRefresh(): void {
      this.loadImages();
  }
}
