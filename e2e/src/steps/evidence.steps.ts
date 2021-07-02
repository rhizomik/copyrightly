import { Given, When, Then } from '@cucumber/cucumber';
import { EvidenceFormPage } from '../pages/registry/evidence-form.page';
import { expect } from 'chai';
import { browser, by, element, ExpectedConditions } from 'protractor';

const evidenceForm = new EvidenceFormPage();

When(/^I fill the evidence form with file "([^"]*)"$/,
  async (path: string) => {
  await evidenceForm.fillFileEvidenceForm(path);
});

When(/^I uncheck the "([^"]*)" evidence option$/,
  async (id: string) => {
    await evidenceForm.uncheck(id);
});

When(/^I check the "([^"]*)" evidence option$/,
  async (id: string) => {
    await evidenceForm.check(id);
  });

Then(/^I see validation feedback for file input with text '([^']*)'$/,
  async (text: string) => {
  expect(await evidenceForm.getInputValidationFeedback(evidenceForm.file)).to.contain(text);
});

When(/^I wait till evidence finished uploading$/,
  async () => {
  browser.wait(ExpectedConditions.textToBePresentInElement(element(by.id('manifest')), 'Register'));
});

Then(/^The Register evidence button is disabled$/, async () => {
  expect(await element(by.id('register')).isEnabled(), 'Button Register should be disabled')
    .to.equal(false);
});
