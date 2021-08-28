import { element, by, browser, ElementFinder, ExpectedConditions } from 'protractor';

const path = require('path');

export class StakeFormPage {

  public form; staker; stake; price; button: ElementFinder;

  constructor() {
    this.form = element(by.id('stake-form'));
    this.staker = this.form.element(by.id('inputStaker'));
    this.stake = this.form.element(by.id('inputStake'));
    this.price = this.form.element(by.id('inputPrice'));
    this.button = this.form.element(by.id('purchase'));
  }

  async fillStakeForm(amount: string) {
    await this.stake.clear();
    await this.stake.sendKeys(amount);
    await this.price.click();
    await browser.waitForAngular();
  }

  async getInputValidationFeedback(input: ElementFinder): Promise<string> {
    const feedback = input.element(by.xpath('..')).all(by.css('.invalid-feedback')).last();
    browser.wait(ExpectedConditions.visibilityOf(feedback));
    return feedback.getText();
  }
}
