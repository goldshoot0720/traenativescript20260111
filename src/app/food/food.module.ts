import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular'

import { FoodRoutingModule } from './food-routing.module'
import { FoodComponent } from './food.component'

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptFormsModule, FoodRoutingModule],
  declarations: [FoodComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FoodModule {}
