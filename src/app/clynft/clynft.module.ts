import { NgModule } from '@angular/core';
import { UtilModule } from '../util/util.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { CLYNFTContractService } from './clynft-contract.service';
import { NFTMintEventComponent } from './nftmint-event.component';
import { LicenseTermsComponent } from './license-terms.component';

@NgModule({
  declarations: [
    NFTMintEventComponent,
    LicenseTermsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    UtilModule
  ],
  exports: [
  ],
  providers: [
    CLYNFTContractService
  ],
  bootstrap: [
    NFTMintEventComponent,
    LicenseTermsComponent
  ]
})
export class CLYNFTModule { }
