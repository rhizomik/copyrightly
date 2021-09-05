Feature: Remove Stake from Manifestation
  In order to benefit from CopyrightLY (CLY) token previously minted
  As a user
  I want to unstake some CLY and get Ether back with a potential benefit

  Scenario: Remove stake from an existing manifestation for an authorship claim
    Given I'm on the home page
    And I click connect account
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Remove" button
    And I fill the stake form with amount "0.01"
    And I click the "Sell" button
    Then I see alert with text "CLY burn submitted"
    And I see modal with title "CopyrightLY Token Burned"
    And I see modal with text "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I see modal with text "0.01"

  Scenario: Removing 0 stake is not allowed
    Given I'm on the home page
    And I click connect account
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Remove" button
    And I fill the stake form with amount "0"
    Then The Sell button is disabled
    And I see validation feedback for stake input with text "An amount bigger than 0 and smaller than 99999 is required"

  Scenario: Selling more than the staked amount is not allowed
    Given I'm on the home page
    And I click connect account
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Remove" button
    And I fill the stake form with amount "1000"
    Then The Purchase button is disabled
    And I see validation feedback for stake input with text "You cannot sell more than your stake"
