Feature: List Creator Claims
  In order to know about a creator
  As a reuser
  I want to list all creator's claims and other public information from the creator's identity

  Scenario: List creator's claims using account address
    Given I'm on the home page
    When I click submenu option "Search Creator" in menu "Reuser"
    And I fill the search form with "0x6273...Ef57"
    And I click the "Search" button
    Then I see 2 result
    And I see a result with
      | Title      | Te Hoho Rock        |
      | Registerer | 0x6273...Ef57       |
    And I see a result with
      | Title      | Smiling Sphinx Rock |
      | Registerer | 0x6273...Ef57       |

  Scenario: List claims for an unexisting creator
    Given I'm on the home page
    When I click submenu option "Search Creator" in menu "Reuser"
    And I fill the search form with "UNEXISTING CREATOR"
    And I click the "Search" button
    Then I see alert with text "Creator not found"
