import { DATA_TEST_ID_VALUES } from "/src/constants/test";

describe(
  "Edition",
  { defaultCommandTimeout: Cypress.env("MAX_TIMEOUT") },
  () => {
    before(() => {
      cy.loginByLocalStorage();
      cy.duplicateQuote(Cypress.env("EMPTY_QUOTE"));
      cy.gContains(
        DATA_TEST_ID_VALUES.NAVBAR_SECONDARY_LINK,
        "Itinerary"
      ).click();
      cy.await();
    });

    beforeEach(() => {
      cy.gFirst(DATA_TEST_ID_VALUES.ITINERARY_DAY_EDIT_BUTTON).click();
    });

    it("edits title of day 1", () => {
      cy.gBeVisible(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_TITLE_EDIT_CONTROL,
        "input"
      ).clear();
      cy.gType(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_TITLE_EDIT_CONTROL,
        "Day 1 tittle edited",
        "input"
      );

      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_SAVE_BUTTON,
        "Save"
      ).click();
      cy.await();

      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_TITLE_VIEW,
        "Day 1 tittle edited"
      );
    });

    it("edits description of day 1", () => {
      cy.gThen(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_DESCRIPTION_EDIT_CONTROL,
        ($el) => {
          cy.wrap($el)
            .find(".ql-editor > p")
            .each(($p) => {
              cy.wrap($p).invoke("remove");
            });
        }
      );
      cy.gType(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_DESCRIPTION_EDIT_CONTROL,
        "Day 1 description edited",
        ".ql-editor > p"
      );

      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_SAVE_BUTTON,
        "Save"
      ).click();
      cy.await();

      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_DESCRIPTION_VIEW,
        "Day 1 description edited"
      );
    });

    it("edits location of day 1", () => {
      cy.gClickForce(DATA_TEST_ID_VALUES.ITINERARY_DAY_LOCATION_EDIT_CONTROL);
      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_LOCATION_EDIT_CONTROL,
        Cypress.env("ITINERARY_DAY_LOCATION_TO_TEST"),
        ".multiselect__content li"
      ).click();
      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_LOCATION_EDIT_CONTROL,
        Cypress.env("ITINERARY_DAY_LOCATION_TO_TEST"),
        ".multiselect__tag"
      ).should("be.visible");

      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_SAVE_BUTTON,
        "Save"
      ).click();
      cy.await();

      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_LOCATION_VIEW,
        Cypress.env("ITINERARY_DAY_LOCATION_TO_TEST")
      ).should("be.visible");

      cy.gFirst(DATA_TEST_ID_VALUES.ITINERARY_DAY_EDIT_BUTTON).click();
      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_LOCATION_EDIT_CONTROL,
        Cypress.env("ITINERARY_DAY_LOCATION_TO_TEST"),
        ".multiselect__tag"
      )
        .siblings()
        .click();

      cy.gNotContain(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_LOCATION_EDIT_CONTROL,
        Cypress.env("ITINERARY_DAY_LOCATION_TO_TEST"),
        ".multiselect__tags"
      );

      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_SAVE_BUTTON,
        "Save"
      ).click();
      cy.await();

      cy.gNotContain(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_LOCATION_VIEW,
        Cypress.env("ITINERARY_DAY_LOCATION_TO_TEST")
      );
    });

    it("edits photos of day 1", () => {
      cy.selectPhotoAndSave(1);
      cy.gFirst(DATA_TEST_ID_VALUES.ITINERARY_DAY_EDIT_BUTTON).click();
      cy.selectPhotoAndSave(2);
    });

    after(() => {
      cy.deleteCurrentQuote();
    });
  }
);
