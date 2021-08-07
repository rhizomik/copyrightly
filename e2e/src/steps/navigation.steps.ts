import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { browser, by, ExpectedConditions, promise } from 'protractor';
import { NavigationBar } from '../pages/navbar.page';
import { MainContentPage } from '../pages/main-content.page';

const navBar = new NavigationBar();
const mainContent = new MainContentPage();

Given(/^I'm on the home page$/, async () => {
  await browser.get('http://localhost:4200');
});

Given(/^I go to "([^"]*)"$/, async (url: string) => {
  await browser.get(url);
});

When(/^I go to the home page$/, async () => {
  await navBar.goToHome();
});

When(/^I click menu option "([^"]*)"$/, async (option: string) => {
  await navBar.goToMenuOption(option);
});

When(/^I click submenu option "([^"]*)" in menu "([^"]*)"$/, async (option: string, menu: string) => {
  await navBar.goToMenuOption(menu);
  await navBar.goToMenuOption(option);
});

Then(/^The submenu option "([^"]*)" in menu "([^"]*)" is enabled "([^"]*)"$/, async (option: string, menu: string, enabled: string) => {
  await navBar.goToMenuOption(menu);
  const menuClass = await navBar.getMenuOptionClass(option);
  if (enabled === 'true') {
    expect(menuClass).to.not.contain('disabled');
  } else {
    expect(menuClass).to.contain('disabled');
  }
});

When(/^I click connect account$/, async () => {
  await navBar.clickConnectAccount();
});

When(/^I click disconnect account$/, async () => {
  await navBar.clickDisconnectAccount();
});

When(/^I'm not connected$/, async () => {
  await navBar.isNoAccountPresent();
});

When(/^I'm connected$/, async () => {
  await navBar.isAccountPresent();
});

When(/^I click current user account$/, async () => {
  await navBar.clickCurrentAccount();
});

Then(/^The logged in account is "([^"]*)"$/, async (account: string) => {
  expect(await navBar.getCurrentAccount()).to.equal(account);
});

When(/^I click the "([^"]*)" button$/, async (text: string) => {
  await mainContent.clickButtonWithText(text);
  browser.waitForAngular();
});

Then(/^The "([^"]*)" button is disabled$/, async (text: string) => {
  expect(await mainContent.isEnabledButtonWithText(text), 'Button with text "' + text + '" should be disabled')
    .to.equal(false);
});

Then(/^The "([^"]*)" button is enabled$/, async (text: string) => {
  expect(await mainContent.isEnabledButtonWithText(text), 'Button with text "' + text + '" should be enabled')
    .to.equal(true);
});

Then(/^There is no "([^"]*)" button/, async (text: string) => {
  expect(await mainContent.existsButtonWithText(text), 'Button with text "' + text + '" should not be present')
    .to.equal(false);
});
