import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

@NgModule({
  imports: [BrowserModule, HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => ({
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'https://api.studio.thegraph.com/query/1303/copyrightly/0.0.4',
          }),
        }),
      deps: [HttpLink],
    },
  ],
})
export class QueryModule {}
