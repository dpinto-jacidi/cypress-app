const origen = 'Caracas',
    destino = 'Miami',
    tipo = 2,
    fechaInicio = new Date(Date.now()).getDate(),
    fechaFinal = (new Date(Date.now()).getDate()) + 12,
    numAdultos = '0',
    numChildren = '0',
    nombreCliente = 'Rosa Lopez',
    identificacion = 23424537,
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124752832',
    numeroTarjeta = '4111111111111111',
    expTarjeta = '0530',
    cvcTarjeta = '262',
    moneda = 'VES';

describe('COMPRAR VUELOS', () => {
    /*it('BUSCAR Y ESCOGER VUELO', () => {

        cy.log('BUSCAR VUELO')
        cy.BuscarVuelo(origen, destino, tipo, fechaInicio, fechaFinal, numAdultos, numChildren).then(() => {

            cy.wait(10000);
            cy.log('ESCOGER VUELO');

            cy.get('section.nvc-container.hidden-xs').then((container) => {

                if (container.children('h3:nth-child(2)').length) {

                    cy.get('.button.ng-scope:first')
                        .children('button')
                        .click({ force: true });

                } else {

                    cy.get('button.nvc-button__default:eq(0)')
                        .click({ force: true })

                    cy.get('.nvc-table--flights.ng-scope')
                        .find('tbody tr.head-calendar th.active:first')
                        .click({ force: true })
                        .then(() => {
                            cy.get('.button.ng-scope:first')
                                .children('button')
                                .click({ force: true });
                        });

                }
            });

        });

    });*/

    it('IR A PAGAR', () => {

        cy.visit(vueloUrl).then(() => {
            cy.wait(15000)
        })
    
        cy.get('section.nvc-container.hidden-xs').then((container) => {
    
            if (container.children('h3:nth-child(2)').length > 0) {
                cy.get('.button.ng-scope:first')
                    .children('button')
                    .click({ force: true });
            } else {
    
                cy.get('.nvc-table--flights.ng-scope')
                    .find('tbody tr.head-calendar th.active:first')
                    .click({ force: true })
                    .then(() => {
                        cy.get('.button.ng-scope:first')
                            .children('button')
                            .click({ force: true });
                    });
    
            }
        });

    });

    it('DATOS DEL CLIENTE', () => {

        cy.SeleccionarMoneda(moneda).then(() => {
            cy.wait(5000)
        });

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

    });

    it('DATOS DE TDC', () => {

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

    });

    it('PAGAR', () => {

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

});

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});
