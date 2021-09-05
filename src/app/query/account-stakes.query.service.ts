import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { Account } from '../clytoken/clytoken';

export interface AccountStakesResponse {
  account: Account[];
}

@Injectable({
  providedIn: 'root',
})
export class AccountStakesDetailsQueryService extends Query<AccountStakesResponse> {
  document = gql`
  query AccountStakesDetails($id: ID!) {
    account(id: $id) {
      id
      staked
      stakes (orderBy: staked, orderDirection: desc) {
        stakable
        item {
          hash
          title
        }
        staked
      }
    }
  }`;
}
