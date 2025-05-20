import { DATA_TEST_ID_VALUES } from "/src/constants/test";

describe(
  "Calculation",
  { defaultCommandTimeout: Cypress.env("MAX_TIMEOUT") },
  () => {
    before(() => {
      cy.loginByLocalStorage();
      cy.visit(
        Cypress.env("BASE_URL") +
          "/quote/basic-info?itinerary=" +
          Cypress.env("FULL_QUOTE")
      );
      cy.gContains(
        DATA_TEST_ID_VALUES.NAVBAR_SECONDARY_LINK,
        "Services"
      ).click();
    });

    it("calculates the total price of the quote in comfort level", () => {
      cy.calculateQuotePrices({
        priceLevels: ["All", "Com"],
        priceLevel: DATA_TEST_ID_VALUES.COMFORT_PRICE,
      });
    });

    it("calculates the total price of the quote in superior level", () => {
      cy.calculateQuotePrices({
        priceLevels: ["All", "Sup"],
        priceLevel: DATA_TEST_ID_VALUES.SUPERIOR_PRICE,
      });
    });

    it("calculates the total price of the quote in luxury level", () => {
      cy.calculateQuotePrices({
        priceLevels: ["All", "Lux"],
        priceLevel: DATA_TEST_ID_VALUES.LUXURY_PRICE,
      });
    });
  }
);
