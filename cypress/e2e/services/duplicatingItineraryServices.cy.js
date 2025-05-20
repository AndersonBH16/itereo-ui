import { DATA_TEST_ID_VALUES } from "/src/constants/test";

describe(
  "Itinerary Services Duplicating",
  { defaultCommandTimeout: Cypress.env("MAX_TIMEOUT") },
  () => {
    before(() => {
      cy.loginByLocalStorage();
      cy.visit(
        Cypress.env("BASE_URL") +
          "/quote/services?itinerary=" +
          Cypress.env("FULL_QUOTE")
      );

      cy.await();
      cy.url().should("contain", "/quote/services");
    });

    it("Itinerary services order are equal to the original itinerary after duplicating quote", () => {
      const itineraryServicesCodes = [];

      cy.gThen(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        (services) => {
          services.each((index, service) => {
            const serviceCode = service.innerText;
            itineraryServicesCodes.push(serviceCode);
          });

          cy.duplicateQuote(Cypress.env("FULL_QUOTE"));

          cy.await();

          cy.gContains(
            DATA_TEST_ID_VALUES.NAVBAR_SECONDARY_LINK,
            "Services"
          ).click();

          cy.await();

          const duplicatedItineraryServicesCodes = [];

          cy.gThen(
            DATA_TEST_ID_VALUES.SERVICES_TABLE,
            (services) => {
              services.each((index, service) => {
                console.log("service", service);
                const serviceCode = service.innerText;
                duplicatedItineraryServicesCodes.push(serviceCode);
              });

              expect(itineraryServicesCodes).to.deep.equal(
                duplicatedItineraryServicesCodes
              );
            },
            ".b-table tbody tr .service_row_card header > div > span:nth-child(2) > span"
          );
        },
        ".b-table tbody tr .service_row_card header > div > span:nth-child(2) > span"
      );
    });

    it("Itinerary services order are equal to the original itinerary after customizing ex itinerary", () => {
      cy.visit(
        Cypress.env("BASE_URL") +
          "/quote/services?itinerary=" +
          Cypress.env("EX_ITINERARY_TO_TEST_DUPLICATE")
      );

      cy.await();

      const itineraryServicesCodes = [];

      cy.gThen(
        DATA_TEST_ID_VALUES.SERVICES_TABLE,
        (services) => {
          services.each((index, service) => {
            const serviceCode = service.innerText;
            itineraryServicesCodes.push(serviceCode);
          });

          cy.visit(Cypress.env("BASE_URL") + "/ex-itineraries/costa-rica");

          cy.await();

          cy.gFirst(DATA_TEST_ID_VALUES.EX_ITINERARY_CUSTOMIZE_BUTTON).click();

          cy.gFirst(
            DATA_TEST_ID_VALUES.EX_ITINERARY_CUSTOMIZE_BUTTON_CONFIRM
          ).click();

          cy.await(60000);

          cy.gContains(
            DATA_TEST_ID_VALUES.NAVBAR_SECONDARY_LINK,
            "Services"
          ).click();

          const duplicatedItineraryServicesCodes = [];

          cy.gThen(
            DATA_TEST_ID_VALUES.SERVICES_TABLE,
            (services) => {
              services.each((index, service) => {
                console.log("service", service);
                const serviceCode = service.innerText;
                duplicatedItineraryServicesCodes.push(serviceCode);
              });

              expect(itineraryServicesCodes).to.deep.equal(
                duplicatedItineraryServicesCodes
              );
            },
            ".b-table tbody tr .service_row_card header > div > span:nth-child(2) > span"
          );
        },
        ".b-table tbody tr .service_row_card header > div > span:nth-child(2) > span"
      );
    });
  }
);
