const nombreCliente = 'Marta Naranjo',
    identificacion = 19245738,
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124752832',
    numeroTarjeta = '4111111111111111',
    expTarjeta = '0530',
    cvcTarjeta = '262',
    moneda = 'VES',
    vueloUrl = 'http://www.development.nevicu.com/app_stg.php/flights/search/CCS/PMV?adult=1&kid=0&startDate=15-11-2018&flightSearch=true&roundTrip=0&listSuggestions=cara';


describe('PAGAR VUELO', () => {
    it('IR A PAGAR', () => {

        cy.PagarVuelo(vueloUrl).then(() => {
            cy.SeleccionarMoneda(moneda).then(() => {
                cy.wait(5000);
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

    it('MPANDCO', () => {

        cy.get('.btn-mPandco span')
            .click({ force: true })
            .then(() => {

                cy.get('input[name="confirEmail"]:first')
                    .should('have.value', emailCliente);

                cy.get('input[name="clientEmail"]:first')
                    .should('have.value', emailCliente);

            });

        cy.get('button.ng-scope')
            .click({ force: true });

    })


    it('CONFIRMAR TRANSFERENCIA', () => {

        cy.get('.resume-pre-reservation__page--nvc-jumbotron__paymentData')
            .find('div:nth-child(1) input:eq(0)')
            .type('123515623');

        cy.get('.grandtotal')
            .children('h2')
            .invoke('text')
            .then((text) => {

                const montoPagar = text.replace('TOTALl Bs.S ', '').replace('.', '');
                cy.get('.resume-pre-reservation__page--nvc-jumbotron__paymentData')
                    .find('div:nth-child(1) input:eq(1)')
                    .type(montoPagar);

            });

        cy.get('.nvc-button.nvc-button__default.nvc-button__block:first')
            .click({ force: true });

    });

});

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});