import { element, by, ElementFinder } from 'protractor';

export class SearchFormPage {

  private form: ElementFinder;
  private input: ElementFinder;

  constructor() {
    this.form = element(by.id('search-form'));
    this.input = this.form.element(by.id('input'));
  }

  async fillSearchForm(content: string) {
    await this.input.sendKeys(content);
  }
}
