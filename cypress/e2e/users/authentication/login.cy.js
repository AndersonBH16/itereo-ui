describe("Login", { defaultCommandTimeout: Cypress.env("MAX_TIMEOUT") }, () => {
  beforeEach(() => {
    window.localStorage.clear();
    cy.visit(Cypress.env("BASE_URL"));
  });

  const emailInput = ".loginForm-field > div > input";
  const emailValue = Cypress.env("AUTH_EMAIL");
  const passwordInput =
    ".field-password > .passwordContainer > .password > input";
  const passwordValue = Cypress.env("AUTH_PASSWORD");
  const badPasswordValue = passwordValue + "incorrect";
  const signInButton = ".loginForm-field button p";
  const itinerariesList = "table > tbody";

  it("displays text for registering in the page", () => {
    cy.contains("New to Itereo");
  });

  it("types data into the email input", () => {
    cy.get(emailInput).type(emailValue);
    cy.get(emailInput).should("have.value", emailValue);
  });

  it("types data into the password input", () => {
    cy.get(passwordInput).type(passwordValue);
    cy.get(passwordInput).should("have.value", passwordValue);
  });

  it("block access if credentials are incorrect when trying to log in", () => {
    cy.get(emailInput).type(emailValue);
    cy.get(passwordInput).type(badPasswordValue);
    cy.get(signInButton).contains("Sign In").click();
    cy.contains("Invalid credentials");
  });

  it("show itineraries list if credentials are correct when trying to log in", () => {
    cy.get(emailInput).type(emailValue);
    cy.get(passwordInput).type(passwordValue);
    cy.get(signInButton).contains("Sign In").click();

    cy.get(itinerariesList).children().should("have.length", 10);
  });
});
