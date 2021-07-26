Feature: List Own Claims
  In order to keep track of my ownership claims
  As a creator
  I want to list all the claims I have made so far

  Scenario: List own claims when I have one
    Given I'm on the home page
    And I click connect account
    When I click current user account
    Then I see 2 results
    And I see result number 1 with
      | Title      | Smiling Sphinx Rock |
      | Creator    | 0x6273...Ef57       |
    And I see result number 2 with
      | Title      | Te Hoho Rock        |
      | Creator    | 0x6273...Ef57       |

