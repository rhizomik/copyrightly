Feature: Login
  In order to get access to restricted features
  As a user
  I want to login by connecting a wallet account

  Scenario: Login using local provider provides access to "Register" feature
    Given I'm on the home page
    When I click connect account
    Then I'm connected
    And The logged in account is "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
    And The submenu option "Register" in menu "Authorship" is enabled "true"

  Scenario: The "Register" feature is disabled if not logged in
    Given I'm on the home page
    When I'm not connected
    Then The submenu option "Register" in menu "Authorship" is enabled "false"
