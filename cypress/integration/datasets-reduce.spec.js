/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.intercept("PATCH", "/api/v3/Datasets/**/*").as("metadata");
    cy.intercept("GET", "*").as("fetch");
  });

  after(() => {
    cy.login(
      Cypress.config("secondaryUsername"),
      Cypress.config("secondaryPassword")
    );
    cy.removeDatasets();
  });

  describe("Reduce dataset", () => {
    it("should go to dataset details reduce tab and step through the workflow", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('input[type="search"][data-placeholder="Text Search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get(".mat-row").contains("Cypress Dataset").click();

      cy.wait("@fetch");

      cy.contains("Reduce").click();
      cy.wait(1000);

      cy.contains("Analyze").click();
      cy.contains("Next").click();

      cy.get("mat-select[formControlName=scriptForm]").first().click();

      cy.get(".mat-option-text")
        .contains("Plot")
        .then((option) => {
          option[0].click();
        });

      cy.get("#ScriptNext").click();
      cy.get("#runAction").click();
    });
  });
});
