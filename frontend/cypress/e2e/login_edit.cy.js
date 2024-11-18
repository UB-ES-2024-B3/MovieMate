describe('MovieMate Login and Edit Profile Flow', () => {
    before(() => {
        // Cargar el usuario de prueba desde el fixture
        cy.fixture('user').as('testUser');
    });

    it('should log in and edit profile successfully', function() {
        // Visit the login page
        cy.visit('http://localhost:8000/login');

        // Fill in the login form
        cy.get('input[placeholder="Your username"]').type(this.testUser.userName);
        cy.get('#password').type(this.testUser.password);

        // Click the "Log in" button
        cy.get('.submit_button').click();

        // Verify that login was successful
        cy.url().should('include', `/user/${this.testUser.userName}`);
        cy.get('h3').should('contain', `@${this.testUser.userName}`);

        // Navigate to the edit profile page
        cy.contains('EDIT PROFILE').click();

        // Verify navigation to the edit profile page
        cy.url().should('include', '/editar');

        // Edit the profile form
        cy.get('input[placeholder="Your email"]').clear().type('updated_email@example.com');
        cy.get('textarea[placeholder="Your Description"]').clear().type('This is an updated description.');

        // Save changes
        cy.contains('Save Information').click();
        // Esperar para verificar el mensaje de éxito (por ejemplo, 2 segundos)
        cy.wait(2000);
        // Wait for the toast message and verify it
        cy.contains('Perfil actualizado con éxito').should('be.visible');

        // Verify updated description on profile page
        cy.get('p').should('contain', 'This is an updated description.');
    });
});
