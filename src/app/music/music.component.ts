import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings, Dialogs, Utils, File, knownFolders, path } from '@nativescript/core'

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  audioUrl: string;
  isLyricsVisible: boolean;
  lyricsPath?: string; // Optional path to local lyrics file
}

@Component({
  selector: 'Music',
  templateUrl: './music.component.html',
})
export class MusicComponent implements OnInit {
  isLoading = false;
  tracks: MusicTrack[] = [];

  // Default demo data
  private defaultTracks: MusicTrack[] = [
    { 
      id: '1', 
      title: 'Demo Song (Never Gonna Give You Up)', 
      artist: 'Rick Astley', 
      lyrics: "We're no strangers to love\nYou know the rules and so do I...", 
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      isLyricsVisible: false 
    }
  ];

  constructor() {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    this.loadMusic();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  loadMusic(): void {
      const spaceId = ApplicationSettings.getString("contentfulSpaceId");
      const accessToken = ApplicationSettings.getString("contentfulAccessToken");
      const environment = ApplicationSettings.getString("contentfulEnvironment", "master");

      let localTracks: MusicTrack[] = [
          { id: 'l1', title: '史上最瞎結婚理由', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/史上最瞎結婚理由.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/史上最瞎結婚理由.txt' },
          { id: 'l2', title: '史上最瞎結婚理由 (日語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/史上最瞎結婚理由 日語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/史上最瞎結婚理由 日語.txt' },
          { id: 'l3', title: '史上最瞎結婚理由 (粵語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/史上最瞎結婚理由 粵語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/史上最瞎結婚理由 粵語.txt' },
          { id: 'l4', title: '史上最瞎結婚理由 (英語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/史上最瞎結婚理由 英語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/史上最瞎結婚理由 英語.txt' },
          { id: 'l5', title: '史上最瞎結婚理由 (韓語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/史上最瞎結婚理由 韓語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/史上最瞎結婚理由 韓語.txt' },
          
          { id: 'l6', title: '塗哥水電王子爆紅', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/塗哥水電王子爆紅.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/塗哥水電王子爆紅.txt' },
          { id: 'l7', title: '塗哥水電王子爆紅 (日語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/塗哥水電王子爆紅 日語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/塗哥水電王子爆紅 日語.txt' },
          { id: 'l8', title: '塗哥水電王子爆紅 (粵語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/塗哥水電王子爆紅 粵語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/塗哥水電王子爆紅 粵語.txt' },
          { id: 'l9', title: '塗哥水電王子爆紅 (英語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/塗哥水電王子爆紅 英語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/塗哥水電王子爆紅 英語.txt' },
          { id: 'l10', title: '塗哥水電王子爆紅 (韓語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/塗哥水電王子爆紅 韓語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/塗哥水電王子爆紅 韓語.txt' },

          { id: 'l11', title: '鋒兄進化Show🔥', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/鋒兄進化Show🔥.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/鋒兄進化Show🔥.txt' },
          { id: 'l12', title: '鋒兄進化Show🔥 (日語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/鋒兄進化Show🔥 日語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/鋒兄進化Show🔥 日語.txt' },
          { id: 'l13', title: '鋒兄進化Show🔥 (粵語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/鋒兄進化Show🔥 粵語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/鋒兄進化Show🔥 粵語.txt' },
          { id: 'l14', title: '鋒兄進化Show🔥 (英語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/鋒兄進化Show🔥 英語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/鋒兄進化Show🔥 英語.txt' },
          { id: 'l15', title: '鋒兄進化Show🔥 (韓語)', artist: '鋒兄', lyrics: '', audioUrl: '~/assets/music/鋒兄進化Show🔥 韓語.mp3', isLyricsVisible: false, lyricsPath: 'assets/music/鋒兄進化Show🔥 韓語.txt' },
      ];

      // Load lyrics for local tracks
      localTracks.forEach(track => {
          if (track.lyricsPath) {
              const appPath = knownFolders.currentApp().path;
              const fullPath = path.join(appPath, track.lyricsPath);
              if (File.exists(fullPath)) {
                  File.fromPath(fullPath).readText().then(content => {
                      track.lyrics = content;
                  }).catch(err => {
                      console.error(`Failed to load lyrics for ${track.title}:`, err);
                  });
              }
          }
      });

      if (!spaceId || !accessToken) {
          console.log("No Contentful settings found, using local items.");
          this.tracks = [...localTracks];
          return;
      }

      this.isLoading = true;
      // Fetch entries of content type 'music'
      // Note: User needs to create Content Type 'music' in Contentful
      const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=music&include=1`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
              this.isLoading = false;
              let contentfulTracks: MusicTrack[] = [];

              if (data.items && data.items.length > 0) {
                  // Helper to resolve asset URL
                  const getAssetUrl = (assetId: string) => {
                      const asset = data.includes?.Asset?.find((a: any) => a.sys.id === assetId);
                      return asset ? 'https:' + asset.fields.file.url : '';
                  };

                  contentfulTracks = data.items.map((item: any) => {
                      const fields = item.fields;
                      let audioUrl = '';
                      
                      // Resolve audio asset if it exists
                      if (fields.audio && fields.audio.sys) {
                          audioUrl = getAssetUrl(fields.audio.sys.id);
                      }

                      return {
                          id: item.sys.id,
                          title: fields.title || 'Unknown Title',
                          artist: fields.artist || 'Unknown Artist',
                          lyrics: fields.lyrics || '無歌詞',
                          audioUrl: audioUrl,
                          isLyricsVisible: false
                      };
                  });
              } else {
                  // Fallback or empty state
                  if (data.sys && data.sys.type === 'Error') {
                      console.log("Content Type 'music' might not exist yet or other error.");
                  }
              }

              // Merge local tracks with Contentful tracks
              this.tracks = [...localTracks, ...contentfulTracks];
          })
          .catch(error => {
              this.isLoading = false;
              console.error("Contentful Fetch Error:", error);
              
              // Fallback to local tracks on error
              this.tracks = [...localTracks];

              Dialogs.alert({
                  title: "載入 Contentful 失敗",
                  message: "已切換至本地模式。若要顯示雲端音樂，請檢查 Contentful 設定。\nError: " + error.message,
                  okButtonText: "OK"
              });
          });
  }

  onRefresh(): void {
      this.loadMusic();
  }

  onPlay(track: MusicTrack): void {
      if (track.audioUrl) {
          let urlToOpen = track.audioUrl;
          
          // Handle local paths starting with ~
          if (urlToOpen.startsWith('~')) {
              const appPath = knownFolders.currentApp().path;
              // Remove ~/ or ~ and normalize separators
              const relativePath = urlToOpen.replace('~/', '').replace('~', '');
              const fullPath = path.join(appPath, relativePath);
              
              // On Android, we usually need file:// prefix for local files
              // However, modern Android might restrict file:// access. 
              // But for simple intent launching, let's try just the path or file:// path.
              urlToOpen = fullPath;
          }

          console.log("Opening URL:", urlToOpen);
          const success = Utils.openUrl(urlToOpen);
          
          if (!success) {
               // Try adding file:// prefix if it failed and looks like a local path
               if (!urlToOpen.startsWith('http') && !urlToOpen.startsWith('file://')) {
                   Utils.openUrl('file://' + urlToOpen);
               }
          }
      } else {
          Dialogs.alert({
              title: "無法播放",
              message: "找不到音訊檔案連結。",
              okButtonText: "確定"
          });
      }
  }

  onToggleLyrics(track: MusicTrack): void {
      track.isLyricsVisible = !track.isLyricsVisible;
  }
}
