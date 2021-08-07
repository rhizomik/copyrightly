Feature: Logout
  In order to disable access to restricted features
  As a user
  I want to logout by disconnecting a wallet account

  Scenario: Logout after logging in
    Given I'm on the home page
    And I click connect account
    And I'm connected
    When I click disconnect account
    Then I'm not connected

  Scenario: The "Register" feature is disabled after logging out
    Given I'm on the home page
    And I click connect account
    And The submenu option "Register" in menu "Authorship" is enabled "true"
    When I click disconnect account
    Then The submenu option "Register" in menu "Authorship" is enabled "false"
