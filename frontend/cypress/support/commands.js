// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('signup', (name, aboutMe, email, password) => {
  cy.visit("/signup");
  cy.get("#name").type(name);
  cy.get("#aboutMe").type(aboutMe);
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get(".detailsSubmit").click();
})

Cypress.Commands.add('login', (email, password) => {
  cy.visit("/login");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get(".login").click();
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })