Feature: Add Stake to Manifestation
  In order to benefit from CopyrightLY (CLY) token minting
  As a user
  I want to stake some CLY on a trustful on a manifestation to reduce the risk of loosing stake

  Scenario: Add stake to an existing manifestation for an authorship claim
    Given I'm on the home page
    And I click connect account
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Add" button
    And I fill the stake form with amount "0.1"
    And I click the "Purchase" button
    Then I see alert with text "CLY mint submitted"
    And I see modal with title "CopyrightLY Token Minted"
    And I see modal with text "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I see modal with text "0.1"
