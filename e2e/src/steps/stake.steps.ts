import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { browser, by, element, ExpectedConditions } from 'protractor';
import { StakeFormPage } from '../pages/stake/stake-form.page';

const stakeForm = new StakeFormPage();

When(/^I fill the stake form with amount "([^"]*)"$/, async (amount: string) => {
  await stakeForm.fillStakeForm(amount);
});

Then(/^I see validation feedback for stake input with text "([^']*)"$/, async (text: string) => {
  expect(await stakeForm.getInputValidationFeedback(stakeForm.stake)).to.contain(text);
});

Then(/^The Purchase button is disabled$/, async () => {
  expect(await stakeForm.button.isEnabled(), 'Button Purchase should be disabled').to.equal(false);
});

Then(/^The Sell button is disabled$/, async () => {
  expect(await stakeForm.button.isEnabled(), 'Button Sell should be disabled').to.equal(false);
});


