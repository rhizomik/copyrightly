import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AlertsService } from '../../alerts/alerts.service';
import { Location } from '@angular/common';
import { AccountStakesDetailsQueryService, AccountStakesResponse } from '../../query/account-stakes.query.service';
import { Account } from '../../clytoken/clytoken';
import { Core, PublicID } from '@self.id/core';
import { BasicProfile, ImageSources } from '@datamodels/identity-profile-basic';
import { AlsoKnownAs } from '@datamodels/identity-accounts-web';
import { Subscription } from 'rxjs';
import { QueryRef } from 'apollo-angular';
import { NavbarService } from '../../navbar/navbar.service';

@Component({
  selector: 'app-creator-details',
  templateUrl: './creator-details.component.html',
  styleUrls: ['./creator-details.component.css']
})
export class CreatorDetailsComponent implements OnInit, OnDestroy {

  accountId = '';
  account: Account = new Account();
  image: ImageSources;
  background: ImageSources;
  profile: BasicProfile = undefined;
  accounts: string[];
  social: AlsoKnownAs;
  avatarUrl = '';
  private ethChainId = '@eip155:4'; // Rinkeby
  private ipfsUrl = 'https://ipfs.infura.io/ipfs/';
  private watchStakesQuery: QueryRef<AccountStakesResponse>;
  private watchStakesSubscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private location: Location,
              private alertsService: AlertsService,
              private navbarService: NavbarService,
              private accountStakesDetailsQueryService: AccountStakesDetailsQueryService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const id = params.get('id');
      if (id && id.match('0x[a-fA-F0-9]{40}')) {
        this.accountId = id;
        this.avatarUrl = this.getAvatarURL(undefined);
        if (!this.watchStakesQuery) {
          this.watchStakesSubscription = this.loadStakes();
        } else {
          this.watchStakesQuery?.refetch({ id: this.accountId });
        }
        await this.loadUserProfile(this.accountId);
      } else {
        this.alertsService.error('An Ethereum account is expected as the creator identifier.' +
          '\n It starts with "0x" followed by 40 hexadecimal symbols (0-9 or A-F)', 0);
      }
    });
  }

  back() {
    this.location.back();
  }

  getBackgroundURL(sources: ImageSources): string {
    if (sources) {
      const image = sources?.original;
      return image?.src.replace('ipfs://', this.ipfsUrl);
    } else {
      return `https://picsum.photos/seed/${this.accountId}/1000/300`;
    }
  }

  getAvatarURL(sources: ImageSources): string {
    if (sources) {
      const image = sources?.original;
      return image?.src.replace('ipfs://', this.ipfsUrl);
    } else {
      const blockies = require('ethereum-blockies');
      const blocky = blockies.create({seed: this.accountId, size: 8, scale: 16});
      return blockies.render({seed: this.accountId, size: 8, scale: 16}, blocky).toDataURL();
    }
  }

  ngOnDestroy(): void {
    this.watchStakesSubscription.unsubscribe();
  }

  private async loadUserProfile(accountId: string) {
    const core = new Core({ceramic: 'testnet-clay'});
    try {
      const linkedDid = await core.getAccountDID(accountId + this.ethChainId);
      const publicID = new PublicID({core, id: linkedDid});
      let cryptoAccounts;
      [this.profile, cryptoAccounts, this.social] = await Promise.all([
        publicID.get('basicProfile'), publicID.get('cryptoAccounts'), publicID.get('alsoKnownAs'),
      ]);
      this.accounts = Object.keys(cryptoAccounts).map(caip20 => caip20.substring(0, caip20.indexOf('@')));
      if (this.profile) {
        this.avatarUrl = this.getAvatarURL(this.profile.image);
      }
    } catch (e) { console.log('No DID for account', accountId); }
  }

  private loadStakes(): Subscription {
    this.watchStakesQuery = this.accountStakesDetailsQueryService.watch({ id: this.accountId });
    return this.watchStakesQuery.valueChanges
      .subscribe(response => this.account = new Account(({...response.data.account})),
        error => this.alertsService.error(error));
  }
}
