import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { Manifestation } from '../manifestations/manifestation';

export interface ManifestationsListResponse {
  manifestations: Manifestation[];
}

@Injectable({
  providedIn: 'root',
})
export class ManifestationsListQueryService extends Query<ManifestationsListResponse> {
  document = gql`
  query ListManifestations($authors: [Bytes]!) {
    manifestations(first: 20, orderBy: creationTime, orderDirection: desc, where: { authors_contains: $authors } )
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
    }
  }`;
}
