'use strict';

const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'bootstrap',
    jsonFile: 'e2e/protractor-cucumber-report.json',
    output: 'docs/report/protractor-cucumber_report.html',
    reportSuiteAsScenarios: true,
    launchReport: true
  };

reporter.generate(options);

process.exit();
