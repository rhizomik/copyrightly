import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilModule } from '../util/util.module';
import { AlertsModule } from '../alerts/alerts.module';
import { ManifestationsContractService } from './manifestations-contract.service';
import { ManifestSingleComponent } from './manifest/manifest-single.component';
import { ManifestationsSearchComponent } from './search/manifestations-search.component';
import { ManifestationsListComponent } from './list/manifestations-list.component';
import { ManifestUnregisteredDirective } from './manifest/manifest-unregistered.directive';
import { ManifestationDetailsComponent } from './details/manifestation-details.component';
import { ManifestEventComponent } from './manifest-event.component';
import { EvidenceModule } from '../evidence/evidence.module';
import { AuthenticationService } from '../navbar/authentication.service';
import { AppRoutingModule } from '../app-routing.module';
import { QueryModule } from '../query/query.module';
import { ManifestationStakeComponent } from './stake/manifestation-stake.component';

@NgModule({
  declarations: [
    ManifestSingleComponent,
    ManifestUnregisteredDirective,
    ManifestationsSearchComponent,
    ManifestationsListComponent,
    ManifestationDetailsComponent,
    ManifestEventComponent,
    ManifestationStakeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    UtilModule,
    AlertsModule,
    EvidenceModule,
    QueryModule
  ],
  exports: [
    ManifestSingleComponent,
    ManifestationsSearchComponent,
    ManifestationsListComponent
  ],
  providers: [
    ManifestationsContractService, AuthenticationService
  ],
  bootstrap: [ ManifestEventComponent ]
})
export class ManifestationsModule { }
