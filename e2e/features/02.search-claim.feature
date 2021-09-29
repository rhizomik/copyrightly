Feature: Search Claim
  In order to check authorship claims on content or data
  As a user
  I want to search if a piece of content or data is registered using its hash

  Scenario: Search a piece of content previously registered
    Given I'm on the home page
    When I click submenu option "Authorship Claim" in menu "Search"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    Then I see 1 results
    And I see result number 1 with
      | Title      | Te Hoho Rock        |
      | Creator    | 0x6273...Ef57       |

  Scenario: Search a piece of content not registered
    Given I go to the home page
    When I click submenu option "Authorship Claim" in menu "Search"
    And I fill the search form with content "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ"
    And I click the "Search" button
    Then I see alert with text "Content hash not found, unregistered"
