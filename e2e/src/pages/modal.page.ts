import { element, by, ElementFinder, browser, ExpectedConditions } from 'protractor';

export class ModalPage {

  private modal: ElementFinder;
  private header: ElementFinder;
  private body: ElementFinder;
  private closeBtn: ElementFinder;

  constructor() {
    this.modal = element.all(by.css('div.modal-content')).last();
    this.header = this.modal.element(by.css('.modal-header'));
    this.body = this.modal.element(by.css('.modal-body'));
    this.closeBtn = this.modal.element(by.css('button.close'));
  }

  async getModalHeader(): Promise<string> {
    browser.wait(ExpectedConditions.presenceOf(this.modal));
    return await this.header.getText();
  }

  async getModalBody(): Promise<string> {
    browser.wait(ExpectedConditions.presenceOf(this.modal));
    return await this.body.getText();
  }

  async closeModal() {
    browser.wait(ExpectedConditions.presenceOf(this.modal));
    await this.closeBtn.click();
  }

  async clickButtonWithText(text: string) {
    const button = this.modal.element(by.buttonText(text));
    browser.wait(ExpectedConditions.elementToBeClickable(button), 5 * 1000, 'The button is not clickable: ' + text);
    await button.click();
  }
}
