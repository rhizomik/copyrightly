Feature: List Creator Claims
  In order to know about a creator
  As a reuser
  I want to list all creator's claims and other public information from the creator's identity

  Scenario: List creator's claims using account address
    Given I'm on the home page
    When I click submenu option "Search Creator" in menu "Reuse"
    And I fill the search form with content "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
    And I click the "Search" button
    Then I see 2 results
    And I see result number 1 with
      | Title      | Smiling Sphinx Rock |
      | Creator    | 0x6273...Ef57       |
    And I see result number 2 with
      | Title      | Te Hoho Rock        |
      | Creator    | 0x6273...Ef57       |

  Scenario: List claims for a creator without any
    Given I'm on the home page
    When I click submenu option "Search Creator" in menu "Reuse"
    And I fill the search form with content "0x0123456789ABCDEF0123456789ABCDEF01234567"
    And I click the "Search" button
    Then I see 0 results
