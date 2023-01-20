
describe("Making a post", () => {

  before(() => {
    cy.signup("someone", "i am someone", "test@test.com", "Password123!")
    cy.login("test@test.com", "Password123!")
  })

  it("creates a new post that is at the top of the page", () => {
    cy.url().should("include", "/feed");
    cy.get("#input").type("test post");
    cy.get(".post-button").click();
    cy.get('#postMessageContent').should('contain', 'test post') 
  });

});