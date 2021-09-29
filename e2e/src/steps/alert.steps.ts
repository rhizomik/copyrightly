import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { AlertPage } from '../pages/alert.page';
import { ModalPage } from '../pages/modal.page';
import { browser } from 'protractor';

const alert = new AlertPage();
const modal = new ModalPage();

When(/^I click the modal's "([^"]*)" button$/, async (text: string) => {
  await modal.clickButtonWithText(text);
  browser.waitForAngular();
});

Then(/^I see alert with text "([^"]*)"$/, async (fragment: string) => {
  expect(await alert.getLastAlertMessage()).to.contain(fragment);
});

Then(/^I see alert with text "([^"]*)" and close it$/, async (fragment: string) => {
  expect(await alert.getLastAlertMessage()).to.contain(fragment);
  await alert.closeLastAlert();
});

Then(/^I see modal with text "([^"]*)"$/, async (fragment: string) => {
  expect(await modal.getModalBody()).to.contain(fragment);
});

Then(/^I see modal with text "([^"]*)" and close it$/, async (fragment: string) => {
  expect(await modal.getModalBody()).to.contain(fragment);
  await modal.closeModal();
});

Then(/^I see modal with title "([^"]*)"$/, async (fragment: string) => {
  browser.sleep(3000);
  expect(await modal.getModalHeader()).to.contain(fragment);
});

Then(/^I see modal with title "([^"]*)" and close it$/, async (fragment: string) => {
  expect(await modal.getModalHeader()).to.contain(fragment);
  await modal.closeModal();
});
