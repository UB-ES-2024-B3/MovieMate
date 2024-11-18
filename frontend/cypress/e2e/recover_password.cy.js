describe('MovieMate Password Recovery Flow', () => {

    const nonExistingEmail = 'nonexistent@example.com'; // Use an invalid email

    before(() => {
        cy.fixture('user').as('testUser');
    });


    it('should intercept the recovery email link and get the token', function () {

        // Interceptar la solicitud para enviar el correo de recuperación
        cy.intercept('POST', 'http://localhost:3000/user/requestPasswordRecovery').as('sendRecoveryEmail');

        cy.visit('http://localhost:8000/login');

        // Click "Recovery password"
        cy.contains('Recover here').click();

        // Enter a valid email
        cy.get('input[placeholder="Enter your email address"]').type(this.testUser.email);

        // Click the Recover button
        cy.get('div.fixed.inset-0.bg-black.bg-opacity-50') // Target the modal
            .find('button')
            .contains('Recover')
            .click();

        // Verify that a success message is shown
        cy.contains('Email sent').should('be.visible');

        // Hacemos una solicitud POST real a la API
        /*cy.request({
            method: 'POST',
            url: 'http://localhost:3000/user/requestPasswordRecovery', // URL del endpoint
            body: {
                email: this.testUser.email // El correo que estamos enviando en la solicitud
            }
        }).then((response) => {
            // Verificamos que la respuesta del servidor es exitosa (código 200)
            expect(response.status).to.eq(200);

            const recoveryLink = response.body;
            cy.log('Recovery Link:', recoveryLink);
            cy.visit(recoveryLink);

            cy.get('#password').type('newpassword123J.');
            cy.get('#confirm_password').type('newpassword123J.');
            cy.contains('button', 'Recovery Password').click();
        });*/

    });

    it('should show an error message for non-existing email', function() { // Use function() to access the correct context
        // Visit the login page
        cy.visit('http://localhost:8000/login');

        // Click "Recover password"
        cy.contains('Recover here').click();

        // Enter an invalid email
        cy.get('input[placeholder="Enter your email address"]').type(nonExistingEmail);

        // Click the "Recover" button inside the modal
        cy.get('div.fixed.inset-0.bg-black.bg-opacity-50') // Target the modal
            .find('button')
            .contains('Recover')
            .click();

        // Verify that an error message is shown
        cy.contains('User with email does not exist').should('be.visible');
    });
});