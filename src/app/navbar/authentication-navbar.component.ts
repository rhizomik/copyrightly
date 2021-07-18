import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Web3Service } from '../util/web3.service';
import { AuthenticationService } from './authentication.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication-navbar',
  templateUrl: './authentication-navbar.component.html',
  styleUrls: ['./authentication-navbar.component.css']
})
export class AuthenticationNavbarComponent implements OnInit, OnDestroy {

  public accountId = '';
  public accountName = '';
  public accountsNames: string[] = [];
  public accounts: string[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router,
              private web3Service: Web3Service,
              private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.authenticationService.getAccounts()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(accounts =>  this.accounts = accounts );
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(filter(account => account !== ''))
      .subscribe(account =>  {
        this.accountId = account;
        this.accountName = this.accountsNames[this.accounts.indexOf(this.accountId)];
      });
    this.authenticationService.getAccountsNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(accountsNames =>  {
        this.accountsNames = accountsNames;
        this.accountName = this.accountsNames[this.accounts.indexOf(this.accountId)];
      });
  }

  refreshAccounts() {
    this.authenticationService.refreshAccounts();
  }

  onChange(selectedAccount: string) {
    this.authenticationService.setSelectedAccount(selectedAccount);
  }

  getCurrentNetwork(): Observable<string> {
    return this.web3Service.getNetworkName();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  currentUserProfile() {
    this.router.navigate(['/creators', this.accountId]);
  }
}