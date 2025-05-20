import { DATA_TEST_ID_VALUES } from "/src/constants/test";

describe(
  "Searching",
  { defaultCommandTimeout: Cypress.env("MAX_TIMEOUT") },
  () => {
    before(() => {
      cy.loginByLocalStorage();
      cy.visit(`${Cypress.env("BASE_URL")}/experiences`);
      cy.await();
    });

    beforeEach(() => {
      cy.visit(`${Cypress.env("BASE_URL")}/experiences`);
      cy.await();
    });

    it("should ensure search text tag was added after being written and saved", () => {
      cy.gClearTypeAndSaveByIndex(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH,
        "#searchInput",
        0,
        "test"
      );
      cy.gContains(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH,
        "test",
        ".multiselect__tag"
      );
      cy.gClickByIndex(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH,
        ".multiselect__tag-icon",
        0
      );
      cy.gNotContain(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH,
        "test",
        ".multiselect__tags-wrap"
      );
    });

    it("should remains search text tag after the page is refreshed", () => {
      cy.gClearTypeAndSaveByIndex(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH,
        "#searchInput",
        0,
        "test"
      );
      cy.gContains(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH,
        "test",
        ".multiselect__tag"
      );
      cy.reload();
      cy.gContains(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH,
        "test",
        ".multiselect__tag"
      );
    });

    it("should ensure quotes results are based on type filter", () => {
      cy.visit(`${Cypress.env("BASE_URL")}/quotes`);
      cy.await();
      cy.gClick(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TYPE);
      cy.gContains(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TYPE,
        "Experience"
      ).click();
      cy.gClick(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH_BUTTON);
      cy.await();
      cy.gThen(
        DATA_TEST_ID_VALUES.QUOTES_TABLE,
        ($row) => {
          cy.wrap($row).contains("Experience");
        },
        "table tbody tr"
      );
    });

    it("should remain tags filter  after the page is refreshed", () => {
      cy.gClick(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TAGS);
      cy.gContains(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TAGS,
        Cypress.env("FILTER_QUOTE_TAG")
      ).click();
      cy.reload();
      cy.gContains(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TAGS,
        Cypress.env("FILTER_QUOTE_TAG"),
        ".multiselect__tag"
      );
    });

    it("should send the correct payload when submitting quotes search", () => {
      cy.visit(`${Cypress.env("BASE_URL")}/quotes`);
      cy.await();
      cy.gClick(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH);
      cy.gClearTypeAndSaveByIndex(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH,
        "#searchInput",
        0,
        "test"
      );
      cy.gClick(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TYPE);
      cy.gContains(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TYPE, "All").click();
      cy.gClick(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH_BUTTON);
      cy.intercept("GET", "/api/v1/tenant/itinerary*", (req) => {
        const { searchParams } = new URL(req.url);
        expect(searchParams.get("title")).to.eq("test");
        expect(searchParams.get("code")).to.eq("test");
        expect(searchParams.get("type")).to.eq("");
      });
      cy.await();
    });

    it("should send the correct payload when submitting quotes search after on page load", () => {
      cy.visit(`${Cypress.env("BASE_URL")}/quotes`);
      cy.await();
      cy.gClick(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH);
      cy.gClearTypeAndSaveByIndex(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH,
        "#searchInput",
        0,
        "test"
      );
      cy.gClick(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TYPE);
      cy.gContains(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TYPE, "All").click();
      cy.gClick(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TAGS);
      cy.gContains(
        DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_TAGS,
        Cypress.env("FILTER_QUOTE_TAG")
      ).click();

      cy.reload();
      cy.intercept("GET", "/api/v1/tenant/itinerary*", (req) => {
        const { searchParams } = new URL(req.url);
        expect(searchParams.get("title")).to.eq("test");
        expect(searchParams.get("code")).to.eq("test");
        expect(searchParams.get("type")).to.eq("");
        expect(searchParams.get("tag")).to.eq("31");
      });
      cy.await();
    });

    it("Should display quotes results based on the quotes search form #1238", () => {
      cy.gClick(DATA_TEST_ID_VALUES.LOAD_MORE_EXPERIENCES_BUTTON, "");

      cy.gClick(DATA_TEST_ID_VALUES.QUOTES_SEARCH_FORM_SEARCH_BUTTON, "");

      cy.gValidateElementsLengthLessThan(
        DATA_TEST_ID_VALUES.EXPERIENCES_PAGE,
        ".card",
        9
      );
    });
  }
);
