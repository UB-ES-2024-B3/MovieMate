describe('MovieMate Login Flow', () => {

    before(() => {
        cy.fixture('user').as('testUser');
    });

    // Test for the Login process
    it('should log in an existing user successfully', function() { // Use function() to access the correct context
        // Visit the login page
        cy.visit('http://localhost:8000/login');

        // Fill in the login form
        cy.get('input[placeholder="Your username"]').type(this.testUser.userName); // Ensure the property name matches the fixture
        cy.get('#password').type(this.testUser.password);

        // Click the "Log in" button using the class
        cy.get('.submit_button').click();

        // Verify that login was successful by checking the URL
        cy.url().should('include', `/user/${this.testUser.userName}`);

        // Check if the profile page contains @username
        cy.get('h3')
            .should('contain', `@${this.testUser.userName}`);
    });
});