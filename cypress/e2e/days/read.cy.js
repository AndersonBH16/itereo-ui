import { DATA_TEST_ID_VALUES } from "/src/constants/test";

describe("Read", { defaultCommandTimeout: Cypress.env("MAX_TIMEOUT") }, () => {
  before(() => {
    cy.loginByLocalStorage();
    cy.visit(
      Cypress.env("BASE_URL") +
        "/quote/basic-info?itinerary=" +
        Cypress.env("FULL_QUOTE")
    );
  });

  it("checks the number of days", () => {
    cy.gContains(
      DATA_TEST_ID_VALUES.NAVBAR_SECONDARY_LINK,
      "Itinerary"
    ).click();
    cy.gThen(DATA_TEST_ID_VALUES.ITINERARY_NUM_DAYS, (element) => {
      const numDays = Number(element.text().trim());
      cy.gThen(DATA_TEST_ID_VALUES.ITINERARY_DAY, (day) => {
        const itineraryDays = day.length;
        expect(itineraryDays).to.be.eq(numDays);
      });
    });
    cy.await();
  });
});
