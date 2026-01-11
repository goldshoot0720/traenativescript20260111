import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { MusicRoutingModule } from './music-routing.module'
import { MusicComponent } from './music.component'

@NgModule({
  imports: [NativeScriptCommonModule, MusicRoutingModule],
  declarations: [MusicComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MusicModule {}
