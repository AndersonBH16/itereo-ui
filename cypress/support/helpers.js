Cypress.Commands.add("gHaveValue", (id, value, selector = "") => {
  return cy.get(`[data-test-id=${id}] ${selector}`).should("have.value", value);
});

Cypress.Commands.add("gBeVisible", (id, selector = "") => {
  return cy.get(`[data-test-id=${id}] ${selector}`).should("be.visible");
});

Cypress.Commands.add("gBeChecked", (id, selector = "") => {
  return cy.get(`[data-test-id=${id}] ${selector}`).should("be.checked");
});

Cypress.Commands.add("gNotContain", (id, content, selector = "") => {
  return cy
    .get(`[data-test-id=${id}] ${selector}`)
    .should("not.contain", content);
});

Cypress.Commands.add("gBeGreaterThan", (id, value, selector = "") => {
  return cy
    .get(`[data-test-id=${id}] ${selector}`)
    .should("be.greaterThan", value);
});

Cypress.Commands.add("gClick", (id, selector = "") => {
  return cy.get(`[data-test-id=${id}] ${selector}`).click();
});

Cypress.Commands.add("gClickForce", (id, selector = "") => {
  return cy.get(`[data-test-id=${id}] ${selector}`).click({ force: true });
});

Cypress.Commands.add("gClickByIndex", (id, selector = "", index = 0) => {
  const elementPath =
    id.length > 0 ? `[data-test-id=${id}] ${selector}` : selector;
  return index === -1
    ? cy.get(elementPath).last().scrollIntoView().click({ force: true })
    : cy.get(elementPath).eq(index).scrollIntoView().click({ force: true });
});

Cypress.Commands.add("gSelect", (id, valueOrTextOrIndex) => {
  return cy.get(`[data-test-id=${id}] select`).select(valueOrTextOrIndex);
});

Cypress.Commands.add("gChildren", (id, selector = "") => {
  return cy.get(`[data-test-id=${id}] ${selector}`).children();
});

Cypress.Commands.add("gType", (id, text = "", selector = "") => {
  return cy.get(`[data-test-id=${id}] ${selector}`).type(text);
});

Cypress.Commands.add(
  "gClearTypeAndSaveByIndex",
  (id, selector = "", index = 0, value = "") => {
    const elementPath =
      id.length > 0 ? `[data-test-id=${id}] ${selector}` : selector;
    return index === -1
      ? cy
          .get(elementPath)
          .last()
          .invoke("val", "")
          .realType(value)
          .realType("{enter}")
      : cy
          .get(elementPath)
          .eq(index)
          .invoke("val", "")
          .realType(value)
          .realType("{enter}");
  }
);

Cypress.Commands.add("gContains", (id, content, selector = "") => {
  const elementPath =
    id.length > 0 ? `[data-test-id=${id}] ${selector}` : selector;
  return cy.get(elementPath).contains(content);
});

Cypress.Commands.add("gThen", (id, fn, selector = "") => {
  return cy.get(`[data-test-id=${id}] ${selector}`).then(fn);
});

Cypress.Commands.add("gFirst", (id, selector = "") => {
  const elementPath =
    id.length > 0 ? `[data-test-id=${id}] ${selector}` : selector;
  return cy.get(elementPath).first();
});

Cypress.Commands.add("gLast", (id, selector = "") => {
  const elementPath =
    id.length > 0 ? `[data-test-id=${id}] ${selector}` : selector;
  return cy.get(elementPath).last();
});

Cypress.Commands.add("gByIndex", (id, selector = "", index = 0) => {
  const elementPath =
    id.length > 0 ? `[data-test-id=${id}] ${selector}` : selector;
  return cy.get(elementPath).eq(index);
});

Cypress.Commands.add("await", (timeout = Cypress.env("MAX_TIMEOUT")) => {
  cy.wait(timeout);
});

Cypress.Commands.add("visitBasicInfo", (uuid) => {
  cy.visit(Cypress.env("BASE_URL") + "/quote/basic-info?itinerary=" + uuid);
});

Cypress.Commands.add(
  "gChildElementIfContains",
  (id, content, selectorToClick) => {
    return cy.get(`[data-test-id="${id}"]`).within(() => {
      return cy.contains("tr", content).within(() => {
        return cy.get(selectorToClick);
      });
    });
  }
);

Cypress.Commands.add(
  "gClickChildElementIfContains",
  (id, content, selectorToClick, childId = "") => {
    const childElementPath =
      childId.length > 0
        ? `[data-test-id=${childId}] ${selectorToClick}`
        : selectorToClick;

    cy.get(`[data-test-id="${id}"]`).within(() => {
      cy.contains("tr", content).within(() => {
        cy.get(childElementPath).scrollIntoView().click({ force: true });
      });
    });
  }
);

Cypress.Commands.add(
  "gTypeChildElementIfContains",
  (id, content, selectorToType, valueToType) => {
    cy.get(`[data-test-id="${id}"]`).within(() => {
      cy.contains("tr", content).within(() => {
        cy.get(selectorToType)
          .invoke("val", "")
          .realType(valueToType)
          .realType("{enter}");
      });
    });
  }
);

Cypress.Commands.add(
  "gGetChildElementValueIfContains",
  (id, content, selectorToGet) => {
    cy.get(`[data-test-id="${id}"]`)
      .contains("tr", content)
      .find(selectorToGet)
      .invoke("text");
  }
);

Cypress.Commands.add(
  "gValidateElementsLengthLessThan",
  (id, selector, maxCount) => {
    cy.get(`[data-test-id=${id}] ${selector}`).should(($elements) => {
      expect($elements).to.have.length.lessThan(maxCount);
    });
  }
);
