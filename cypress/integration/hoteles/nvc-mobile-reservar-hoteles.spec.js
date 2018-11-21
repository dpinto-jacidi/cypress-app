const hotel = 'Hesperia',
    fechaInicio = new Date(Date.now()).getDate() + 3,
    fechaFinal = (new Date(Date.now()).getDate()) + 5,
    numAdultos = '0',
    numChildren = '0',
    numHab = '1',
    nombreCliente = 'Lorenzo Pino',
    identificacion = 20238516,
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124752832',
    password = 'A0123456',
    numeroTarjeta = '4111111111111111',
    cvcTarjeta = '547',
    expMesTarjeta = '10',
    expYearTarjeta = '2026',
    moneda = 'VES';



describe('RESERVAR HOTELES', () => {

    beforeEach(function () {
        cy.viewport('iphone-6+')
    });

    it('BUSCAR HOTEL', () => {

        cy.BuscarHotel(hotel, fechaInicio, fechaFinal, numAdultos, numChildren, numHab);

    });


    it('ESCOGER HOTEL', () => {

        cy.get('.nvc-property-mobile__rooms')
            .find('article:first div')
            .click({ force: true })
            .then(() => {

                cy.get('.nvc-property-mobile__rooms')
                    .find('section:first select:eq(1)')
                    .select('number:1', { force: true })
                    .should('have.value', 'number:1')

                cy.get('button.ng-scope')
                    .click({ forcer: true })

            });

    });

    it('PAGAR RESERVACIÓN', () => {

        cy.SeleccionarMonedaMobile(moneda).then(() => {

            cy.wait(5000);

            cy.log('DATOS DEL CLIENTE')
            cy.get('input[name="clientNames"]:eq(1)')
                .type(nombreCliente);

            cy.get('input[name="identityCard"]:eq(1)')
                .type(identificacion);

            cy.get('input[name="clientEmail"]:eq(1)')
                .type(emailCliente);

            cy.get('input[name="clientPhone"]:eq(1)')
                .type(telCliente);

            cy.get('input[name="pass1"]:eq(1)')
                .type(password);

            cy.get('input[name="pass2"]:eq(1)')
                .type(password);


            cy.log('DATOS DE TDC')
            cy.get('.select_card')
                .children('p')
                .click({ force: true })
                .then(() => {

                    cy.get('input[name="CardNumber1_mobile"]')
                        .type(numeroTarjeta);

                    if (moneda === 'VES') {

                        cy.get('input[name="CardCvc1_mobile"]')
                            .type(cvcTarjeta);

                        cy.get('.nvc-button.nvc-button__default.ng-scope:eq(1)')
                            .children('span:nth-child(2)')
                            .invoke('text')
                            .then((montoPagar) => {

                                montoPagar.replace('por Bs.S').trim()

                                cy.get('input[name="cardAmount1_mobile"]')
                                    .type(montoPagar)
                            });

                    } else {

                        cy.get('input[name="CardCvv1_mobile"]')
                            .type(cvcTarjeta);

                    }


                    cy.get('select[name="expirationMonth1"]')
                        .select(expMesTarjeta)
                        .should('have.value', expMesTarjeta);

                    cy.get('select[name="expirationYear1"]')
                        .select(expYearTarjeta)
                        .should('have.value', expYearTarjeta);

                });

            cy.get('.nvc-button.nvc-button__default.ng-scope:first')
                .click({ force: true })
                .then(() => {

                    cy.get('.nvc-resume-mobile__header')
                        .find('div p.ng-scope')
                        .should((p) => {

                            expect(p).to.contain('El pago de su reserva se realizó con éxito');
                        })

                });
        });

    });

});


Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});
