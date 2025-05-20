import { DATA_TEST_ID_VALUES } from "/src/constants/test";

Cypress.Commands.add("selectPhotoAndSave", (photoToSelectIndex) => {
  cy.url().should("contain", "/quote/itinerary");
  cy.gContains(
    DATA_TEST_ID_VALUES.ITINERARY_DAY_PHOTOS_CONTROL,
    "Select Photo",
    "button"
  )
    .first()
    .click();
  cy.await();

  cy.gThen(DATA_TEST_ID_VALUES.PHOTOS_GALLERY, (element) => {
    const photos = Cypress.$(element[0]).find("div .check.is-success");
    if (photos.length >= photoToSelectIndex) {
      cy.wrap(photos.eq(photoToSelectIndex - 1)).click();

      cy.gContains(
        DATA_TEST_ID_VALUES.ITINERARY_DAY_PHOTOS_CONTROL,
        "Select Photo",
        "button"
      );
      cy.gBeChecked(
        DATA_TEST_ID_VALUES.PHOTOS_GALLERY,
        `> div:nth-child(${photoToSelectIndex}) input`
      );
      cy.gClickForce(DATA_TEST_ID_VALUES.SAVE_PHOTO_BUTTON);
    } else {
      cy.gClickForce(
        DATA_TEST_ID_VALUES.CLOSE_MODAL_BUTTON,
        "button.modal-close"
      );
    }

    cy.gContains(DATA_TEST_ID_VALUES.ITINERARY_DAY_SAVE_BUTTON, "Save").click();
    cy.await();
  });
});
