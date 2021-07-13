import { element, by, browser, ElementArrayFinder, ExpectedConditions, ElementFinder } from 'protractor';

export class ResultsPage {

  private mainContainer: ElementFinder;
  private results: ElementArrayFinder;

  constructor() {
    this.mainContainer = element(by.css('main.container'));
    this.results = element.all(by.css('.card'));
  }

  async getResultTitleValue(num: number): Promise<string> {
    browser.wait(ExpectedConditions.presenceOf(this.mainContainer));
    return this.results.get(num - 1)
      .element(by.css('.card-title')).getText();
  }

  async getResultAttributeValue(num: number, attribute: string): Promise<string> {
    browser.wait(ExpectedConditions.presenceOf(this.mainContainer));
    return this.results.get(num - 1)
      .element(by.cssContainingText('.card-subtitle', attribute))
      .element(by.xpath('following-sibling::*')).getText();
  }

  async getResultsCount(): Promise<number> {
    browser.wait(ExpectedConditions.presenceOf(this.mainContainer));
    return this.results.count();
  }
}
