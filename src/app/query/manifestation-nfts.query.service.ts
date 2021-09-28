import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { NFT } from '../clynft/nft';

export interface ManifestationNFTsResponse {
  copyrightLYNFTs: NFT[];
}
@Injectable({
  providedIn: 'root',
})
export class ManifestationNFTsQueryService extends Query<ManifestationNFTsResponse> {
  document = gql`
  query ListManifestationNFTs($hash: String!) {
    copyrightLYNFTs(where: { manifestation_contains: $hash } )
    {
      tokenId
      tokenUri
      manifestation {
        hash
      }
      minter {
        id
      }
    }
  }`;
}
