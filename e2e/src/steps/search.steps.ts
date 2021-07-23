import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { SearchFormPage } from '../pages/registry/search-form.page';
import { ResultsPage } from '../pages/registry/results.page';
import { expect } from 'chai';
import 'chai-string';

const chai = require('chai');
chai.use(require('chai-string'));

const searchForm = new SearchFormPage();
const results = new ResultsPage();

When(/^I fill the search form with content "([^"]*)"$/, async (hash: string) => {
  await searchForm.fillSearchForm(hash);
});

Then(/^I see result number (\d+) with$/, async (num: number, table: DataTable) => {
  for (const key of Object.keys(table.rowsHash())) {
    const value = table.rowsHash()[key];
    if (key === 'Title') {
      expect(await results.getResultTitleValue(num)).to.include(value);
    } else {
      expect(await results.getResultAttributeValue(num, key)).to.containIgnoreCase(value);
    }
  }
});
