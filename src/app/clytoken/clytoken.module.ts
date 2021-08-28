import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilModule } from '../util/util.module';
import { CLYTokenContractService } from './clytoken-contract.service';
import { MintEventComponent } from './mint-event.component';

@NgModule({
  declarations: [
    MintEventComponent
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
    MintEventComponent
  ]
})
export class ManifestationsModule { }
