import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilModule } from '../util/util.module';
import { AlertsModule } from '../alerts/alerts.module';
import { ManifestationsModule } from '../manifestations/manifestations.module';
import { EvidenceModule } from '../evidence/evidence.module';
import { AuthenticationService } from '../navbar/authentication.service';
import { AppRoutingModule } from '../app-routing.module';
import { ManifestationsContractService } from '../manifestations/manifestations-contract.service';
import { CreatorDetailsComponent } from './details/creator-details.component';
import { CreatorsSearchComponent } from './search/creators-search.component';

@NgModule({
  declarations: [
    CreatorDetailsComponent,
    CreatorsSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    UtilModule,
    AlertsModule,
    ManifestationsModule,
    EvidenceModule
  ],
  exports: [ ],
  providers: [
    ManifestationsContractService, AuthenticationService
  ],
  bootstrap: [ ]
})
export class CreatorsModule { }
