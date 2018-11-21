const nombreCliente = 'Manuel Perez',
    identificacion = 21563927,
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124752832',
    numeroTarjeta = '4111111111111111',
    expTarjeta = '0530',
    cvcTarjeta = '262',
    moneda = 'VES',
    vueloUrl = 'http://www.development.nevicu.com/app_stg.php/flights/search/CCS/MIA?adult=1&kid=0&startDate=30-11-2018&flightSearch=true&roundTrip=0&listSuggestions=';

let montoPagar = '';


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

        cy.get('input[name="cardAmount"]')
            .should('have.attr', 'placeholder')
            .then((placeholder) => {
                montoPagar = placeholder.replace('Monto a pagar ', '');
            });
    })

    it('TRANSFERENCIA', () => {

        cy.get('.btn-trasfer span')
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

        cy.wait(5000)

        cy.get('.nvc-navbar__signedin')
            .find('li a:eq(0)')
            .click({ force: true })
            .then(() => {

                cy.get('.nvc-dropdown__menu.nvc-notifications')
                    .find('li:nth-child(2) a')
                    .click({ force: true })
                    .then(() => {

                        cy.get('.nvc-dropdown.nvc-dropdown__block')
                            .trigger('mouseover')
                            .then(() => {

                                cy.get('.nvc-dropdown__menu:eq(1)')
                                    .find('li a:nth-child(2)')
                                    .click({ force: true });
                            });
                    });
            });

        cy.get('.text-right')
            .children('a')
            .click({ force: true })
            .then(() => {

                cy.get('select[name="bank"]:eq(0)')
                    .select('0134');

                cy.get('select[name="bank"]:eq(1)')
                    .should('have.value', '{"id":"0134","title":"Banesco"}');

                cy.get('input:eq(0)')
                    .type('0237172633');

                cy.get('input:eq(1)')
                    .type(montoPagar);

                cy.get('button.ng-scope:eq(0)')
                    .click({ force: true });
            });

    });

});

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});