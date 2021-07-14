Feature: Upload Evidence
  In order to support and authorship claim
  As a creator
  I want to upload content or data and associate it to the claim

  @disabled
  Scenario: Upload evidence for a previously registered authorship claim
    Given I'm on the home page
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Add Uploadable Evidence" button
    And I check the "upload" evidence option
    And I fill the evidence form with file "At Cathedral Cove.jpg"
    And I wait till evidence finished uploading
    And I click the "Register" button
    Then I see alert with text "Evidence submitted"
    And I see modal with title "Registered new Uploadable Evidence"
    And I see modal with text "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I see modal with text "QmU82NhCoFCwvRCQucjkQzg1PVeWsx8hLioLnexZXJ6DiM"

  @disabled
  Scenario: Try to upload previously registered evidence
    Given I'm on the home page
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Add Uploadable Evidence" button
    And I check the "upload" evidence option
    And I fill the evidence form with file "At Cathedral Cove.jpg"
    And I wait till evidence finished uploading
    Then The Register evidence button is disabled
    And I see validation feedback for file input with text 'Content already uploaded as evidence'
