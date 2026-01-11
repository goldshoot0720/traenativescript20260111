import { Component, OnInit, ViewContainerRef } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings, Dialogs, Utils } from '@nativescript/core'
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
      const spaceId = ApplicationSettings.getString("contentfulSpaceId");
      const accessToken = ApplicationSettings.getString("contentfulAccessToken");
      const environment = ApplicationSettings.getString("contentfulEnvironment", "master");

      let localItems: VideoItem[] = [
          // Add your local files here manually
          // { id: 'l1', title: 'My Local Video', url: '~/assets/videos/myvideo.mp4' }
      ];

      if (!spaceId || !accessToken) {
          console.log("No Contentful settings found, using default items.");
          this.items = [...localItems, ...this.defaultItems];
          return;
      }

      this.isLoading = true;
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
                      this.items = videoAssets.map((asset: any) => {
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
                          title: "無影片",
                          message: "Contentful 中找不到任何影片資產 (MIME type starting with 'video/')。",
                          okButtonText: "了解"
                      });
                  }
              } else {
                  this.items = []; 
                  Dialogs.alert({
                      title: "無資產",
                      message: "Contentful 中找不到任何資產。",
                      okButtonText: "了解"
                  });
              }
          })
          .catch(error => {
              this.isLoading = false;
              console.error("Contentful Fetch Error:", error);
              Dialogs.alert({
                  title: "載入失敗 (Load Failed)",
                  message: "無法從 Contentful 載入影片。\nError: " + error.message,
                  okButtonText: "OK"
              });
              this.items = [...this.defaultItems];
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
