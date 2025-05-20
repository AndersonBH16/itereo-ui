import { DATA_TEST_ID_VALUES } from "/src/constants/test";

describe(
  "Deletion",
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

    it("creates a service from delete", () => {
      cy.gThen(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        (tbody) => {
          const oldItineraryServicesLength = tbody.find("tr").length;
          if (oldItineraryServicesLength > 0) {
            cy.gLast(DATA_TEST_ID_VALUES.SERVICE_ACTIONS_BUTTON).click();
            cy.gLast(DATA_TEST_ID_VALUES.DELETE_SERVICE_BUTTON)
              .contains("Delete")
              .click();
            cy.await();
          }

          cy.gThen(
            DATA_TEST_ID_VALUES.SERVICES_TABLE,
            (tbody) => {
              const newItineraryServicesLength = tbody.find(`tr`).length;
              if (newItineraryServicesLength <= 0) {
                cy.gBeVisible(DATA_TEST_ID_VALUES.SERVICES_TABLE_PLACEHOLDER);
              } else {
                expect(newItineraryServicesLength).to.be.lessThan(
                  oldItineraryServicesLength
                );
              }
            },
            ".b-table tbody"
          );
        },
        ".b-table tbody"
      );
    });

    afterEach(() => {
      it("decreases comfort prices when removing a service", () => {
        cy.gThen(DATA_TEST_ID_VALUES.COMFORT_PRICE, ($element) => {
          const priceAfter = Number($element.text().trim().split(" ")[0]);
          expect(priceAfter).to.be.lessThan(this.priceBefore);
        });
      });
    });

    after(() => {
      cy.deleteCurrentQuote();
    });
  }
);
