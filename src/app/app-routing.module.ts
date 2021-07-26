import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ManifestSingleComponent } from './manifestations/manifest/manifest-single.component';
import { ManifestationsSearchComponent } from './manifestations/search/manifestations-search.component';
import { ManifestationsListComponent } from './manifestations/list/manifestations-list.component';
import { ManifestationDetailsComponent } from './manifestations/details/manifestation-details.component';
import { CreatorDetailsComponent } from './creators/details/creator-details.component';
import { CreatorsSearchComponent } from './creators/search/creators-search.component';

const routes: Routes = [
  { path: 'manifestations/:id', component: ManifestationDetailsComponent, runGuardsAndResolvers: 'always' },
  { path: 'creators/:id', component: CreatorDetailsComponent, runGuardsAndResolvers: 'always' },
  { path: 'creators', component: CreatorsSearchComponent },
  { path: 'register', component: ManifestSingleComponent },
  { path: 'search', component: ManifestationsSearchComponent },
  { path: 'list', component: ManifestationsListComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: '**', redirectTo: '/about', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
