import { NgModule } from '@angular/core';
import { UtilModule } from '../util/util.module';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { CLYNFTContractService } from './clynft-contract.service';
import { NFTMintEventComponent } from './nftmint-event.component';

@NgModule({
  declarations: [
    NFTMintEventComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    UtilModule
  ],
  exports: [
  ],
  providers: [
    CLYNFTContractService
  ],
  bootstrap: [
    NFTMintEventComponent
  ]
})
export class CLYNFTModule { }
