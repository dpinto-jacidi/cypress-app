const nombreCliente = 'Maria Barrios',
    identificacion = 20547234,
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124752832',
    numeroTarjeta = '4716491806754048',
    expMesTarjeta = '07',
    expYearTarjeta = '2028',
    cvcTarjeta = '262',
    moneda = 'EUR',
    vueloUrl = 'http://www.development.nevicu.com/app_stg.php/flights/search/CCS/MIA?adult=1&kid=0&startDate=30-11-2018&flightSearch=true&roundTrip=0&listSuggestions=caracas';


describe('PAGAR VUELO', () => {

    beforeEach(function () {
        cy.viewport('iphone-6+')
    });

    it('IR A PAGAR', () => {


        cy.PagarVuelo(vueloUrl).then(() => {
            cy.SeleccionarMonedaMobile(moneda).then(() => {
                cy.wait(5000)
            });
        });

    });

    it('DATOS DEL CLIENTE', () => {

        cy.get('input[name="fullName0"]:eq(1)')
            .type(nombreCliente);

        cy.get('input[name="documentNumber0"]:eq(1)')
            .type(identificacion);

        cy.get('input[name="email0"]:eq(1)')
            .type(emailCliente);

        cy.get('input[name="phone0"]:eq(1)')
            .type(telCliente);

        cy.get('.inputDates__birth:eq(0)')
            .select('08')
            .should('have.value', '08');

        cy.get('.inputDates__birth:eq(1)')
            .select('05')
            .should('have.value', '05');

        cy.get('.inputDates__birth:eq(2)')
            .select('1992')
            .should('have.value', '1992');
    })

    it('DATOS TDC', () => {

        cy.get('input[name="CardNumber1_mobile"]')
            .type(numeroTarjeta);

        if (moneda === 'VES') {

            cy.get('input[name="CardCvc1_mobile"]')
                .type(cvcTarjeta);

            cy.get('input[name="cardAmount1_mobile"]')
                .should('have.attr', 'placeholder')
                .then((placeholder) => {

                    const montoPagar = placeholder.replace('Monto a pagar ', '');
                    cy.get('input[name="cardAmount1_mobile"]')
                        .type(montoPagar);

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



    })

    it('PAGAR/COMPRAR', () => {
        cy.get('.nvc-button.nvc-button__default:eq(1)')
            .click({ force: true })
            .then(() => {

                cy.wait(5000);

                const textosError = [
                    'La cedula de identidad no coincide',
                    'con el número de tarjeta',
                    'La disponibilidad de vuelos ha cambiado',
                    'por favor intentalo nuevamente'
                ];

                cy.get('.nvc-modal--payment')
                    .find('.nvc-modal__content--right .nvc-modal__content--wrapper .nvc-modal__content--error.visible-xs:first span')
                    .should((span) => {

                        let textoCorrecto = false;
                        if (textosError.indexOf(span.text().trim()) > -1) textoCorrecto = true;

                        expect(textoCorrecto).to.be.true
                    });

                cy.get('.nvc-modal--payment')
                    .find('.nvc-modal__content--right .nvc-modal__content--wrapper .nvc-modal__content--error.visible-xs:eq(1) span')
                    .should((span) => {

                        let textoCorrecto = false;
                        if (textosError.indexOf(span.text().trim()) > -1) textoCorrecto = true;

                        expect(textoCorrecto).to.be.true
                    });
            });
    })

})

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});