/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));
  });

  after(() => {
    cy.login(
      Cypress.config("secondaryUsername"),
      Cypress.config("secondaryPassword")
    );
    cy.removeDatasets();
  });

  describe("Add item to cart and publish", () => {
    it("should add dataset to cart", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('input[type="search"][data-placeholder="Text Search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("[data-cy=checkboxInput]").first().click();

      cy.get("#addToBatchButton").click();

      cy.get("#cartOnHeaderButton").click();

      cy.get("a.button").click();

      cy.get("#publishButton").click();

      cy.get("#titleInput").type("some title text");

      cy.get("#abstractInput").type("some abstract text");

      cy.get("#publishButton").click();

      cy.get("#doiRow").should("exist");
    });
  });
});
