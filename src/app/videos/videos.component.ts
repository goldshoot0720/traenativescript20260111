import { Component, OnInit, ViewContainerRef } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings, Dialogs, Utils, Folder, knownFolders, path } from '@nativescript/core'
import { ModalDialogService, ModalDialogOptions } from '@nativescript/angular'
import { VideoModalComponent } from './video-modal.component'

interface VideoItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  thumbnail?: string; // Optional thumbnail
}

@Component({
  selector: 'Videos',
  templateUrl: './videos.component.html',
})
export class VideosComponent implements OnInit {
  isLoading = false;
  items: VideoItem[] = [];

  // Default placeholders
  private defaultItems: VideoItem[] = [
    { id: '1', title: 'Demo Video 1 (Youtube)', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Youtube Link Example' },
    { id: '2', title: 'Demo Video 2 (MP4)', url: 'https://www.w3schools.com/html/mov_bbb.mp4', description: 'Direct Video Link Example' }
  ];

  constructor(private modalService: ModalDialogService, private vcRef: ViewContainerRef) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    this.loadVideos();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  loadVideos(): void {
      this.isLoading = true;

      // Load local videos dynamically from assets/videos
      const appPath = knownFolders.currentApp().path;
      const videosPath = path.join(appPath, 'assets/videos');
      
      let localItems: VideoItem[] = [];

      if (Folder.exists(videosPath)) {
          const folder = Folder.fromPath(videosPath);
          folder.getEntities()
              .then(entities => {
                  localItems = entities
                      .filter(entity => {
                          const name = entity.name.toLowerCase();
                          return (name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.avi'));
                      })
                      .map(entity => {
                          return {
                              id: entity.name,
                              title: entity.name,
                              url: `~/assets/videos/${entity.name}`,
                              description: 'Local Video'
                          };
                      });
                  
                  this.processContentful(localItems);
              })
              .catch(err => {
                  console.error("Error loading local videos:", err);
                  this.processContentful([]);
              });
      } else {
          console.warn("assets/videos folder not found at:", videosPath);
          this.processContentful([]);
      }
  }

  processContentful(localItems: VideoItem[]) {
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

      // Fetch assets from Contentful and filter for videos
      const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/assets?access_token=${accessToken}`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
              this.isLoading = false;
              if (data.items && data.items.length > 0) {
                  // Filter for video MIME types
                  const videoAssets = data.items.filter((asset: any) => 
                      asset.fields.file.contentType && asset.fields.file.contentType.startsWith('video/')
                  );

                  if (videoAssets.length > 0) {
                      const contentfulItems = videoAssets.map((asset: any) => {
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
                              title: "無影片",
                              message: "Contentful 中找不到任何影片資產 (MIME type starting with 'video/')。",
                              okButtonText: "了解"
                          });
                      }
                  }
              } else {
                  // Keep local items
                  if (this.items.length === 0) { 
                      Dialogs.alert({
                          title: "無資產",
                          message: "Contentful 中找不到任何資產。",
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
                      message: "無法從 Contentful 載入影片。\nError: " + error.message,
                      okButtonText: "OK"
                  });
              }
          });
  }

  onRefresh(): void {
      this.loadVideos();
  }

  onPlay(item: VideoItem): void {
      const options: ModalDialogOptions = {
          viewContainerRef: this.vcRef,
          context: { url: item.url },
          fullscreen: true
      };

      this.modalService.showModal(VideoModalComponent, options)
          .then(() => {
              // Modal closed
          });
  }
}
