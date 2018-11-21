const nombreCliente = 'Rosa Cruz',
    identificacion = 20547234,
    emailCliente = Math.random().toString(36).substring(7) + '@gmail.com',
    telCliente = '04124752832',
    numeroTarjeta = '4111111111111111',
    expMesTarjeta = '05',
    expYearTarjeta = '2028',
    cvcTarjeta = '262',
    moneda = 'VES',
    vueloUrl = 'http://www.development.nevicu.com/app_stg.php/flights/search/VLN/YQB?adult=1&kid=0&startDate=24-11-2018&endDate=28-11-2018&flightSearch=true&roundTrip=1&listSuggestions=';


describe('PAGAR VUELO', () => {

    beforeEach(function () {
        cy.viewport('iphone-6+');
    });

    it('IR A PAGAR', () => {

        cy.PagarVueloMobile(vueloUrl).then(() => {
            cy.SeleccionarMonedaMobile(moneda).then(() => {
                cy.wait(5000);
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

    });

    it('PAGAR/COMPRAR', () => {
        cy.get('.nvc-button.nvc-button__default:eq(1)')
            .click({ force: true })
            .then(() => {

                cy.wait(5000);

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