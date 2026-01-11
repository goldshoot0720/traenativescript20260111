import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { VideosRoutingModule } from './videos-routing.module'
import { VideosComponent } from './videos.component'

@NgModule({
  imports: [NativeScriptCommonModule, VideosRoutingModule],
  declarations: [VideosComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class VideosModule {}
