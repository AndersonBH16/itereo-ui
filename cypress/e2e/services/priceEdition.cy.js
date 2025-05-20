import { DATA_TEST_ID_VALUES } from "/src/constants/test";

describe(
  "Service Price Edition",
  { defaultCommandTimeout: Cypress.env("MAX_TIMEOUT") },
  () => {
    before(() => {
      cy.loginByLocalStorage();
      cy.duplicateQuote(Cypress.env("QUOTE_TO_TEST_SERVICE_PRICE_EDITION"));
      cy.gContains(
        DATA_TEST_ID_VALUES.NAVBAR_SECONDARY_LINK,
        "Services"
      ).click();
      cy.await();
      cy.url().should("contain", "/quote/services");
    });

    it("Service price is stored after editing it and restored to its previous value", () => {
      cy.gClickChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".priceField .data-cell .color-up"
      );

      const prevValue = "517";

      cy.gTypeChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".priceField input",
        "144"
      );

      cy.gGetChildElementValueIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".priceField .data-cell .color-up"
      ).should("contain", "144");

      cy.gClickChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".priceField .data-cell .color-up"
      );

      cy.gTypeChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".priceField input",
        prevValue
      );

      cy.gGetChildElementValueIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".priceField .data-cell .color-up"
      ).should("contain", prevValue);
    });

    it("Service price is stored after editing it from 0 #1160", () => {
      cy.gClickChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION_NO_PRICE"),
        ".priceField .data-cell .color-up"
      );

      cy.gTypeChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION_NO_PRICE"),
        ".priceField input",
        "67"
      );

      cy.gGetChildElementValueIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION_NO_PRICE"),
        ".priceField .data-cell .color-up"
      ).should("contain", "67");

      cy.gClickChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION_NO_PRICE"),
        ".priceField .data-cell .color-up"
      );

      cy.gTypeChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION_NO_PRICE"),
        ".priceField input",
        "0"
      );

      cy.await();
    });

    it("Accommodation room price is recalculated and new price is stored after editing it from 0 #1160", () => {
      cy.gClickChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION_NO_PRICE"),
        "",
        DATA_TEST_ID_VALUES.ITINERARY_SERVICE_OPEN_SIDEBAR_BUTTON
      );

      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_SERVICE_SIDEBAR,
        "PRICING",
        "a"
      ).click();

      cy.gType(DATA_TEST_ID_VALUES.ITINERARY_SERVICE_SIDEBAR_PRICE, "input")
        .invoke("val", "")
        .realType("120");

      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_SERVICE_SIDEBAR,
        "ROOM TYPE",
        "a"
      ).click();

      cy.gByIndex(
        DATA_TEST_ID_VALUES.ITINERARY_SERVICE_SIDEBAR_ROOM_PRICE_UNIT,
        "input",
        0
      )
        .invoke("val")
        .should("eq", "60");

      cy.gByIndex(
        DATA_TEST_ID_VALUES.ITINERARY_SERVICE_SIDEBAR_ROOM_PRICE,
        "input",
        0
      )
        .invoke("val")
        .should("eq", "120");

      cy.gClickForce(
        DATA_TEST_ID_VALUES.ITINERARY_SERVICE_SIDEBAR_SAVE_BUTTON,
        ""
      );

      cy.gGetChildElementValueIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION_NO_PRICE"),
        ".priceField .data-cell .color-up"
      ).should("contain", "120");

      cy.gClickChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION_NO_PRICE"),
        ".priceField .data-cell .color-up"
      );

      cy.gTypeChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION_NO_PRICE"),
        ".priceField input",
        "0"
      );
    });

    it("Should maintain Itinerary Services prices #1236", () => {
      cy.gClickChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".priceField .data-cell .color-up"
      );

      const PRICE_TO_MAINTAIN = "632";

      cy.gTypeChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".priceField input",
        PRICE_TO_MAINTAIN
      );

      cy.await();

      cy.gClickChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".day .data-cell span"
      );

      cy.gTypeChildElementIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".day input",
        "7-8"
      );

      cy.gClickForce(
        DATA_TEST_ID_VALUES.MAINTAIN_SERVICES_PRICES_CONTROL,
        "> input"
      );

      cy.gClickForce(
        DATA_TEST_ID_VALUES.MOVE_ALL_ITINERARY_SERVICES_BUTTON,
        ""
      );

      cy.await();

      cy.gGetChildElementValueIfContains(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        Cypress.env("SERVICE_TO_TEST_SERVICE_PRICE_EDITION"),
        ".priceField .data-cell .color-up"
      ).should("contain", PRICE_TO_MAINTAIN);
    });

    after(() => {
      cy.deleteCurrentQuote();
    });
  }
);
