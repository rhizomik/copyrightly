Feature: YouTube Evidence
  In order to support an authorship claim
  As a creator
  I want to link it to one of my YouTube videos

  Scenario: YouTube evidence for an existing video with the manifestation hash in its description
    Given I'm on the home page
    And I click connect account
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Add YouTube Evidence" button
    And I fill the evidence form with video identifier "ZwVNLDIJKVA"
    And I check the "linkedFromYouTube" evidence option
    And I click the "Register" button
    Then I see alert with text "Evidence request submitted"
    And I see modal with title "Registered new YouTube Evidence"
    And I see modal with text "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I see modal with text "ZwVNLDIJKVA"

  Scenario: YouTube evidence for a video without the manifestation hash in its description
    Given I'm on the home page
    And I click connect account
    And I click submenu option "Search" in menu "Authorship"
    And I fill the search form with content "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Search" button
    And I click the "Details" button
    When I click the "Add YouTube Evidence" button
    And I fill the evidence form with video identifier "ZwVNLDIJKVB"
    And I check the "linkedFromYouTube" evidence option
    And I click the "Register" button
    Then I see alert with text "Evidence request submitted"
    And I see modal with title "YouTube Evidence not Linked to Manifestation"
    And I see modal with text "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I see modal with text "ZwVNLDIJKVB"
