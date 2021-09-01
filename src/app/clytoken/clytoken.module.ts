import { NgModule } from '@angular/core';
import { UtilModule } from '../util/util.module';
import { CLYTokenContractService } from './clytoken-contract.service';
import { MintEventComponent } from './mint-event.component';
import { BurnEventComponent } from './burn-event.component';
import { CLYTokenDetailsComponent } from './details/clytoken-details.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    MintEventComponent,
    BurnEventComponent,
    CLYTokenDetailsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    UtilModule
  ],
  exports: [
    CLYTokenDetailsComponent
  ],
  providers: [
    CLYTokenContractService
  ],
  bootstrap: [
    MintEventComponent,
    BurnEventComponent
  ]
})
export class CLYTokenModule { }
