import { DATA_TEST_ID_VALUES } from "/src/constants/test";

Cypress.Commands.add("calculateQuotePrices", ({ priceLevel, priceLevels }) => {
  cy.url().should("contain", "/quote/services");

  cy.gThen(
    DATA_TEST_ID_VALUES.SERVICES_TABLE,
    (items) => {
      const totalPrice = items
        .children("tr")
        .toArray()
        .reduce((acc, serviceRow) => {
          const serviceLevelElement =
            Cypress.$(serviceRow).find(".levelField span");
          const serviceLevel = serviceLevelElement.text().trim();
          if (priceLevels.includes(serviceLevel)) {
            const servicePrice = Cypress.$(serviceRow).find(
              ".priceField .data-cell span"
            );
            const priceText = servicePrice.text().trim().split(" ").at(-1);
            return acc + Number(priceText);
          }
          return acc;
        }, 0);

      cy.gThen(priceLevel, ($element) => {
        const priceBefore = Number($element.text().trim().split(" ")[0]);
        expect(Math.abs(priceBefore - totalPrice)).to.be.lessThan(10);
      });
    },
    ".b-table tbody"
  );
});
