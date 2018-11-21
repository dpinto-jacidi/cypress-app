const nombreCliente = 'Manuel Perez',
    identificacion = 21563927,
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124752832',
    numeroTarjeta = '4111111111111111',
    expTarjeta = '0530',
    cvcTarjeta = '262',
    moneda = 'USD',
    vueloUrl = 'http://www.development.nevicu.com/app_stg.php/flights/search/CCS/MIA?adult=1&kid=0&startDate=30-11-2018&flightSearch=true&roundTrip=0&listSuggestions=';


let montoPagar = '';


describe('PAGAR VUELO', () => {
    it('IR A PAGAR', () => {

        cy.PagarVuelo(vueloUrl).then(() => {
            cy.SeleccionarMoneda(moneda).then(() => {
                cy.wait(5000)

            });
        });

    });

    it('DATOS DEL CLIENTE', () => {

        cy.get('input[name="fullName0"]:first')
            .type(nombreCliente);

        cy.get('input[name="documentNumber0"]:first')
            .type(identificacion);

        cy.get('input[name="email0"]:first')
            .type(emailCliente);

        cy.get('input[name="phone0"]:first')
            .type(telCliente);

        cy.get('#birthDay0')
            .select('08')
            .should('have.value', '08');

        cy.get('#birthMonth0')
            .select('10')
            .should('have.value', '10');

        cy.get('#birthYear0')
            .select('1992')
            .should('have.value', '1992');

    })

    it('PAYPAL', () => {

        cy.get('#pyp')
            .click({ force: true })
            .then(() => {

                cy.get('.paypal-button:first')
                    .click({ force: true });

            });

    })

});

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});