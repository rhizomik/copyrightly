Feature: Upload Evidence
  In order to support and authorship claim
  As a creator
  I want to upload content or data and associate it to the claim

  Scenario: Upload evidence for a previously registered authorship claim
    Given I'm on the home page
    And I click connect account
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Add Stake" button
    And I fill the mint form with amount "0.1"
    And I click the "Purchase" button
    Then I see alert with text "CLY mint submitted"
    And I see modal with title "CopyrightLY Token Minted"
    And I see modal with text "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I see modal with text "0.1"
