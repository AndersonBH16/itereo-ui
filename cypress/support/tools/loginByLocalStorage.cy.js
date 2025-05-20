Cypress.Commands.add("loginByLocalStorage", () => {
  window.localStorage.clear();
  window.localStorage.setItem(
    "auth-data",
    JSON.stringify(Cypress.env("AUTH_DATA"))
  );
  window.localStorage.setItem(
    "statuses_itinerary",
    JSON.stringify(Cypress.env("STATUSES_ITINERARY"))
  );
  cy.visit(Cypress.env("BASE_URL"));
  cy.url().should("contain", "/home");
});
