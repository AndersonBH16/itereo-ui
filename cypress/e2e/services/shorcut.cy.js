import {
  DATA_TEST_ID_VALUES,
  SELECT_SERVICE_SHORTCUTS,
} from "/src/constants/test";

describe(
  "Shortcut",
  { defaultCommandTimeout: Cypress.env("MAX_TIMEOUT") },
  () => {
    before(() => {
      cy.loginByLocalStorage();
      cy.duplicateQuote(Cypress.env("FULL_QUOTE"));
      cy.gContains(
        DATA_TEST_ID_VALUES.NAVBAR_SECONDARY_LINK,
        "Services"
      ).click();
      cy.await();
      cy.url().should("contain", "/quote/services");
    });

    it("creates a service based from shortcuts", () => {
      const SERVICE_TYPES_HARDCODED = {
        ACCOMMODATION: 2,
        PACKAGE: 9,
        TRANSFER: 5,
        DESCRIPTION: 11,
        ENTRANCE: 4,
        EXCURSION: 7,
        FLIGHT: 1,
        GUIDE: 8,
        MEALS: 6,
        OTHER: 10,
        TRANSPORT: 3,
      };
      SELECT_SERVICE_SHORTCUTS.forEach((shortcut) => {
        cy.executeAltShortcut(
          DATA_TEST_ID_VALUES.SERVICES_TABLE,
          shortcut.complementKey.code
        );

        cy.gHaveValue(
          DATA_TEST_ID_VALUES.SELECT_SERVICE_MODAL_SELECT_SERVICE_TYPE,
          SERVICE_TYPES_HARDCODED[shortcut.serviceTypeName.toLocaleUpperCase()],
          "select"
        );

        cy.gThen(DATA_TEST_ID_VALUES.SERVICE_LIST, ($element) => {
          const services = $element.find(".services > .service");
          if (services.length) {
            cy.wrap(services[0]).click();
          } else {
            cy.await();
            cy.gClickForce(
              DATA_TEST_ID_VALUES.CLOSE_MODAL_BUTTON,
              "button.modal-close"
            );
          }
        });
      });
    });

    afterEach(() => {
      it("increases prices when creating a new service", () => {
        cy.calculateQuotePrices({
          priceLevels: ["All"],
          priceLevel: DATA_TEST_ID_VALUES.COMFORT_PRICE,
        });
      });
    });

    after(() => {
      cy.deleteCurrentQuote();
    });
  }
);
