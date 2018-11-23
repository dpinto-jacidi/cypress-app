const origen = 'Caracas',
    destino = 'Miami',
    tipo = 1,
    fechaInicio = new Date(Date.now()).getDate() + 2,
    fechaFinal = (new Date(Date.now()).getDate()) + 4,
    numAdultos = '2',
    numChildren = '2',
    nombreCliente = 'Mario Lopez',
    identificacion = 19284428,
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124562364',
    numeroTarjeta = '4111111111111111',
    expTarjeta = '0530',
    cvcTarjeta = '262',
    moneda = 'VES',
    datosPasajeros = [
        {
            "nombre": "Mario Lopez",
            "cedula": "19284428",
            "email": emailCliente,
            "telefono": "04124562364",
            "genero": "M",
            "dia": "02",
            "mes": "06",
            "ano": "1991"
        },
        {
            "nombre": "Rosa Ruiz",
            "cedula": "19538294",
            "email": Math.random().toString(36).substring(7) + '@gmail.com',
            "telefono": "04124562364",
            "genero": "F",
            "dia": "05",
            "mes": "03",
            "ano": "1993"
        },
        {
            "nombre": "Carla Lopez",
            "cedula": "19284428",
            "email": Math.random().toString(36).substring(7) + '@gmail.com',
            "telefono": "04124562364",
            "genero": "F",
            "dia": "15",
            "mes": "10",
            "ano": "2010"
        },
        {
            "nombre": "Luis Lopez",
            "cedula": "19284428",
            "email": Math.random().toString(36).substring(7) + '@gmail.com',
            "telefono": "04124562364",
            "genero": "M",
            "dia": "05",
            "mes": "04",
            "ano": "2012"
        }
    ];

describe('COMPRAR VUELOS', () => {
    it('BUSCAR Y ESCOGER VUELO', () => {

        cy.log('BUSCAR VUELO')
        cy.BuscarVuelo(origen, destino, tipo, fechaInicio, fechaFinal, numAdultos, numChildren).then(() => {


            cy.wait(30000).then(() => {
                cy.log('ESCOGER VUELO')

                cy.get('section.nvc-container.hidden-xs').then((container) => {

                    if (container.children('h3:nth-child(2)').length) {

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

        });

    });

    it('DATOS DEL CLIENTE', () => {

        cy.SeleccionarMoneda(moneda).then(() => {
            cy.wait(5000);
        });


        for (let i = 0; i < (parseInt(numAdultos) + parseInt(numChildren)); i++) {

            cy.get('input[name="fullName' + i + '"]:first')
                .type(datosPasajeros[i].nombre);

            cy.get('input[name="documentNumber' + i + '"]:first')
                .type(datosPasajeros[i].cedula);

            cy.get('input[name="email' + i + '"]:first')
                .type(datosPasajeros[i].email);

            cy.get('input[name="phone' + i + '"]:first')
                .type(datosPasajeros[i].telefono);

            if (datosPasajeros[i].genero === "M") {

                cy.get('.genre:eq(' + i + ')')
                    .find('div p:nth-child(2)')
                    .click({ force: true })

            }

            cy.get('#birthDay' + i)
                .select(datosPasajeros[i].dia)
                .should('have.value', datosPasajeros[i].dia);

            cy.get('#birthMonth' + i)
                .select(datosPasajeros[i].mes)
                .should('have.value', datosPasajeros[i].mes);

            cy.get('#birthYear' + i)
                .select(datosPasajeros[i].ano)
                .should('have.value', datosPasajeros[i].ano);

        }
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
