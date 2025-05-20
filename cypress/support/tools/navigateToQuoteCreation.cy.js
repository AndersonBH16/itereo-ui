import { DATA_TEST_ID_VALUES } from "../../../src/constants/test";

Cypress.Commands.add("navigateToQuoteCreation", (type) => {
  cy.gClickForce(DATA_TEST_ID_VALUES.NEW_QUOTE_LINK);

  switch (type) {
    case "scratch":
      cy.gClickForce(DATA_TEST_ID_VALUES.NEW_QUOTE_BUTTON_SCRATCH);
      cy.url().should("contain", "/quote/basic-info?type=quote");
      cy.gContains(DATA_TEST_ID_VALUES.BASIC_INFO_TYPE_SELECT, "Quote");
      break;
    case "module":
      cy.gClickForce(DATA_TEST_ID_VALUES.NEW_QUOTE_BUTTON_MODULE);
      cy.url().should("contain", "/quote/basic-info?type=module");
      cy.gContains(DATA_TEST_ID_VALUES.BASIC_INFO_TYPE_SELECT, "Module");
      break;
    case "experience":
      cy.gClickForce(DATA_TEST_ID_VALUES.NEW_QUOTE_BUTTON_EXPERIENCE);
      cy.url().should("contain", "/quote/basic-info?type=experience");
      cy.gContains(DATA_TEST_ID_VALUES.BASIC_INFO_TYPE_SELECT, "Experience");
      break;
    case "example_itinerary":
      cy.gClickForce(DATA_TEST_ID_VALUES.NEW_QUOTE_BUTTON_EXAMPLE_ITINERARY);
      cy.url().should("contain", "/quote/basic-info?type=ex-itinerary");
      cy.gContains(DATA_TEST_ID_VALUES.BASIC_INFO_TYPE_SELECT, "Ex. Itinerary");
      return;
  }
});
