import { DATA_TEST_ID_VALUES } from "/src/constants/test";

describe(
  "Creation",
  { defaultCommandTimeout: Cypress.env("MAX_TIMEOUT") },
  () => {
    before(() => {
      cy.loginByLocalStorage();
      cy.visit(`${Cypress.env("BASE_URL")}/quote/basic-info`);
    });

    it("creates a full quote from scratch", () => {
      cy.gType(
        DATA_TEST_ID_VALUES.BASIC_INFO_TITLE,
        `CYPRESS Test quote #${Date.now()}`
      );

      cy.gClickForce(DATA_TEST_ID_VALUES.BASIC_INFO_CLIENT_SELECT);
      cy.gContains(
        DATA_TEST_ID_VALUES.BASIC_INFO_CLIENT_SELECT,
        "Encounter Latin America",
        "> .menu > .item"
      ).click();

      cy.gClickForce(DATA_TEST_ID_VALUES.BASIC_INFO_PAX_SELECT);
      cy.gClickForce(
        DATA_TEST_ID_VALUES.BASIC_INFO_PAX_SELECT,
        `> .menu > .item:nth-child(2)`
      );

      cy.gClickForce(DATA_TEST_ID_VALUES.BASIC_INFO_ROOM_SELECT_SAVE);

      cy.gClick(
        DATA_TEST_ID_VALUES.BASIC_INFO_DATA_FROM_SELECT,
        ".b-form-datepicker"
      );
      cy.gClick(
        DATA_TEST_ID_VALUES.BASIC_INFO_DATA_FROM_SELECT,
        ".b-calendar-grid-body .row:nth-child(2) > div:nth-child(2)"
      );

      cy.gClick(
        DATA_TEST_ID_VALUES.BASIC_INFO_DATA_TO_SELECT,
        ".b-form-datepicker"
      );
      cy.gClick(
        DATA_TEST_ID_VALUES.BASIC_INFO_DATA_TO_SELECT,
        ".b-calendar-grid-body .row:nth-child(2) > div:nth-child(6)"
      );

      cy.gClickForce(DATA_TEST_ID_VALUES.BASIC_INFO_CONTRACT_SELECT);
      cy.gContains(
        DATA_TEST_ID_VALUES.BASIC_INFO_CONTRACT_SELECT,
        /^ *CATDMC *$/,
        "> .menu > .item"
      ).click();

      cy.gClickForce(DATA_TEST_ID_VALUES.CREATE_ITINERARY_BUTTON);
      cy.await();

      cy.url().should("contain", "/quote/services");
    });

    after(() => {
      cy.deleteCurrentQuote();
    });
  }
);
