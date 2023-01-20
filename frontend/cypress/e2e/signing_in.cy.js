describe("Signing in", () => {

  before(() => {
    cy.signup("test name", "i am a test", "user@email.com", "Password123!")
  })

  it("with valid credentials, redirects to '/feed'", () => {
    cy.visit("/login");
    cy.get("#email").type("user@email.com");
    cy.get("#password").type("Password123!");
    cy.get(".login").click();
    cy.url().should("include", "/feed");
  });

  it("with missing password, redirects to '/login'", () => {
    cy.visit("/login");
    cy.get("#email").type("someone@example.com");
    cy.get(".login").click();

    cy.url().should("include", "/login");
  });

  it("with missing email, redirects to '/login'", () => {
    cy.visit("/login");
    cy.get("#password").type("Password123!");
    cy.get(".login").click();
    cy.url().should("include", "/login");
  });
});