import { element, by, browser, ExpectedConditions, ElementFinder, promise } from 'protractor';
import { expect } from 'chai';

export class MainContentPage {

  private mainContainer: ElementFinder;

  constructor() {
    this.mainContainer = element(by.css('main.container'));
  }

  async clickLinkWithText(text: string) {
    await this.mainContainer.element(by.partialLinkText(text)).click();
    browser.waitForAngular();
  }

  async clickButtonWithText(text: string) {
    const button = this.mainContainer.element(by.buttonText(text));
    browser.wait(ExpectedConditions.elementToBeClickable(button));
    await button.click();
    browser.waitForAngular();
  }

  getButtonWithText(text: string): ElementFinder {
    return this.mainContainer.element(by.buttonText(text));
  }

  isEnabledButtonWithText(text: string): promise.Promise<boolean> {
    return this.mainContainer.element(by.buttonText(text)).isEnabled();
  }

  existsButtonWithText(text: string): promise.Promise<boolean> {
    return this.mainContainer.element(by.buttonText(text)).isPresent();
  }
}
