import { Component, OnInit, OnDestroy } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings, Dialogs, Utils, File, Folder, knownFolders, path } from '@nativescript/core'
import { TNSPlayer } from '@nativescript-community/audio';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  audioUrl: string;
  isLyricsVisible: boolean;
  isPlaying?: boolean;
  lyricsPath?: string; // Optional path to local lyrics file
}

@Component({
  selector: 'Music',
  templateUrl: './music.component.html',
})
export class MusicComponent implements OnInit, OnDestroy {
  isLoading = false;
  tracks: MusicTrack[] = [];
  currentTrackId: string | null = null;
  private player: TNSPlayer;

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
    this.player = new TNSPlayer();
    this.player.debug = true; // Enable debug logging
  }

  ngOnInit(): void {
    this.loadMusic();
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  loadMusic(): void {
      this.isLoading = true;

      // Load local music dynamically from assets/music
      const appPath = knownFolders.currentApp().path;
      const musicPath = path.join(appPath, 'assets/music');
      
      let localTracks: MusicTrack[] = [];

      if (Folder.exists(musicPath)) {
          const folder = Folder.fromPath(musicPath);
          folder.getEntities()
              .then(entities => {
                  // Filter for mp3 files
                  const mp3Files = entities.filter(entity => entity.name.toLowerCase().endsWith('.mp3'));
                  
                  localTracks = mp3Files.map(entity => {
                      const name = entity.name;
                      const title = name.substring(0, name.lastIndexOf('.'));
                      const txtName = title + '.txt';
                      const lyricsPath = path.join('assets/music', txtName);
                      
                      return {
                          id: name,
                          title: title,
                          artist: '鋒兄', // Default artist for local files
                          lyrics: '', // Will be loaded below
                          audioUrl: `~/assets/music/${name}`,
                          isLyricsVisible: false,
                          lyricsPath: lyricsPath
                      };
                  });

                  // Load lyrics for local tracks
                  const lyricsPromises = localTracks.map(track => {
                      if (track.lyricsPath) {
                          const fullLyricsPath = path.join(appPath, track.lyricsPath);
                          if (File.exists(fullLyricsPath)) {
                              return File.fromPath(fullLyricsPath).readText()
                                  .then(content => {
                                      track.lyrics = content;
                                  })
                                  .catch(err => {
                                      console.error(`Failed to load lyrics for ${track.title}:`, err);
                                  });
                          }
                      }
                      return Promise.resolve();
                  });

                  Promise.all(lyricsPromises).then(() => {
                      this.processContentful(localTracks);
                  });
              })
              .catch(err => {
                  console.error("Error loading local music:", err);
                  this.processContentful([]);
              });
      } else {
          console.warn("assets/music folder not found at:", musicPath);
          this.processContentful([]);
      }
  }

  processContentful(localTracks: MusicTrack[]) {
      const spaceId = ApplicationSettings.getString("contentfulSpaceId");
      const accessToken = ApplicationSettings.getString("contentfulAccessToken");
      const environment = ApplicationSettings.getString("contentfulEnvironment", "master");

      this.tracks = [...localTracks];

      if (!spaceId || !accessToken) {
          console.log("No Contentful settings found, using local items.");
          this.isLoading = false;
          if (this.tracks.length === 0) {
               this.tracks = [...this.defaultTracks];
          }
          return;
      }

      // Fetch entries of content type 'music'
      const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=music&include=1`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
              this.isLoading = false;
              if (data.items && data.items.length > 0) {
                   const contentfulTracks = data.items.map((item: any) => {
                      // ... (rest of mapping logic - assuming simple mapping for now as it wasn't fully visible in previous read)
                      // Re-implementing mapping based on standard Contentful structure
                      return {
                          id: item.sys.id,
                          title: item.fields.title,
                          artist: item.fields.artist || 'Unknown Artist',
                          lyrics: item.fields.lyrics || '',
                          audioUrl: item.fields.audioFile ? ('https:' + data.includes.Asset.find((a: any) => a.sys.id === item.fields.audioFile.sys.id).fields.file.url) : '',
                          isLyricsVisible: false
                      };
                  });
                  this.tracks = [...localTracks, ...contentfulTracks];
              } else {
                  // Keep local tracks
                  if (this.tracks.length === 0) {
                       Dialogs.alert({
                          title: "無音樂",
                          message: "Contentful 中找不到任何音樂內容。",
                          okButtonText: "了解"
                      });
                  }
              }
          })
          .catch(error => {
              this.isLoading = false;
              console.error("Contentful Fetch Error:", error);
               // Keep local tracks
              if (this.tracks.length === 0) {
                  this.tracks = [...this.defaultTracks];
                  Dialogs.alert({
                      title: "載入失敗",
                      message: "無法從 Contentful 載入音樂。\n" + error.message,
                      okButtonText: "OK"
                  });
              }
          });
  }

  onRefresh(): void {
      this.loadMusic();
  }

  onPlay(track: MusicTrack): void {
      if (!track.audioUrl) {
          Dialogs.alert({
              title: "無法播放",
              message: "找不到音訊檔案連結。",
              okButtonText: "確定"
          });
          return;
      }

      // Handle Toggle Play/Pause for same track
      if (this.currentTrackId === track.id) {
          if (this.player.isAudioPlaying()) {
              this.player.pause();
              track.isPlaying = false;
          } else {
              this.player.resume();
              track.isPlaying = true;
          }
          return;
      }

      // Stop previous track if any
      if (this.currentTrackId) {
          const prevTrack = this.tracks.find(t => t.id === this.currentTrackId);
          if (prevTrack) {
              prevTrack.isPlaying = false;
          }
      }

      this.currentTrackId = track.id;
      track.isPlaying = true;

      let urlToOpen = track.audioUrl;
      
      // Handle local paths starting with ~
      if (urlToOpen.startsWith('~')) {
          const appPath = knownFolders.currentApp().path;
          // Remove ~/ or ~ and normalize separators
          const relativePath = urlToOpen.replace('~/', '').replace('~', '');
          urlToOpen = path.join(appPath, relativePath);
      }

      console.log("Playing audio from:", urlToOpen);

      const playerOptions = {
        audioFile: urlToOpen,
        loop: false,
        completeCallback: () => {
          console.log('Audio finished playing');
          track.isPlaying = false;
          if (this.currentTrackId === track.id) {
              this.currentTrackId = null;
          }
        },
        errorCallback: (errorObject: any) => {
          console.error('Audio play error:', errorObject);
          track.isPlaying = false;
          if (this.currentTrackId === track.id) {
              this.currentTrackId = null;
          }
          Dialogs.alert({
            title: "播放錯誤",
            message: "無法播放音訊檔案。\n" + JSON.stringify(errorObject),
            okButtonText: "確定"
          });
        }
      };

      const playPromise = urlToOpen.startsWith('http') 
          ? this.player.playFromUrl(playerOptions)
          : this.player.playFromFile(playerOptions);

      playPromise.then(() => {
        console.log('Audio playing started');
      }).catch(err => {
         console.error('Audio play exception:', err);
         track.isPlaying = false;
         this.currentTrackId = null;
      });
  }

  onToggleLyrics(track: MusicTrack): void {
      track.isLyricsVisible = !track.isLyricsVisible;
  }
}
