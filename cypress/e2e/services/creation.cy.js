import { DATA_TEST_ID_VALUES } from "/src/constants/test";

describe(
  "Creation",
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
      cy.gThen(DATA_TEST_ID_VALUES.COMFORT_PRICE, ($element) =>
        Number($element.text().trim().split(" ")[0])
      ).as("priceBefore");
    });

    it("creates a service from selector", () => {
      cy.gThen(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        (tbody) => {
          const oldItineraryServicesLength = tbody.find("tr").length;

          cy.gClickForce(DATA_TEST_ID_VALUES.ADD_SERVICE_BUTTON);
          cy.gClickForce(DATA_TEST_ID_VALUES.SELECT_SERVICE_BUTTON);

          cy.gSelect(
            DATA_TEST_ID_VALUES.SELECT_SERVICE_MODAL_SELECT_COUNTRY,
            "Costa Rica"
          );
          cy.gSelect(
            DATA_TEST_ID_VALUES.SELECT_SERVICE_MODAL_SELECT_SERVICE_TYPE,
            0
          ).should("have.value", "");
          cy.gType(
            DATA_TEST_ID_VALUES.SELECT_SERVICE_MODAL_INPUT_SERVICE_SEARCH,
            Cypress.env("SERVICE_TO_TEST_SERVICE_ADDING")
          );

          cy.gClickForce(DATA_TEST_ID_VALUES.SEARCH_SERVICES_BUTTON);
          cy.await();
          cy.gChildren(DATA_TEST_ID_VALUES.SERVICE_LIST)
            .children()
            .first()
            .click();
          cy.await();

          cy.gThen(
            DATA_TEST_ID_VALUES.SERVICES_TABLE,
            ($tr) => {
              const newItineraryServicesLength = $tr.length;
              expect(newItineraryServicesLength).to.be.greaterThan(
                oldItineraryServicesLength
              );
            },
            ".b-table tbody tr"
          );
        },
        ".b-table tbody"
      );
    });

    it("creates a service from duplicate", () => {
      cy.gThen(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        (tbody) => {
          const oldItineraryServicesLength = tbody.find("tr").length;
          if (oldItineraryServicesLength > 0) {
            cy.gLast(DATA_TEST_ID_VALUES.SERVICE_ACTIONS_BUTTON).click();
            cy.gLast(DATA_TEST_ID_VALUES.DUPLICATE_SERVICE_BUTTON)
              .contains("Duplicate")
              .click();
            cy.gClickForce(DATA_TEST_ID_VALUES.CONFIRM_SERVICES_TO_ADD_BUTTON);
            cy.await();
          }
        },
        ".b-table tbody"
      );
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
