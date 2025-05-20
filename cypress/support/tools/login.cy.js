Cypress.Commands.add("login", (email, password) => {
  cy.clearLocalStorage("auth-data");
  cy.visit(Cypress.env("BASE_URL"));
  const emailInput = ".loginForm-field > div > input";
  const passwordInput =
    ".field-password > .passwordContainer > .password > input";
  const signInButton = ".loginForm-field button p";
  cy.get(emailInput).type(email);
  cy.get(passwordInput).type(password);
  cy.get(signInButton).contains("Sign In").click();
  cy.url().should("contain", "/home");
});
