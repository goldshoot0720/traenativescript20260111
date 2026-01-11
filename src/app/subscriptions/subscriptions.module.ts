import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular'

import { SubscriptionsRoutingModule } from './subscriptions-routing.module'
import { SubscriptionsComponent } from './subscriptions.component'

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptFormsModule, SubscriptionsRoutingModule],
  declarations: [SubscriptionsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SubscriptionsModule {}
