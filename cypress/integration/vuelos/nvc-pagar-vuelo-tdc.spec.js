const nombreCliente = 'Alejandra Noriega',
    identificacion = 21049294,
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124752832',
    numeroTarjeta = '4111111111111111',
    expTarjeta = '0530',
    cvcTarjeta = '262',
    moneda = 'USD',
    vueloUrl = 'http://www.development.nevicu.com/app_stg.php/flights/search/CCS/LIS?adult=1&kid=0&startDate=24-11-2018&endDate=27-11-2018&flightSearch=true&roundTrip=1&listSuggestions=';


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

    it('DATOS TDC', () => {

        cy.get('input[name="CardNumber"]')
            .type(numeroTarjeta);

        cy.get('input[name="CardExpiry"]')
            .type(expTarjeta);

        if (moneda === 'VES') {

            cy.get('input[name="CardCvc"]')
                .type(cvcTarjeta);


            cy.get('input[name="cardAmount"]')
                .should('have.attr', 'placeholder')
                .then((placeholder) => {
                    const montoPagar = placeholder.replace('Monto a pagar ', '')
                    cy.get('input[name="cardAmount"]')
                        .type(montoPagar)
                });

        } else {

            cy.get('input[name="CardCvv"]')
                .type(cvcTarjeta);

        }

    })
    it('PAGAR/COMPRAR', () => {
        
        cy.get('button.ng-scope')
            .click({ force: true })
            .wait(5000)
            .then(() => {

                cy.get('.nvc-flight-resume__content')
                    .find('.nvc-container h2')
                    .should((h2) => {
                        expect(h2.children('img')).to.have.length(1);
                        expect(h2).to.contain('Vuelo confirmado');
                    });

            });
    });

})

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});