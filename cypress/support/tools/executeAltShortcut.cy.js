Cypress.Commands.add("executeAltShortcut", (id = "", complementKeyCode = 0) => {
  const elementToFocus = `[data-test-id=${id}]`;

  cy.get(elementToFocus).trigger("keydown", {
    keyCode: 18,
    which: 18,
    altKey: true,
    force: true,
  });
  cy.get(elementToFocus).trigger("keydown", {
    keyCode: complementKeyCode,
    which: complementKeyCode,
    altKey: true,
    force: true,
  });
  cy.get(elementToFocus).trigger("keyup", {
    keyCode: 18,
    which: 18,
    altKey: true,
    force: true,
  });
  cy.get(elementToFocus).trigger("keyup", {
    keyCode: complementKeyCode,
    which: complementKeyCode,
    altKey: true,
    force: true,
  });
});
