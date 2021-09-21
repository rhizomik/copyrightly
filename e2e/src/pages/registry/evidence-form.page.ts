import { element, by, browser, ElementFinder, ExpectedConditions } from 'protractor';

const path = require('path');

export class EvidenceFormPage {

  public form; evidencer; evidenced; file; videoId; button: ElementFinder;

  constructor() {
    this.form = element(by.id('evidence-form'));
    this.evidencer = this.form.element(by.id('inputEvidencer'));
    this.evidenced = this.form.element(by.id('inputEvidenced'));
    this.file = this.form.element(by.id('inputFile'));
    this.videoId = this.form.element(by.id('inputVideoId'));
    this.button = this.form.element(by.id('register'));
  }

  async fillFileEvidenceForm(relativePath: string) {
    const absolutePath = path.resolve(__dirname, relativePath);
    await this.file.sendKeys(absolutePath);
    await browser.waitForAngular();
  }

  async fillVideoIdEvidenceForm(videoId: string) {
    await this.videoId.sendKeys(videoId);
    await browser.waitForAngular();
  }

  async getInputValidationFeedback(input: ElementFinder): Promise<string> {
    const feedback = input.element(by.xpath('..')).all(by.css('.invalid-feedback')).last();
    browser.wait(ExpectedConditions.visibilityOf(feedback));
    return feedback.getText();
  }

  async uncheck(id: string) {
    const checkbox = this.form.element(by.id(id));
    if (await checkbox.isSelected()) {
      await checkbox.click();
      await browser.waitForAngular();
    }
  }

  async check(id: string) {
    const checkbox = this.form.element(by.id(id));
    if (!await checkbox.isSelected()) {
      await checkbox.click();
      await browser.waitForAngular();
    }
  }
}
