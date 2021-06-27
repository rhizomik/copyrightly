import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ManifestSingleComponent } from './manifestations/manifest/manifest-single.component';
import { ManifestationsSearchComponent } from './manifestations/search/manifestations-search.component';
import { ManifestationsListComponent } from './manifestations/list/manifestations-list.component';
import { ManifestationsListAllComponent } from './manifestations/list/manifestations-list-all.component';
import { ManifestationDetailsComponent } from './manifestations/details/manifestation-details.component';

const routes: Routes = [
  { path: 'manifestations/:id', component: ManifestationDetailsComponent,
    data: { isAuthenticated: true }, runGuardsAndResolvers: 'always' },
  { path: 'register', component: ManifestSingleComponent, data: { isAuthenticated: true } },
  { path: 'search', component: ManifestationsSearchComponent, data: { isAuthenticated: true } },
  { path: 'list', component: ManifestationsListComponent, data: { isAuthenticated: true } },
  { path: 'list-all', component: ManifestationsListAllComponent, data: { isAuthenticated: true } },
  { path: 'about', component: AboutComponent , data: { isAuthenticated: false } },
  { path: '', redirectTo: '/about', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }