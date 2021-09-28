Feature: Mint License NFT
  In order to license and potentially monetize owned content
  As a creator
  I want to mint an NFT granting its owner reuse under the conditions defined in NFT's metadata

  Scenario: Mint an NFT for an authored manifestation with stake and evidence using default terms
    Given I'm on the home page
    And I click connect account
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Mint NFT" button
    And I see modal with title "Mint CopyrightLY NFT"
    And I click the modal's "Mint NFT" button
    Then I see alert with text "Mint request submitted"
    And I see modal with title "NFT Minted"
    And I see modal with text "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
