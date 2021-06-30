Feature: Retrieve Claim
  In order to know about a specific claim
  As a user
  I want to retrieve the details about the authorship claim using its hash

  Scenario: Retrieve details about a claim found using the search feature
    Given I'm on the home page
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content hash "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    When I click the "Details" button
    Then I see a result with "Title" "Te Hoho Rock"
    And I see a result with "Authors" "0x6273...Ef57"
    And I see a result with "Evidence" "0"

  Scenario: Retrieve details about a claim using its URL
    When I go to "http://localhost:4200/manifestations/QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    Then I see a result with "Title" "Te Hoho Rock"
    And I see a result with "Authors" "0x6273...Ef57"
    And I see a result with "Evidence" "0"

  Scenario: Retrieve details about an unexisting claim using its URL
    When I go to "http://localhost:4200/manifestations/UNEXISTING-CLAIM"
    Then I see alert with text "Manifestation Not Found: UNEXISTING-CLAIM"

