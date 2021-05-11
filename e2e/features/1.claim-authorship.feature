Feature: Claim Authorship
  In order to claim authorship on content or data
  As a creator
  I want to register a claim on the content or data hash plus some descriptive metadata

  Scenario: Register a piece of content or data not previously registered
    Given I'm on the home page
    When I click submenu option "Register" in menu "Authorship"
    And I uncheck the "upload" option
    And I fill the register form with title "Te Hoho Rock" and file "Te Hoho Rock.jpg"
    And I wait till finished uploading
    And I click the "Register" button
    Then I see alert with text "Registration submitted"
    And I see modal with title "Manifestation Registered"
    And I see modal with text "Te Hoho Rock"

  Scenario: Register a piece of content previously registered
    Given I'm on the home page
    When I click submenu option "Register" in menu "Authorship"
    And I uncheck the "upload" option
    And I fill the register form with title "My Te Hoho Rock" and file "Te Hoho Rock.jpg"
    And I wait till finished uploading
    Then The Register button is disabled
    And I see validation feedback for hash input with text 'Content already registered with title "Te Hoho Rock"'

  @slow
  Scenario: Register a piece of content not previously registered and upload to IPFS
    Given I'm on the home page
    When I click submenu option "Register" in menu "Authorship"
    And I check the "upload" option
    And I fill the register form with title "Smiling Sphinx Rock" and file "Smiling Sphinx Rock.jpg"
    And I wait till finished uploading
    And I click the "Register" button
    Then I see alert with text "Registration submitted"
    And I see modal with title "Manifestation Registered"
    Then I see modal with text "Smiling Sphinx Rock"

  @slow
  Scenario: Register a piece of content previously registered and upload to IPFS
    Given I'm on the home page
    When I click submenu option "Register" in menu "Authorship"
    And I check the "upload" option
    And I fill the register form with title "My Smiling Sphinx Rock" and file "Smiling Sphinx Rock.jpg"
    And I wait till finished uploading
    Then The Register button is disabled
    And I see validation feedback for hash input with text 'Content already registered with title "Smiling Sphinx Rock"'
