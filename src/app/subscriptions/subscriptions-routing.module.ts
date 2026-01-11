import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { SubscriptionsComponent } from './subscriptions.component'

const routes: Routes = [{ path: '', component: SubscriptionsComponent }]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class SubscriptionsRoutingModule {}
