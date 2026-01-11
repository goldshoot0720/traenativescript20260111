import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule, registerElement } from '@nativescript/angular'
import { Video } from 'nativescript-videoplayer'

import { VideosRoutingModule } from './videos-routing.module'
import { VideosComponent } from './videos.component'
import { VideoModalComponent } from './video-modal.component'

registerElement('Video', () => Video)

@NgModule({
  imports: [NativeScriptCommonModule, VideosRoutingModule],
  declarations: [VideosComponent, VideoModalComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class VideosModule {}
