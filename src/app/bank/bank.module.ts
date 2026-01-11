import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular'

import { BankRoutingModule } from './bank-routing.module'
import { BankComponent } from './bank.component'

@NgModule({
  imports: [NativeScriptCommonModule, BankRoutingModule, NativeScriptFormsModule],
  declarations: [BankComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BankModule {}
