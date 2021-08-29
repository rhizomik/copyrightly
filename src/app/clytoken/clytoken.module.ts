import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilModule } from '../util/util.module';
import { CLYTokenContractService } from './clytoken-contract.service';
import { MintEventComponent } from './mint-event.component';
import { BurnEventComponent } from './burn-event.component';

@NgModule({
  declarations: [
    MintEventComponent,
    BurnEventComponent
  ],
  imports: [
    CommonModule,
    UtilModule
  ],
  exports: [],
  providers: [
    CLYTokenContractService
  ],
  bootstrap: [
    MintEventComponent,
    BurnEventComponent
  ]
})
export class ManifestationsModule { }
