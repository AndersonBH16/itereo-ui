describe("Redirect", () => {
  beforeEach(() => {
    window.localStorage.clear();
    cy.visit(Cypress.env("BASE_URL") + "/home");
  });

  it("redirect to login if credentials are incorrect when trying to log in", () => {
    cy.url().should("include", "/?redirect=%2Fhome");
    cy.get(".loginForm-field button p").contains("Sign In");
  });
});
