// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Run the registration test first
before(() => {
    cy.fixture('user').then((testUser) => {
        cy.visit('http://localhost:8000/register');

        // Fill in the registration form
        cy.get('input[placeholder="Your username"]').type(testUser.userName);
        cy.get('input[placeholder="Your email"]').type(testUser.email);
        cy.get('#password').type(testUser.password);
        cy.get('#confirm_password').type(testUser.password);
        cy.get('#birthdate').type(testUser.birthDate); // Using id #birthdate to match the input field
        cy.get('body').click(); // Click outside to close the datepicker
        cy.get('#gender').select(testUser.gender); // Using id #gender to match the select field

        // Submit the form
        cy.contains('Create Account').click();

        // Check that the toast notification appears with the expected message
        cy.contains('Registration successful').should('be.visible');

        // Verify the redirect to login page
        cy.url({ timeout: 10000 }).should('include', '/login');

    });
});

// Global cleanup code
after(() => {
    cy.fixture('user').then((userData) => {
        cy.request('DELETE', `http://127.0.0.1:3000/user/${userData.userName}`).then((response) => {
            expect(response.status).to.eq(200); // Ensure the user was deleted successfully
        });
    });
});