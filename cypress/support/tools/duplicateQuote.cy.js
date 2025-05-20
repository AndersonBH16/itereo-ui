import { DATA_TEST_ID_VALUES } from "/src/constants/test";

Cypress.Commands.add("duplicateQuote", (uuid) => {
  cy.visit(Cypress.env("BASE_URL") + "/quote/basic-info?itinerary=" + uuid);
  cy.await();
  cy.gClickForce(DATA_TEST_ID_VALUES.QUOTE_ACTIONS_BUTTON);
  cy.gClickForce(DATA_TEST_ID_VALUES.DUPLICATE_QUOTE_BUTTON);
  cy.await();
});
