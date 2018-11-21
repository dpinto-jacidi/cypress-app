const hotel = 'Casas Del Sol',
    fechaInicio = new Date(Date.now()).getDate() + 3,
    fechaFinal = (new Date(Date.now()).getDate()) + 5,
    numAdultos = '2',
    numChildren = '2',
    numHab = '1',
    nombreCliente = 'Pedro Martinez',
    identificacion = 21245859,
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124752832',
    password = 'A0123456',
    numeroTarjeta = '4111111111111111',
    expTarjeta = '0530',
    cvcTarjeta = '262',
    moneda = 'VES';



describe('RESERVAR HOTELES', () => {

    it('BUSCAR HOTEL', () => {

        cy.BuscarHotel(hotel, fechaInicio, fechaFinal, numAdultos, numChildren, numHab);

    });


    it('ESCOGER HOTEL', () => {

        cy.get('main').then((body) => {

            let nombreHotel,
                checkIn,
                checkOut;

            const textoHab = numHab + (numHab > 1 ? ' habitaciones ' : ' habitación '),
                textoNoche = (fechaFinal - fechaInicio) + ' noche';

            if (body.children('.nvc-container').length) {

                cy.log('ALOJAMIENTO ENCONTRADO')

                cy.get('h2.ng-binding')
                    .invoke('text')
                    .then((text) => {
                        nombreHotel = text;
                    });


                cy.get('.nvc-search__input--date-start input')
                    .invoke('val')
                    .then((val) => {
                        checkIn = val;
                    });

                cy.get('.nvc-search__input--date-end input')
                    .invoke('val')
                    .then((val) => {
                        checkOut = val;
                    });


                if (numAdultos > 0) {

                    cy.get('.nvc-table')
                        .find('tbody tr:first td:nth-child(2) div:first select')
                        .select(numAdultos)
                        .should('have.value', 'number:' + numAdultos);

                }

                if (numChildren > 0) {

                    cy.get('.nvc-table')
                        .find('tbody tr:first td:nth-child(2) div:nth-child(2) select')
                        .select(numChildren)
                        .should('have.value', 'number:' + numChildren);

                    for (let i = 0; i < numChildren; i++) {

                        let childrenAge = Math.floor(Math.random() * 11) + 1;
                        cy.get('.nvc-table')
                            .find('tbody tr:first td:nth-child(2) div:nth-child(' + (i + 3) + ') select')
                            .select('number:' + childrenAge)
                            .should('have.value', 'number:' + childrenAge);

                    }

                }

                cy.get('.nvc-table')
                    .find('tbody tr:first td:nth-child(4) select')
                    .select(numHab)
                    .should('have.value', 'number:' + numHab);


                cy.get('.nvc-button.nvc-button__default.nav-grow:first').click();

                cy.get('section.right-panel')
                    .children('.nvc-reservation__data')
                    .should((data) => {

                        expect(data.find('h3:first'))
                            .to.contain(nombreHotel);

                        expect(data.find('h5.ng-binding span:first'))
                            .to.contain(textoHab);

                        expect(data.find('h5.ng-binding'))
                            .to.contain(textoNoche);

                        expect(data.find('h4:first span:first'))
                            .to.contain(checkIn);

                        expect(data.find('h4:first span:nth-child(2)'))
                            .to.contain(checkOut);

                        /*expect(data.find('h4:nth-child(2) span:first'))
                            .to.contain(numAdultos);

                        /*if (numChildren > 0) {
                            expect(data.find('h4:nth-child(2) span:nth-child(2)'))
                                .to.contain(numChildren)
                        }*/

                    });


            } else {

                cy.log('ALOJAMIENTO NO NCONTRADO')

                cy.get('.nvc-list-search__noProperties')
                    .children('.center')
                    .should((div) => {

                        expect(div.children('img'))
                            .to.have.length(1);

                        expect(div.children('h1').eq(0))
                            .to.have.class('title')
                            .to.have.text('¡Viajero!');

                        expect(div.children('h1').eq(1))
                            .to.have.text('No encontramos alojamiento disponible para tu búsqueda');

                        expect(div.children('h2'))
                            .to.have.text('Te invitamos a consultar nuevamente en nuestra lista de destinos,  o verificar las fechas que deseas seleccionar');
                    })

            }

        })

    });

    it('PAGAR RESERVACIÓN', () => {

        cy.SeleccionarMoneda(moneda).then(() => {

            cy.wait(5000);

            cy.log('DATOS DEL CLIENTE')
            cy.get('input[name="clientNames"]:first')
                .type(nombreCliente);

            cy.get('input[name="identityCard"]:first')
                .type(identificacion);

            cy.get('input[name="clientEmail"]:first')
                .type(emailCliente);

            cy.get('input[name="clientPhone"]:first')
                .type(telCliente);

            cy.get('input[name="pass1"]:first')
                .type(password);

            cy.get('input[name="pass2"]:first')
                .type(password);


            cy.log('DATOS DE TDC')
            cy.get('.btn-tarjet span').click({ force: true })

            cy.get('input[name="CardNumber"]:first')
                .type(numeroTarjeta);

            cy.get('input[name="CardExpiry"]:first')
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

            cy.get('.nvc-button.nvc-button__default.ng-scope:first')
                .click({ force: true })
                .then(() => {

                    cy.wait(10000);

                    cy.get('.nvc-resume')
                        .children('.nvc-resume__container section:nth-child(1)')
                        .should((section) => {

                            expect(section.children('>h1'))
                                .to.contain('Gracias por reservar con navicu.com');

                            expect(section.children('>h2'))
                                .to.contain('El pago de su reserva se realizó con éxito');
                        });


                });
        });

    });

});


Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});
