import { element, by, browser, ExpectedConditions, ElementFinder } from 'protractor';

export class NavigationBar {
  private navbar: ElementFinder;
  private accounts: ElementFinder;
  private account: ElementFinder;
  private noAccount: ElementFinder;
  private logout: ElementFinder;
  private refreshButton: ElementFinder;
  private home: ElementFinder;

  constructor() {
    this.navbar = element(by.id('navbar'));
    this.accounts = element(by.id('accounts'));
    this.account = element(by.id('account'));
    this.noAccount = element(by.id('no-account'));
    this.logout = element(by.id('logout'));
    this.refreshButton = element(by.id('refresh-accounts'));
    this.home = element(by.className('navbar-brand'));
  }

  async goToHome() {
    await this.home.click();
  }

  async goToMenuOption(option: string) {
    await this.navbar.element(by.partialLinkText(option)).click();
    // browser.waitForAngular();
  }

  async getMenuOptionClass(option: string): Promise<string> {
    return this.navbar.element(by.partialLinkText(option)).getAttribute('class');
  }

  async getCurrentAccount(): Promise<string> {
    return this.account.getAttribute('title');
  }

  async refreshAccounts() {
    browser.wait(ExpectedConditions.presenceOf(this.refreshButton));
    await this.refreshButton.click();
  }

  async setSelectedAccount(account: string) {
    await this.accounts.element(by.css('option[value="' + account + '"]')).click();
  }

  async clickCurrentAccount() {
    await this.account.click();
  }

  async clickConnectAccount() {
    await this.noAccount.click();
  }

  async clickDisconnectAccount() {
    await this.logout.click();
  }

  async isAccountPresent() {
    browser.wait(ExpectedConditions.presenceOf(this.account));
  }

  async isNoAccountPresent() {
    browser.wait(ExpectedConditions.presenceOf(this.noAccount));
  }
}
