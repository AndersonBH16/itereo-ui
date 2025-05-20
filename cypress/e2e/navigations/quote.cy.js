import { DATA_TEST_ID_VALUES } from "/src/constants/test";
import { PATH_INFO } from "/src/router/path";

describe("Quote", { defaultCommandTimeout: Cypress.env("MAX_TIMEOUT") }, () => {
  before(() => {
    cy.loginByLocalStorage();
  });

  it("navigates to basic info to create a scratch quote by NavbarMain link", () => {
    cy.visit(Cypress.env("BASE_URL") + "/home");
    cy.navigateToQuoteCreation("scratch");
  });

  it("navigates to basic info to create a module quote by NavbarMain link", () => {
    cy.visit(Cypress.env("BASE_URL") + "/home");
    cy.navigateToQuoteCreation("module");
  });

  it("navigates to basic info to create a experience quote by NavbarMain link", () => {
    cy.visit(Cypress.env("BASE_URL") + "/home");
    cy.navigateToQuoteCreation("experience");
  });

  it("navigates to basic info to create a example itinerary quote by NavbarMain link", () => {
    cy.visit(Cypress.env("BASE_URL") + "/home");
    cy.navigateToQuoteCreation("example_itinerary");
  });

  it("navigates to basic info to create a scratch quote by NavbarMain link from an opened Quote", () => {
    cy.visitBasicInfo(
      Cypress.env("QUOTE_TO_TEST_NAVIGATION_TO_QUOTE_CREATION")
    );
    cy.navigateToQuoteCreation("scratch");
  });

  it("navigates to basic info to create a module quote by NavbarMain link from an opened Quote", () => {
    cy.visitBasicInfo(
      Cypress.env("QUOTE_TO_TEST_NAVIGATION_TO_QUOTE_CREATION")
    );
    cy.navigateToQuoteCreation("module");
  });

  it("navigates to basic info to create a experience quote by NavbarMain link from an opened Quote", () => {
    cy.visitBasicInfo(
      Cypress.env("QUOTE_TO_TEST_NAVIGATION_TO_QUOTE_CREATION")
    );
    cy.navigateToQuoteCreation("experience");
  });

  it("navigates to basic info to create a example itinerary quote by NavbarMain link from an opened Quote", () => {
    cy.visitBasicInfo(
      Cypress.env("QUOTE_TO_TEST_NAVIGATION_TO_QUOTE_CREATION")
    );
    cy.navigateToQuoteCreation("example_itinerary");
  });

  it("navigates to basic info by direct link", () => {
    cy.visit(`${Cypress.env("BASE_URL")}${PATH_INFO.BASIC_INFO.path}`);
    cy.url().should("contain", "/quote/basic-info");
    cy.gContains(DATA_TEST_ID_VALUES.BASIC_INFO_TYPE_SELECT, "Quote");
  });
});
