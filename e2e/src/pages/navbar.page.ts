import { element, by, browser, ExpectedConditions, ElementFinder } from 'protractor';

export class NavigationBar {
  private navbar: ElementFinder;
  private accounts: ElementFinder;
  private account: ElementFinder;
  private refreshButton: ElementFinder;
  private home: ElementFinder;

  constructor() {
    this.navbar = element(by.id('navbar'));
    this.accounts = element(by.id('accounts'));
    this.account = element(by.id('account'));
    this.refreshButton = element(by.id('refresh-accounts'));
    this.home = element(by.className('navbar-brand'));
  }

  async goToHome() {
    await this.home.click();
  }

  async goToMenuOption(option: string) {
    await this.navbar.element(by.partialLinkText(option)).click();
    browser.waitForAngular();
  }

  async refreshAccounts() {
    browser.wait(ExpectedConditions.presenceOf(this.refreshButton));
    await this.refreshButton.click();
  }

  async getSelectedAccount(): Promise<string> {
    return this.accounts.getText();
  }

  async setSelectedAccount(account: string) {
    await this.accounts.element(by.css('option[value="' + account + '"]')).click();
  }

  async clickCurrentAccount() {
    await this.account.click();
  }
}
