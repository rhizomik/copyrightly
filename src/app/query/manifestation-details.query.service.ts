import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { Manifestation } from '../manifestations/manifestation';

export interface ManifestationsListResponse {
  manifestations: Manifestation[];
}

@Injectable({
  providedIn: 'root',
})
export class ManifestationDetailsQueryService extends Query<ManifestationsListResponse> {
  document = gql`
  query GetManifestation($manifestationHash: String!) {
    manifestations(where: { hash: $manifestationHash })
    {
      id
      stakable
      hash
      authors
      title
      creationTime
      expiryTime
      evidenceCount
      transaction
      staked
      stakes {
        staker {
          id
        }
        staked
      }
    }
  }`;
}
