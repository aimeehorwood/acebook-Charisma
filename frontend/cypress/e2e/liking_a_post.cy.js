
describe("Liking a post", () => {

  before(() => {
    cy.signup("someone", "i am someone", "test@test.com", "Password123!")
    cy.login("test@test.com", "Password123!")
  })

  it("likes a post when clicked once", () => {
    cy.url().should("include", "/feed");
    cy.get("#input").type("test post");
    cy.get(".post-button").click();
    setTimeout(1000)
    cy.get('#postMessageContent').should('contain', 'test post')
    cy.visit("/feed")
    cy.get(".likebtn").first().click();
    cy.get(".likebtn").first().should('contain',' Unlike 1')
  });

});