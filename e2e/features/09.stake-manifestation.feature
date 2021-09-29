Feature: Add Stake to Manifestation
  In order to benefit from CopyrightLY (CLY) token minting
  As a user
  I want to stake some CLY on a trustful on a manifestation to reduce the risk of loosing stake

  Scenario: Add stake to an existing manifestation for an authorship claim
    Given I'm on the home page
    And I click connect account
    When I click submenu option "Authorship Claim" in menu "Search"
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

  Scenario: Adding 0 stake is not allowed
    Given I'm on the home page
    And I click connect account
    When I click submenu option "Authorship Claim" in menu "Search"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Add" button
    And I fill the stake form with amount "0"
    Then The Purchase button is disabled
    And I see validation feedback for stake input with text "An amount bigger than 0 and smaller than 99999 is required"

  Scenario: Purchasing more than the maximum amount of 99999 is not allowed
    Given I'm on the home page
    And I click connect account
    When I click submenu option "Authorship Claim" in menu "Search"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Add" button
    And I fill the stake form with amount "100000"
    Then The Purchase button is disabled
    And I see validation feedback for stake input with text "An amount bigger than 0 and smaller than 99999 is required"
