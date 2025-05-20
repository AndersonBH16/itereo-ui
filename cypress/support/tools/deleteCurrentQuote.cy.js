Cypress.Commands.add("deleteCurrentQuote", () => {
  cy.location().then((loc) => {
    loc.search
      .substring(1)
      .split("&")
      .map((param) => {
        const [key, value] = param.split("=");
        if (key === "itinerary") {
          const authData = JSON.parse(window.localStorage.getItem("auth-data"));
          const tenant = authData.tenant;
          cy.request({
            method: "DELETE",
            url: `${tenant.baseURL}/tenant/itinerary/${value}`,
            auth: {
              bearer: authData.token,
            },
          });
        }
      });
  });
});
