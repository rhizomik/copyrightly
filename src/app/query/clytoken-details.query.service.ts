import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { CLYToken } from '../clytoken/clytoken';

export interface TokensListResponse {
  erc20Tokens: CLYToken[];
}

@Injectable({
  providedIn: 'root',
})
export class CLYTokenDetailsQueryService extends Query<TokensListResponse> {
  document = gql`
  query GetTokenDetails($symbol: String!) {
    erc20Tokens(where: { symbol: $symbol}) {
      id
      name
      symbol
      decimals
      supply
      balance
      holders (first: 10, orderBy: staked, orderDirection: desc) {
        id
        staked
      }
      price
      pricePoints (first: 25, orderBy: timestamp, orderDirection: desc) {
        price
        amount
        type
        supply
        balance
        timestamp
      }
    }
  }`;
}
