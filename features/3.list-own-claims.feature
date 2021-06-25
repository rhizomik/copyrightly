Feature: List Own Claims
  In order to keep track of my ownership claims
  As a creator
  I want to list all the claims I have made so far

  Scenario: List own claims when I have one
    Given I'm on the home page
    When I click submenu option "List Own" in menu "Authorship"
    Then I see 2 result
    And I see a result with "Title" "Te Hoho Rock"
    And I see a result with "Title" "Smiling Sphinx Rock"
    And I see a result with "Registerer" "0x6273...Ef57"
