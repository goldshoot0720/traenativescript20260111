import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { GalleryRoutingModule } from './gallery-routing.module'
import { GalleryComponent } from './gallery.component'

@NgModule({
  imports: [NativeScriptCommonModule, GalleryRoutingModule],
  declarations: [GalleryComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class GalleryModule {}
